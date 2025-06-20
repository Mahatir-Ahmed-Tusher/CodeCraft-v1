import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage.ts";
import { insertProjectSchema, insertChatMessageSchema, type GeneratedCode, type CodeArtifact } from "../shared/schema.js";
import { z } from "zod";
import fetch from "node-fetch";
import archiver from "archiver";
import { promisify } from "util";
import { exec } from "child_process";

const execAsync = promisify(exec);

// Validate OPENROUTER_API_KEY
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
if (!OPENROUTER_API_KEY) {
  console.error("OPENROUTER_API_KEY is not configured in .env");
  throw new Error("Missing OPENROUTER_API_KEY");
} else {
  console.log("OPENROUTER_API_KEY loaded successfully:", OPENROUTER_API_KEY.length + " characters");
}

// System prompts
const PROJECT_TYPE_SYSTEM_PROMPT = `You are a project type classifier. Given a user's request for a web application, determine if it should be a "react" frontend project or a "node" backend project.

Rules:
- If the user wants a web interface, dashboard, or frontend application, respond with "react"
- If the user wants an API, server, or backend service, respond with "node" 
- If unclear, default to "react"

Respond with ONLY the word "react" or "node", nothing else.`;

const CODE_GENERATION_SYSTEM_PROMPT = `You are CodeCraft, an expert full-stack developer that creates production-ready web applications from natural language descriptions. You must generate COMPLETE, FUNCTIONAL applications that exactly match what the user requests.

CRITICAL REQUIREMENTS:
1. Generate COMPLETE, working code - NO placeholders, TODOs, or "// Add implementation here" comments
2. Create applications that precisely match the user's request - if they want a todo app, make a full todo app with add/delete/edit functionality
3. Include ALL necessary files for the application to run immediately
4. Use modern best practices and libraries
5. Always wrap your response in <boltArtifact> tags
6. Generate code that works in WebContainer environment (browser-based)

CRITICAL VALIDATION:
- Always include package.json with valid scripts (dev, build, preview) and dependencies
- Always include index.html with #root div
- Always include vite.config.ts with React plugin and server config (host: 0.0.0.0, port: 3000)
- Validate all generated files compile and run in WebContainer
- Reject requests if code is incomplete or invalid

FOR REACT PROJECTS:
- Use Vite + React + TypeScript + Tailwind CSS
- Include modern React hooks (useState, useEffect, etc.)
- Create responsive, beautiful UI with Tailwind
- Add proper state management with localStorage for persistence
- Include icons from lucide-react
- Make it fully interactive and functional
- Include proper TypeScript types
- Add error handling and loading states

FOR NODE.JS PROJECTS:
- Use Express + TypeScript
- Include proper middleware, error handling
- Add CORS support
- Create RESTful API endpoints
- Include proper validation
- Use in-memory storage (no external databases)

PACKAGE.JSON REQUIREMENTS:
- Include ALL dependencies needed
- Use proper scripts for development
- For React: use Vite with HMR
- Include @types packages for TypeScript

ESSENTIAL FILES FOR REACT:
1. package.json (with all dependencies and proper scripts)
2. index.html (in root directory with proper title and meta tags)
3. src/main.tsx (React entry point mounting to #root)
4. src/App.tsx (main component with complete functionality)
5. src/index.css (Tailwind imports and custom styles)
6. vite.config.ts (Vite configuration with React plugin)
7. tailwind.config.js (if using Tailwind)
8. postcss.config.js (if using Tailwind)

SHELL COMMANDS:
- First: npm install
- Last: npm run dev

You are a world-class full-stack developer. When users request an application, first provide a brief execution plan, then generate complete, production-ready code.

EXECUTION PLAN FORMAT:
📋 **Execution Plan for [App Name]**
- **Framework**: React + Vite + TypeScript
- **Styling**: TailwindCSS  
- **Key Features**: [List main features]
- **File Structure**: [List essential files]
- **Commands**: npm install → npm run dev

Upon user approval, generate the complete code.

EXAMPLE OUTPUT FOR A TODO APP:
<boltArtifact>
<file path="package.json">
{
  "name": "todo-app",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite --host 0.0.0.0 --port 5000",
    "build": "tsc && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "lucide-react": "^0.263.1"
  },
  "devDependencies": {
    "@types/react": "^18.2.15",
    "@types/react-dom": "^18.2.7",
    "@vitejs/plugin-react": "^4.0.3",
    "autoprefixer": "^10.4.14",
    "postcss": "^8.4.27",
    "tailwindcss": "^3.3.3",
    "typescript": "^5.0.2",
    "vite": "^4.4.5"
  }
}
</file>
<shell>
npm install
</shell>
<file path="src/main.tsx">
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
</file>
<file path="src/index.css">
@tailwind base;
@tailwind components;
@tailwind utilities;
</file>
<file path="vite.config.ts">
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5000,
    strictPort: true
  }
})
</file>
<file path="tailwind.config.js">
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
</file>
<shell>
npm run dev
</shell>
</boltArtifact>

REMEMBER: Generate exactly what the user asks for. Make it work immediately in WebContainer with proper file structure and dependencies.`;

const PROMPT_IMPROVEMENT_SYSTEM_PROMPT = `You are a prompt improvement specialist named CodeCraft AI. Take a vague or unclear prompt for web application development and make it more specific and actionable.

Transform unclear requests into detailed specifications that include:
- Specific technologies to use
- Key features and functionality
- UI/UX requirements
- Data structure needs

Return only the improved prompt, nothing else.`;

export async function registerRoutes(app: Express): Promise<Server> {
  // Determine project type from prompt
  app.post("/api/template", async (req: Request, res: Response) => {
    try {
      const { prompt } = req.body;
      if (!prompt) {
        return res.status(400).json({ message: "Prompt is required" });
      }

      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
          "HTTP-Referer": "http://localhost:5000",
          "X-Title": "CodeCraft AI",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          "model": "deepseek/deepseek-r1-0528:free",
          "messages": [
            { "role": "system", "content": PROJECT_TYPE_SYSTEM_PROMPT },
            { "role": "user", "content": prompt }
          ]
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      interface OpenRouterResponse {
        choices: Array<{
          message: {
            content: string;
          };
        }>;
      }
      
      const data = await response.json() as OpenRouterResponse;
      console.log("Raw API response:", JSON.stringify(data, null, 2)); // Debug log

      if (!data.choices || !Array.isArray(data.choices) || !data.choices[0]?.message?.content) {
        throw new Error("Invalid API response format");
      }

      const projectType = data.choices[0].message.content.trim().toLowerCase();
      
      if (projectType !== "react" && projectType !== "node") {
        return res.status(403).json({ message: "Invalid project type" });
      }

      const basePrompt = `Create a ${projectType} application: ${prompt}`;
      
      res.json({
        prompts: [basePrompt],
        uiPrompts: [basePrompt],
        projectType
      });
    } catch (error) {
      console.error("Template error:", error);
      // Fallback to 'react' if project type determination fails
      const fallbackPrompt = `Create a react application: ${req.body.prompt || "Default web app"}`;
      res.status(500).json({
        message: "Failed to determine project type, defaulting to React",
        prompts: [fallbackPrompt],
        uiPrompts: [fallbackPrompt],
        projectType: "react"
      });
    }
  });

  // Generate code from chat messages
  app.post("/api/chat", async (req: Request, res: Response) => {
    try {
      const { messages, projectId } = req.body;
      if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ message: "Messages array is required" });
      }

      // Check if this is a code generation request
      const lastMessage = messages[messages.length - 1];
      const isCodeGeneration = lastMessage && lastMessage.role === 'user' && 
        (lastMessage.content.toLowerCase().includes('build') || 
         lastMessage.content.toLowerCase().includes('create') ||
         lastMessage.content.toLowerCase().includes('make') ||
         lastMessage.content.toLowerCase().includes('app'));

      // Use appropriate system prompt
      const systemPrompt = isCodeGeneration ? CODE_GENERATION_SYSTEM_PROMPT : 
        `You are CodeCraft AI, a helpful assistant specialized in web development. Provide clear, helpful answers about coding, web development, and building applications. Be conversational and educational.`;

      // Convert messages to OpenRouter format
      const openRouterMessages = [
        { "role": "system", "content": systemPrompt },
        ...messages.map((msg: any) => ({
          role: msg.role === "user" ? "user" : "assistant",
          content: msg.content
        }))
      ];

      // Fetch response as a stream to reduce memory usage
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
          "HTTP-Referer": "http://localhost:5000",
          "X-Title": "CodeCraft AI",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          "model": "deepseek/deepseek-r1-0528:free",
          "messages": openRouterMessages
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Limit response size to prevent memory exhaustion
      const MAX_RESPONSE_SIZE = 10 * 1024 * 1024; // 10MB
      let responseSize = 0;
      let responseContent = '';

      // Process response body as a stream (Node.js Readable)
      const decoder = new TextDecoder();
      for await (const chunk of response.body as NodeJS.ReadableStream) {
        const value = typeof chunk === "string" ? Buffer.from(chunk) : chunk;
        responseSize += value.length;
        if (responseSize > MAX_RESPONSE_SIZE) {
          throw new Error(`Response size exceeds limit of ${MAX_RESPONSE_SIZE} bytes`);
        }
        responseContent += decoder.decode(value, { stream: true });
      }

      console.log(`Received response of size: ${responseSize} bytes`);

      // Parse JSON response
      const data = JSON.parse(responseContent) as { choices: { message: { content: string } }[] };
      const content = data.choices[0].message.content;

      // Parse boltArtifact if it's a code generation request
      let artifacts: CodeArtifact[] = [];
      if (isCodeGeneration && content.includes('<boltArtifact>')) {
        console.log('Parsing boltArtifact from response...');
        artifacts = parseBoltArtifact(content);
        console.log(`Parsed ${artifacts.length} artifacts`);
      } else if (isCodeGeneration) {
        console.log('No boltArtifact found in code generation response');
      }

      // Save the message to storage if projectId provided
      if (projectId) {
        await storage.createChatMessage({
          projectId: parseInt(projectId),
          role: "assistant",
          content
        });
      }

      res.json({ 
        response: content,
        artifacts 
      });
      
    } catch (error) {
      console.error("Chat error:", error);
      res.status(500).json({ 
        error: "Code generation failed",
        message: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Improve prompt
  app.post("/api/improve-prompt", async (req: Request, res: Response) => {
    try {
      const { prompt } = req.body;
      if (!prompt) {
        return res.status(400).json({ message: "Prompt is required" });
      }

      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
          "HTTP-Referer": "http://localhost:5000",
          "X-Title": "CodeCraft AI",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          "model": "deepseek/deepseek-r1-0528:free",
          "messages": [
            { "role": "system", "content": PROMPT_IMPROVEMENT_SYSTEM_PROMPT },
            { "role": "user", "content": prompt }
          ]
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const choicesData = data as { choices: { message: { content: string } }[] };
      res.json({ 
        improvedPrompt: choicesData.choices[0].message.content.trim()
      });
      
    } catch (error) {
      console.error("Improve prompt error:", error);
      res.status(500).json({ error: "Failed to improve prompt" });
    }
  });

  // Project management routes
  app.post("/api/projects", async (req: Request, res: Response) => {
    try {
      const projectData = insertProjectSchema.parse(req.body);
      const project = await storage.createProject(projectData);
      res.json(project);
    } catch (error) {
      console.error("Create project error:", error);
      res.status(400).json({ message: "Invalid project data" });
    }
  });

  app.get("/api/projects", async (req: Request, res: Response) => {
    try {
      const projects = await storage.getAllProjects();
      res.json(projects);
    } catch (error) {
      console.error("Get projects error:", error);
      res.status(500).json({ message: "Failed to fetch projects" });
    }
  });

  app.get("/api/projects/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const project = await storage.getProject(id);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      res.json(project);
    } catch (error) {
      console.error("Get project error:", error);
      res.status(500).json({ message: "Failed to fetch project" });
    }
  });

  app.put("/api/projects/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      const project = await storage.updateProject(id, updates);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      res.json(project);
    } catch (error) {
      console.error("Update project error:", error);
      res.status(500).json({ message: "Failed to update project" });
    }
  });

  app.delete("/api/projects/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteProject(id);
      if (!deleted) {
        return res.status(404).json({ message: "Project not found" });
      }
      res.json({ message: "Project deleted successfully" });
    } catch (error) {
      console.error("Delete project error:", error);
      res.status(500).json({ message: "Failed to delete project" });
    }
  });

  // Download project as zip
  app.get("/api/projects/:id/download", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const project = await storage.getProject(id);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }

      res.setHeader('Content-Type', 'application/zip');
      res.setHeader('Content-Disposition', `attachment; filename="${project.name}.zip"`);

      const archive = archiver('zip', { zlib: { level: 9 } });
      archive.pipe(res);

      Object.entries(project.files || {}).forEach(([filePath, content]) => {
        archive.append(String(content), { name: filePath });
      });

      archive.finalize();
    } catch (error) {
      console.error("Download project error:", error);
      res.status(500).json({ message: "Failed to download project" });
    }
  });

  // Chat messages for a project
  app.get("/api/projects/:id/messages", async (req: Request, res: Response) => {
    try {
      const projectId = parseInt(req.params.id);
      const messages = await storage.getChatMessages(projectId);
      res.json(messages);
    } catch (error) {
      console.error("Get messages error:", error);
      res.status(500).json({ message: "Failed to fetch messages" });
    }
  });

  app.post("/api/projects/:id/messages", async (req: Request, res: Response) => {
    try {
      const projectId = parseInt(req.params.id);
      const messageData = insertChatMessageSchema.parse({
        ...req.body,
        projectId
      });
      const message = await storage.createChatMessage(messageData);
      res.json(message);
    } catch (error) {
      console.error("Create message error:", error);
      res.status(400).json({ message: "Invalid message data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

// Optimized function to parse boltArtifact responses
function parseBoltArtifact(content: string): CodeArtifact[] {
  const artifacts: CodeArtifact[] = [];
  const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1MB per file
  const MAX_ARTIFACTS = 100; // Limit total artifacts to prevent excessive memory use

  try {
    // Find <boltArtifact> content
    const startTag = '<boltArtifact>';
    const endTag = '</boltArtifact>';
    const startIdx = content.indexOf(startTag);
    const endIdx = content.indexOf(endTag, startIdx);
    
    if (startIdx === -1 || endIdx === -1) {
      console.log('No boltArtifact found in content');
      return artifacts;
    }

    const artifactContent = content.slice(startIdx + startTag.length, endIdx);
    console.log(`Found boltArtifact content of size: ${artifactContent.length} chars`);

    let currentIdx = 0;
    while (currentIdx < artifactContent.length && artifacts.length < MAX_ARTIFACTS) {
      // Skip whitespace
      while (currentIdx < artifactContent.length && /\s/.test(artifactContent[currentIdx])) {
        currentIdx++;
      }

      if (currentIdx >= artifactContent.length) break;

      // Check for <shell> or <file> tags
      if (artifactContent.startsWith('<shell>', currentIdx)) {
        const shellStart = currentIdx + '<shell>'.length;
        const shellEnd = artifactContent.indexOf('</shell>', shellStart);
        if (shellEnd === -1) {
          console.log('Malformed shell tag, skipping');
          break;
        }

        const command = artifactContent.slice(shellStart, shellEnd).trim();
        artifacts.push({
          type: 'shell',
          command
        });
        console.log(`Parsed shell command of length: ${command.length}`);
        currentIdx = shellEnd + '</shell>'.length;
      } else if (artifactContent.startsWith('<file ', currentIdx)) {
        // Parse file tag
        const fileTagEnd = artifactContent.indexOf('>', currentIdx);
        if (fileTagEnd === -1) {
          console.log('Malformed file tag, skipping');
          break;
        }

        // Extract path attribute
        const fileTag = artifactContent.slice(currentIdx, fileTagEnd);
        const pathMatch = fileTag.match(/path="([^"]+)"/);
        if (!pathMatch) {
          console.log('No path attribute in file tag, skipping');
          currentIdx = fileTagEnd + 1;
          continue;
        }

        const filePath = pathMatch[1];
        const contentStart = fileTagEnd + 1;
        const contentEnd = artifactContent.indexOf('</file>', contentStart);
        if (contentEnd === -1) {
          console.log(`Malformed file tag for path ${filePath}, skipping`);
          break;
        }

        const fileContent = artifactContent.slice(contentStart, contentEnd);
        if (fileContent.length > MAX_FILE_SIZE) {
          console.log(`File ${filePath} exceeds size limit of ${MAX_FILE_SIZE} bytes, skipping`);
          currentIdx = contentEnd + '</file>'.length;
          continue;
        }

        artifacts.push({
          type: 'file',
          path: filePath,
          content: fileContent
        });
        console.log(`Parsed file: ${filePath} (${fileContent.length} chars)`);
        currentIdx = contentEnd + '</file>'.length;
      } else {
        // Skip unknown content
        currentIdx++;
      }
    }

    console.log(`Total artifacts parsed: ${artifacts.length}`);
    if (artifacts.length >= MAX_ARTIFACTS) {
      console.warn(`Reached artifact limit of ${MAX_ARTIFACTS}, some artifacts may be ignored`);
    }

    return artifacts;
  } catch (error) {
    console.error('Error parsing boltArtifact:', error);
    return artifacts;
  }
}