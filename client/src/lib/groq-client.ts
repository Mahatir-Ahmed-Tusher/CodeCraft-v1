// This file contains client-side utilities for working with OpenRouter API responses. Initialy we used groq, but now we are using OpenRouter for AI interactions.
// The actual API calls are handled by the backend

export interface GroqMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface GroqResponse {
  response: string;
  artifacts?: any[];
}

// Helper to format messages for the chat interface
export const formatMessagesForGroq = (messages: GroqMessage[]): GroqMessage[] => {
  return messages.map(msg => ({
    role: msg.role,
    content: msg.content
  }));
};

// Helper to extract code blocks from Groq responses
export const extractCodeBlocks = (content: string): { language: string; code: string }[] => {
  const codeBlockRegex = /```(\w+)?\n([\s\S]*?)\n```/g;
  const blocks: { language: string; code: string }[] = [];
  let match;

  while ((match = codeBlockRegex.exec(content)) !== null) {
    blocks.push({
      language: match[1] || 'plaintext',
      code: match[2]
    });
  }

  return blocks;
};

// Helper to validate generated code structure
export const validateCodeStructure = (files: Record<string, string>): boolean => {
  // Basic validation - ensure we have at least one meaningful file
  const meaningfulFiles = Object.keys(files).filter(path => 
    !path.includes('node_modules') && 
    !path.includes('.git') &&
    files[path].trim().length > 0
  );

  return meaningfulFiles.length > 0;
};
