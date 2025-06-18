import { useState, useRef, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Send, Wand2, Bot, User, Loader2 } from "lucide-react";
import type { ChatMessage, CodeArtifact } from "@shared/schema";

interface ChatInterfaceProps {
  onCodeGenerated: (artifacts: CodeArtifact[]) => void;
  currentProject: any;
  onProjectChange: (project: any) => void;
}

interface ChatMessageDisplay extends Omit<ChatMessage, 'id' | 'projectId' | 'createdAt'> {
  id?: number;
  artifacts?: CodeArtifact[];
}

export function ChatInterface({ onCodeGenerated, currentProject, onProjectChange }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessageDisplay[]>([
    {
      role: "assistant",
      content: "Hello! I'm CodeCraft AI. Tell me what kind of web application you'd like to build, and I'll generate the code for you."
    }
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const chatMutation = useMutation({
    mutationFn: async (prompt: string) => {
      // Check if this is a code generation request
      const isCodeGeneration = prompt.toLowerCase().includes('build') || 
                              prompt.toLowerCase().includes('create') ||
                              prompt.toLowerCase().includes('make') ||
                              prompt.toLowerCase().includes('app') ||
                              prompt.toLowerCase().includes('website') ||
                              prompt.toLowerCase().includes('tool');

      let projectToUse = currentProject;

      // Create new project for code generation requests
      if (isCodeGeneration && !currentProject) {
        const templateResponse = await apiRequest("POST", "/api/template", { prompt });
        const templateData = await templateResponse.json();
        
        // Create new project
        const projectResponse = await apiRequest("POST", "/api/projects", {
          name: `Generated App - ${new Date().toLocaleString()}`,
          description: prompt,
          projectType: templateData.projectType,
          files: {}
        });
        projectToUse = await projectResponse.json();
        onProjectChange(projectToUse);
      }

      // Send chat message
      const chatResponse = await apiRequest("POST", "/api/chat", {
        messages: [...messages, { role: "user", content: prompt }],
        projectId: projectToUse?.id
      });
      
      return await chatResponse.json();
    },
    onSuccess: (data) => {
      const assistantMessage: ChatMessageDisplay = {
        role: "assistant",
        content: data.response,
        artifacts: data.artifacts
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      
      if (data.artifacts && data.artifacts.length > 0) {
        // Update project with generated files
        const files: Record<string, string> = {};
        data.artifacts
          .filter((artifact: any) => artifact.type === 'file')
          .forEach((artifact: any) => {
            if (artifact.path && artifact.content) {
              files[artifact.path] = artifact.content;
            }
          });

        // Update current project with new files
        if (projectToUse && Object.keys(files).length > 0) {
          apiRequest("PUT", `/api/projects/${projectToUse.id}`, { files })
            .catch(error => console.error("Failed to update project files:", error));
        }

        onCodeGenerated(data.artifacts);
        toast({
          title: "Code Generated Successfully!",
          description: `Created ${Object.keys(files).length} files. Starting live preview...`,
        });
      }
      
      setInput("");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to generate code. Please try again.",
        variant: "destructive",
      });
      console.error("Chat error:", error);
    },
  });

  const improveMutation = useMutation({
    mutationFn: async (prompt: string) => {
      const response = await apiRequest("POST", "/api/improve-prompt", { prompt });
      return await response.json();
    },
    onSuccess: (data) => {
      setInput(data.improvedPrompt);
      toast({
        title: "Prompt Improved",
        description: "Your prompt has been enhanced for better results.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to improve prompt.",
        variant: "destructive",
      });
    },
  });

  const handleSend = () => {
    if (!input.trim() || chatMutation.isPending) return;
    
    const userMessage: ChatMessageDisplay = {
      role: "user",
      content: input
    };
    
    setMessages(prev => [...prev, userMessage]);
    chatMutation.mutate(input);
  };

  const handleImprove = () => {
    if (!input.trim() || improveMutation.isPending) return;
    improveMutation.mutate(input);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full bg-card">
      {/* Header */}
      <div className="p-4 border-b bg-card">
        <h2 className="text-lg font-semibold">Chat with AI</h2>
        <p className="text-sm text-muted-foreground">Describe what you want to build</p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex items-start space-x-3 chat-message ${
              message.role === "user" ? "justify-end" : ""
            }`}
          >
            {message.role === "assistant" && (
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-white" />
              </div>
            )}
            
            <div
              className={`rounded-lg p-3 max-w-md ${
                message.role === "user"
                  ? "bg-primary text-primary-foreground rounded-tr-none"
                  : "bg-muted rounded-tl-none"
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              
              {message.artifacts && message.artifacts.length > 0 && (
                <div className="mt-2 p-2 bg-emerald-500/10 border border-emerald-500/20 rounded">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                    <p className="text-xs text-emerald-600 dark:text-emerald-400">
                      Generated {message.artifacts.filter(a => a.type === 'file').length} files
                    </p>
                  </div>
                </div>
              )}
            </div>

            {message.role === "user" && (
              <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center flex-shrink-0">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}
        
        {chatMutation.isPending && (
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="bg-muted rounded-lg rounded-tl-none p-3">
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <p className="text-sm text-muted-foreground">Generating code...</p>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t">
        <div className="flex space-x-2">
          <div className="flex-1 relative">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Describe your app idea..."
              className="resize-none"
              rows={2}
            />
          </div>
          <div className="flex flex-col space-y-1">
            <Button 
              onClick={handleSend}
              disabled={!input.trim() || chatMutation.isPending}
              size="sm"
              className="px-3"
            >
              {chatMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
            <Button 
              onClick={handleImprove}
              disabled={!input.trim() || improveMutation.isPending}
              variant="secondary"
              size="sm"
              className="px-3"
              title="Improve Prompt"
            >
              {improveMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Wand2 className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
