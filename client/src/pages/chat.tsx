import { useState, useRef, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button.js";
import { Textarea } from "@/components/ui/textarea.js";
import { Card } from "@/components/ui/card.js";
import { useToast } from "@/hooks/use-toast.js";
import { apiRequest } from "@/lib/queryClient.js";
import {
  Send,
  Wand2,
  Bot,
  User,
  Loader2,
  ArrowLeft,
  Code,
  Lightbulb,
  HelpCircle,
  Sparkles
} from "lucide-react";

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

const quickPrompts = [
  "How do I build a todo app with React?",
  "What's the best way to style components?",
  "How can I add user authentication?",
  "Help me choose between React and Vue",
  "How do I deploy my web app?",
  "What databases work well with Node.js?"
];

const tips = [
  {
    icon: <Lightbulb className="w-5 h-5" />,
    title: "Be Specific",
    content: "The more detailed your description, the better the generated code will be."
  },
  {
    icon: <Code className="w-5 h-5" />,
    title: "Mention Technologies",
    content: "Include preferred frameworks, libraries, or styling approaches in your prompt."
  },
  {
    icon: <Sparkles className="w-5 h-5" />,
    title: "Describe Features",
    content: "List the specific features and functionality you want in your app."
  }
];

export default function Chat() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content: "Hello! I'm your CodeCraft AI assistant. I'm here to help you with web development questions, provide coding advice, and guide you through building amazing applications. What would you like to know?"
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
      const response = await apiRequest("POST", "/api/chat", {
        messages: [...messages, { role: "user", content: prompt }]
      });
      return await response.json();
    },
    onSuccess: (data) => {
      const assistantMessage: ChatMessage = {
        role: "assistant",
        content: data.response || "I'm sorry, I couldn't generate a response. Please try again."
      };

      setMessages(prev => [...prev, assistantMessage]);
      setInput("");
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message.includes("invalid_api_key")
          ? "Server configuration error. Please contact support."
          : "Failed to get response. Please try again.",
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

    const userMessage: ChatMessage = {
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

  const handleQuickPrompt = (prompt: string) => {
    setInput(prompt);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold">Chat with CodeCraft AI</h1>
              <p className="text-sm text-muted-foreground">Get help with web development</p>
            </div>
          </div>

          <Link href="/generator">
            <Button>
              <Code className="w-4 h-4 mr-2" />
              Start Building
            </Button>
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar with Tips and Quick Prompts */}
          <div className="lg:col-span-1 space-y-6">
            {/* Tips */}
            <Card className="p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <HelpCircle className="w-5 h-5" />
                Tips for Better Conversations
              </h3>
              <div className="space-y-4">
                {tips.map((tip, index) => (
                  <div key={index} className="flex gap-3">
                    <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                      {tip.icon}
                    </div>
                    <div>
                      <div className="font-medium text-sm">{tip.title}</div>
                      <div className="text-xs text-muted-foreground">{tip.content}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Quick Prompts */}
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Quick Questions</h3>
              <div className="space-y-2">
                {quickPrompts.map((prompt, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    size="sm"
                    className="w-full text-left justify-start h-auto p-2 text-wrap"
                    onClick={() => handleQuickPrompt(prompt)}
                  >
                    {prompt}
                  </Button>
                ))}
              </div>
            </Card>
          </div>

          {/* Chat Interface */}
          <div className="lg:col-span-3">
            <Card className="h-[600px] flex flex-col">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex items-start space-x-3 ${
                      message.role === "user" ? "justify-end" : ""
                    }`}
                  >
                    {message.role === "assistant" && (
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <Bot className="w-4 h-4 text-white" />
                      </div>
                    )}

                    <div
                      className={`rounded-lg p-4 max-w-md ${
                        message.role === "user"
                          ? "bg-primary text-primary-foreground rounded-tr-none"
                          : "bg-muted rounded-tl-none"
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{message.content}</p>
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
                    <div className="bg-muted rounded-lg rounded-tl-none p-4">
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <p className="text-muted-foreground">Thinking...</p>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-6 border-t">
                <div className="flex space-x-2">
                  <div className="flex-1 relative">
                    <Textarea
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Ask me anything about web development..."
                      className="resize-none"
                      rows={3}
                    />
                  </div>
                  <div className="flex flex-col space-y-2">
                    <Button
                      onClick={handleSend}
                      disabled={!input.trim() || chatMutation.isPending}
                      size="sm"
                      className="px-4"
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
                      className="px-4"
                      title="Improve Question"
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
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}