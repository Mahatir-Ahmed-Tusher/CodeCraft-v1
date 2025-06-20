import { useState, useRef, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "../components/ui/button.js";
import { Textarea } from "../components/ui/textarea.js";
import { Card } from "../components/ui/card.js";
import { Badge } from "../components/ui/badge.js";
import { useToast } from "../hooks/use-toast.js";
import { apiRequest } from "../lib/queryClient.js";
import { Send, Wand2, Bot, User, Loader2, ChevronUp, ChevronDown } from "lucide-react";
import LoadingAnimation from "./LoadingAnimation.jsx";
import { motion, AnimatePresence } from "framer-motion";
import type { ChatMessage, CodeArtifact } from "../shared/schema";

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
  const [isExpanded, setIsExpanded] = useState(false);
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
      const isCodeGeneration = prompt.toLowerCase().includes('build') || 
                              prompt.toLowerCase().includes('create') ||
                              prompt.toLowerCase().includes('make') ||
                              prompt.toLowerCase().includes('app') ||
                              prompt.toLowerCase().includes('website') ||
                              prompt.toLowerCase().includes('tool') ||
                              prompt.toLowerCase().includes('generate');

      let projectForRequest = currentProject;

      if (isCodeGeneration && !currentProject) {
        const templateResponse = await apiRequest("POST", "/api/template", { prompt });
        const templateData = await templateResponse.json();
        
        const projectResponse = await apiRequest("POST", "/api/projects", {
          name: `Generated App - ${new Date().toLocaleString()}`,
          description: prompt,
          projectType: templateData.projectType,
          files: {}
        });
        projectForRequest = await projectResponse.json();
        onProjectChange(projectForRequest);
      }

      const chatResponse = await apiRequest("POST", "/api/chat", {
        messages: [...messages, { role: "user", content: prompt }],
        projectId: projectForRequest?.id
      });
      
      return { ...await chatResponse.json(), projectUsed: projectForRequest };
    },
    onSuccess: (data) => {
      console.log('Chat response received:', data);
      
      const assistantMessage: ChatMessageDisplay = {
        role: "assistant",
        content: data.response,
        artifacts: data.artifacts
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      
      if (data.artifacts && data.artifacts.length > 0) {
        console.log('Processing artifacts:', data.artifacts);
        
        const files: Record<string, string> = {};
        data.artifacts
          .filter((artifact: any) => artifact.type === 'file')
          .forEach((artifact: any) => {
            if (artifact.path && artifact.content) {
              files[artifact.path] = artifact.content;
              console.log(`Adding file: ${artifact.path}`);
            }
          });

        console.log('Generated files:', Object.keys(files));

        if (data.projectUsed && Object.keys(files).length > 0) {
          apiRequest("PUT", `/api/projects/${data.projectUsed.id}`, { files })
            .catch(error => console.error("Failed to update project files:", error));
        }

        if (Object.keys(files).length > 0) {
          onCodeGenerated(data.artifacts);
          toast({
            title: "Code Generated Successfully!",
            description: `Created ${Object.keys(files).length} files. Starting live preview...`,
          });
        } else {
          toast({
            title: "Response Generated",
            description: "AI responded but no code files were generated.",
          });
        }
      } else {
        toast({
          title: "Response Generated",
          description: "AI responded successfully.",
        });
      }
      
      setInput("");
    },
    onError: (error) => {
      console.error("Chat error details:", error);
      
      let errorMessage = "Failed to generate code. Please try again.";
      if (error && typeof error === 'object' && 'message' in error) {
        errorMessage = String(error.message);
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
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
    <div className="flex flex-col h-full bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/10 to-purple-600/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-400/10 to-pink-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Header */}
      <motion.div 
        className="p-6 border-b bg-gradient-to-r from-white/80 to-slate-50/80 dark:from-slate-800/80 dark:to-slate-900/80 backdrop-blur-xl relative z-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-3 mb-2">
          <motion.div 
            className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg"
            whileHover={{ scale: 1.05, rotate: 5 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <Bot className="w-5 h-5 text-white" />
          </motion.div>
          <div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 dark:from-white dark:to-slate-200 bg-clip-text text-transparent">
              CodeCraft AI
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">Ready to build your next masterpiece</p>
          </div>
        </div>
      </motion.div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar relative z-10">
        <AnimatePresence>
          {messages.map((message, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className={`flex gap-3 w-full ${
                message.role === "user" ? "flex-row-reverse" : "flex-row"
              }`}
            >
              {/* Avatar */}
              <motion.div 
                className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg ${
                  message.role === "user" 
                    ? "bg-gradient-to-r from-slate-300 to-slate-400 dark:from-slate-600 dark:to-slate-700"
                    : "bg-gradient-to-r from-blue-500 to-purple-600"
                }`}
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                {message.role === "user" ? (
                  <User className="w-4 h-4 text-slate-600 dark:text-slate-300" />
                ) : (
                  <Bot className="w-4 h-4 text-white" />
                )}
              </motion.div>
              
              {/* Message Content */}
              <motion.div
                className={`rounded-2xl p-4 max-w-[75%] shadow-lg backdrop-blur-sm ${
                  message.role === "user"
                    ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-tr-md shadow-blue-500/25"
                    : "bg-gradient-to-br from-white/90 to-slate-50/90 dark:from-slate-800/90 dark:to-slate-900/90 rounded-tl-md border border-slate-200/50 dark:border-slate-700/50"
                }`}
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                <p className={`text-sm whitespace-pre-wrap leading-relaxed break-words ${
                  message.role === "user" 
                    ? "text-white" 
                    : "text-slate-700 dark:text-slate-300"
                }`}>
                  {message.content}
                </p>
                
                {message.artifacts && message.artifacts.length > 0 && (
                  <motion.div 
                    className="mt-3 p-3 bg-gradient-to-r from-emerald-500/10 to-green-500/10 border border-emerald-500/20 rounded-xl"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <div className="flex items-center gap-2">
                      <motion.div 
                        className="w-2 h-2 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                      <p className="text-xs font-medium text-emerald-700 dark:text-emerald-400">
                        ✨ Generated {message.artifacts.filter(a => a.type === 'file').length} files
                      </p>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {chatMutation.isPending && <LoadingAnimation />}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <motion.div 
        className="p-6 border-t bg-gradient-to-r from-white/80 to-slate-50/80 dark:from-slate-800/80 dark:to-slate-900/80 backdrop-blur-xl relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <motion.div
              className="relative"
              animate={{ height: isExpanded ? 120 : 80 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Describe your app idea... ✨"
                className="resize-none w-full border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-xl shadow-lg focus:shadow-xl transition-all duration-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                rows={isExpanded ? 4 : 2}
                style={{ minHeight: isExpanded ? '120px' : '80px' }}
              />
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="absolute top-2 right-2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
              >
                {isExpanded ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronUp className="w-4 h-4" />
                )}
              </button>
            </motion.div>
          </div>
          
          <div className="flex flex-col gap-2">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button 
                onClick={handleSend}
                disabled={!input.trim() || chatMutation.isPending}
                className="px-4 h-10 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {chatMutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </motion.div>
            
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button 
                onClick={handleImprove}
                disabled={!input.trim() || improveMutation.isPending}
                variant="secondary"
                className="px-4 h-10 bg-gradient-to-r from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 hover:from-slate-200 hover:to-slate-300 dark:hover:from-slate-600 dark:hover:to-slate-700 shadow-lg hover:shadow-xl transition-all duration-300"
                title="Enhance your prompt with AI"
              >
                {improveMutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Wand2 className="w-4 h-4" />
                )}
              </Button>
            </motion.div>
          </div>
        </div>
        
        <div className="mt-3 text-xs text-slate-500 dark:text-slate-400 text-center">
          Press <kbd className="px-2 py-1 bg-slate-200 dark:bg-slate-700 rounded text-xs">Enter</kbd> to send, 
          <kbd className="px-2 py-1 bg-slate-200 dark:bg-slate-700 rounded text-xs ml-1">Shift + Enter</kbd> for new line
        </div>
      </motion.div>
    </div>
  );
}