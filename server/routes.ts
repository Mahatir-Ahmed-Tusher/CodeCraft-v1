import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertProjectSchema, insertChatMessageSchema, type GeneratedCode, type CodeArtifact } from "@shared/schema";
import { z } from "zod";
import { ChatGroq } from "@langchain/groq";
import archiver from "archiver";
import { promisify } from "util";
import { exec } from "child_process";

const execAsync = promisify(exec);

// Initialize Groq client
const groq = new ChatGroq({
  temperature: 0.7,
  apiKey: process.env.GROQ_API_KEY || "default_key",
  model: "llama-3.3-70b-versatile"
});

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

EXAMPLE OUTPUT FOR A TODO APP:
<boltArtifact>
<boltAction type="shell">
<boltCommand>npm install</boltCommand>
</boltAction>

<boltAction type="file" filePath="package.json">
{
  "name": "todo-app",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite --host 0.0.0.0 --port 3000",
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
</boltAction>

<boltAction type="file" filePath="index.html">
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Todo App</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
</boltAction>

<boltAction type="file" filePath="src/main.tsx">
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
</boltAction>

<boltAction type="file" filePath="src/index.css">
@tailwind base;
@tailwind components;
@tailwind utilities;
</boltAction>

<boltAction type="file" filePath="vite.config.ts">
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 3000,
    strictPort: true
  }
})
</boltAction>

<boltAction type="file" filePath="tailwind.config.js">
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
</boltAction>

<boltAction type="shell">
<boltCommand>npm run dev</boltCommand>
</boltAction>
</boltArtifact>

REMEMBER: Generate exactly what the user asks for. Make it work immediately in WebContainer with proper file structure and dependencies.`;

const PROMPT_IMPROVEMENT_SYSTEM_PROMPT = `You are a prompt improvement specialist. Take a vague or unclear prompt for web application development and make it more specific and actionable.

Transform unclear requests into detailed specifications that include:
- Specific technologies to use
- Key features and functionality
- UI/UX requirements
- Data structure needs

Return only the improved prompt, nothing else.`;

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Determine project type from prompt
  app.post("/api/template", async (req, res) => {
    try {
      const { prompt } = req.body;
      if (!prompt) {
        return res.status(400).json({ message: "Prompt is required" });
      }

      const response = await groq.invoke([
        { role: "system", content: PROJECT_TYPE_SYSTEM_PROMPT },
        { role: "user", content: prompt }
      ]);

      const projectType = response.content.toString().trim().toLowerCase();
      
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
      res.status(500).json({ message: "Failed to determine project type" });
    }
  });

  // Generate code from chat messages
  app.post("/api/chat", async (req, res) => {
    try {
      const { messages, projectId } = req.body;
      if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ message: "Messages array is required" });
      }

      // Check if this is a code generation request (contains boltArtifact request)
      const lastMessage = messages[messages.length - 1];
      const isCodeGeneration = lastMessage && lastMessage.role === 'user' && 
        (lastMessage.content.toLowerCase().includes('build') || 
         lastMessage.content.toLowerCase().includes('create') ||
         lastMessage.content.toLowerCase().includes('make') ||
         lastMessage.content.toLowerCase().includes('app'));

      // Use appropriate system prompt
      const systemPrompt = isCodeGeneration ? CODE_GENERATION_SYSTEM_PROMPT : 
        `You are CodeCraft AI, a helpful assistant specialized in web development. Provide clear, helpful answers about coding, web development, and building applications. Be conversational and educational.`;

      // Convert messages to Groq format
      const groqMessages = messages.map((msg: any) => ({
        role: msg.role === "user" ? "human" : "assistant",
        content: msg.content
      }));

      const response = await groq.invoke([
        { role: "system", content: systemPrompt },
        ...groqMessages
      ]);

      const responseContent = response.content.toString();
      
      // Parse the boltArtifact response if it's a code generation request
      let artifacts: any[] = [];
      if (isCodeGeneration && responseContent.includes('<boltArtifact>')) {
        console.log('Parsing boltArtifact from response...');
        artifacts = parseBoltArtifact(responseContent);
        console.log(`Parsed ${artifacts.length} artifacts`);
      } else if (isCodeGeneration) {
        console.log('No boltArtifact found in code generation response');
      }

      // Save the message to storage if projectId provided
      if (projectId) {
        await storage.createChatMessage({
          projectId: parseInt(projectId),
          role: "assistant",
          content: responseContent
        });
      }

      res.json({ 
        response: responseContent,
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
  app.post("/api/improve-prompt", async (req, res) => {
    try {
      const { prompt } = req.body;
      if (!prompt) {
        return res.status(400).json({ message: "Prompt is required" });
      }

      const response = await groq.invoke([
        { role: "system", content: PROMPT_IMPROVEMENT_SYSTEM_PROMPT },
        { role: "user", content: prompt }
      ]);

      res.json({ 
        improvedPrompt: response.content.toString().trim()
      });
      
    } catch (error) {
      console.error("Improve prompt error:", error);
      res.status(500).json({ error: "Failed to improve prompt" });
    }
  });

  // Project management routes
  app.post("/api/projects", async (req, res) => {
    try {
      const projectData = insertProjectSchema.parse(req.body);
      const project = await storage.createProject(projectData);
      res.json(project);
    } catch (error) {
      console.error("Create project error:", error);
      res.status(400).json({ message: "Invalid project data" });
    }
  });

  app.get("/api/projects", async (req, res) => {
    try {
      const projects = await storage.getAllProjects();
      res.json(projects);
    } catch (error) {
      console.error("Get projects error:", error);
      res.status(500).json({ message: "Failed to fetch projects" });
    }
  });

  app.get("/api/projects/:id", async (req, res) => {
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

  app.put("/api/projects/:id", async (req, res) => {
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

  app.delete("/api/projects/:id", async (req, res) => {
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
  app.get("/api/projects/:id/download", async (req, res) => {
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

      // Add files to zip
      Object.entries(project.files || {}).forEach(([filePath, content]) => {
        archive.append(content, { name: filePath });
      });

      archive.finalize();
    } catch (error) {
      console.error("Download project error:", error);
      res.status(500).json({ message: "Failed to download project" });
    }
  });

  // Chat messages for a project
  app.get("/api/projects/:id/messages", async (req, res) => {
    try {
      const projectId = parseInt(req.params.id);
      const messages = await storage.getChatMessages(projectId);
      res.json(messages);
    } catch (error) {
      console.error("Get messages error:", error);
      res.status(500).json({ message: "Failed to fetch messages" });
    }
  });

  app.post("/api/projects/:id/messages", async (req, res) => {
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

// Helper function to parse boltArtifact responses
function parseBoltArtifact(content: string): CodeArtifact[] {
  const artifacts: CodeArtifact[] = [];
  
  try {
    // Extract content between boltArtifact tags
    const artifactMatch = content.match(/<boltArtifact>([\s\S]*?)<\/boltArtifact>/);
    if (!artifactMatch) {
      console.log('No boltArtifact found in content');
      return artifacts;
    }
    
    const artifactContent = artifactMatch[1];
    console.log('Found boltArtifact content, parsing actions...');
    
    // Extract shell commands
    const shellRegex = /<boltAction type="shell">\s*<boltCommand>([\s\S]*?)<\/boltCommand>\s*<\/boltAction>/g;
    let shellMatch;
    while ((shellMatch = shellRegex.exec(artifactContent)) !== null) {
      artifacts.push({
        type: 'shell',
        command: shellMatch[1].trim()
      });
    }
    console.log(`Found ${artifacts.filter(a => a.type === 'shell').length} shell commands`);
    
    // Extract files
    const fileRegex = /<boltAction type="file" filePath="([^"]+)">([\s\S]*?)<\/boltAction>/g;
    let fileMatch;
    while ((fileMatch = fileRegex.exec(artifactContent)) !== null) {
      const filePath = fileMatch[1];
      const fileContent = fileMatch[2].trim();
      
      console.log(`Processing file: ${filePath} (${fileContent.length} chars)`);
      
      artifacts.push({
        type: 'file',
        path: filePath,
        content: fileContent
      });
    }
    
    console.log(`Total artifacts parsed: ${artifacts.length}`);
    return artifacts;
    
  } catch (error) {
    console.error('Error parsing boltArtifact:', error);
    return artifacts;
  }
  const fileRegex = /<boltAction type="file" filePath="([^"]+)">([\s\S]*?)<\/boltAction>/g;
  let fileMatch;
  while ((fileMatch = fileRegex.exec(artifactContent)) !== null) {
    artifacts.push({
      type: 'file',
      path: fileMatch[1],
      content: fileMatch[2].trim()
    });
  }
  
  return artifacts;
}
