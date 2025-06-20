import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Code, Sparkles, Play, Layers, Terminal, Download, ArrowRight, Github, Globe, Zap } from "lucide-react";
import { Button } from "../components/ui/button.tsx";
import { Link } from "wouter";

const CodeSnippet = ({ children, delay = 0 }: { children: string; delay?: number }) => {
  const [displayText, setDisplayText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentIndex < children.length) {
        setDisplayText(children.slice(0, currentIndex + 1));
        setCurrentIndex(currentIndex + 1);
      }
    }, 50 + delay);

    return () => clearTimeout(timer);
  }, [currentIndex, children, delay]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: delay / 1000 }}
      className="font-mono text-xs bg-gray-900 p-4 rounded-lg border border-gray-700 overflow-hidden"
    >
      <div className="text-green-400">
        {displayText}
        <span className="animate-pulse">|</span>
      </div>
    </motion.div>
  );
};

const FloatingCodeBlocks = () => {
  const codeBlocks = [
    'const app = createIDE();',
    'function buildAmazing() {',
    '  return "Hello World";',
    '}',
    'npm start',
    'git commit -m "🚀"',
    'python main.py',
    'console.log("Ready!");'
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {codeBlocks.map((code, index) => (
        <motion.div
          key={index}
          className="absolute text-xs font-mono text-gray-400 opacity-20"
          initial={{ 
            x: Math.random() * window.innerWidth,
            y: window.innerHeight + 50,
            rotate: Math.random() * 360
          }}
          animate={{
            y: -100,
            rotate: Math.random() * 360,
          }}
          transition={{
            duration: Math.random() * 10 + 15,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: "linear"
          }}
        >
          {code}
        </motion.div>
      ))}
    </div>
  );
};

const FeatureCard = ({ icon: Icon, title, description, delay }: {
  icon: any;
  title: string;
  description: string;
  delay: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.8 }}
    whileHover={{ scale: 1.05, y: -10 }}
    className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 hover:border-blue-500/50 transition-all duration-300"
  >
    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mb-4">
      <Icon className="w-6 h-6 text-white" />
    </div>
    <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
    <p className="text-gray-400 leading-relaxed">{description}</p>
  </motion.div>
);

export default function IDELandingPage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const features = [
    {
      icon: Code,
      title: "Multi-Language Support",
      description: "Write in HTML, CSS, JavaScript, React, Node.js, Python, and more with full syntax highlighting and IntelliSense."
    },
    {
      icon: Sparkles,
      title: "AI-Powered Coding",
      description: "Generate code, fix bugs, and get suggestions with our integrated AI assistant powered by advanced language models."
    },
    {
      icon: Play,
      title: "Instant Preview",
      description: "See your changes in real-time with our live preview system. No setup required, just code and see results instantly."
    },
    {
      icon: Layers,
      title: "Project Templates",
      description: "Start quickly with pre-built templates for web apps, APIs, data science projects, and full-stack applications."
    },
    {
      icon: Terminal,
      title: "Integrated Terminal",
      description: "Access a full-featured terminal right in your browser. Run commands, install packages, and manage your projects."
    },
    {
      icon: Download,
      title: "Export & Deploy",
      description: "Download your projects as ZIP files or deploy directly to the cloud with one-click deployment options."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white overflow-hidden relative">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-blue-900/20 to-purple-900/20" />
      <FloatingCodeBlocks />
      
      {/* Mouse Follower Gradient */}
      <div
        className="absolute w-96 h-96 rounded-full opacity-20 pointer-events-none transition-all duration-1000 ease-out"
        style={{
          background: `radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, transparent 70%)`,
          left: mousePosition.x - 192,
          top: mousePosition.y - 192,
        }}
      />

      <div className="relative z-10">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-6 py-4 border-b border-gray-800/50 backdrop-blur-sm"
        >
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Code className="w-8 h-8 text-blue-400" />
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                CodeCraft IDE
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <Github className="w-4 h-4 mr-2" />
                GitHub
              </Button>
              <Button variant="ghost" size="sm">
                <Globe className="w-4 h-4 mr-2" />
                Docs
              </Button>
              <Link href="/ide">
                <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                  Launch IDE
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </motion.header>

        {/* Hero Section */}
        <section className="px-6 py-20">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div>
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 1 }}
                >
                  <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-full mb-6">
                  <Zap className="w-4 h-4 text-blue-400 mr-2" />
                  <span className="text-sm text-blue-300">Now with AI-powered code generation</span>
                  </div>
                  
                  <h1 className="text-6xl font-bold mb-6 leading-tight">
                  Code
                  <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                    {" "}Anywhere
                  </span>
                  <br />
                  Build
                  <span className="bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                    {" "}Everything
                  </span>
                  </h1>
                  
                  <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                  The most powerful browser-based IDE with multi-language support, 
                  AI assistance, and instant deployment. Start coding in seconds, 
                  build anything you imagine.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/ide">
                    <Button size="lg" className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-lg px-8 py-6">
                    <Play className="w-5 h-5 mr-2" />
                    Start Coding Now
                    </Button>
                  </Link>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-gray-600 hover:border-blue-500 text-black text-lg px-8 py-6"
                  >
                    <Download className="w-5 h-5 mr-2" />
                    View Demo
                  </Button>
                  </div>
                </motion.div>
                </div>

              <div className="relative">
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 1, delay: 0.2 }}
                  className="space-y-4"
                >
                  <CodeSnippet delay={500}>
{`// Welcome to CodeCraft IDE
import { createApp } from './framework';

const app = createApp({
  name: 'MyAmazingProject',
  features: ['AI-powered', 'Multi-language', 'Cloud-ready']
});

app.generate('landing-page').then(() => {
  console.log('🚀 Project ready!');
});`}
                  </CodeSnippet>
                  
                  <CodeSnippet delay={2000}>
{`# Python Data Science
import pandas as pd
import matplotlib.pyplot as plt

data = pd.read_csv('analytics.csv')
insights = analyze_trends(data)
visualize(insights) # ✨ AI-generated plot`}
                  </CodeSnippet>
                  
                  <CodeSnippet delay={3500}>
{`<!-- Instant HTML Preview -->
<div class="hero">
  <h1>Built with CodeCraft</h1>
  <p>From idea to deployment in minutes</p>
</div>`}
                  </CodeSnippet>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="px-6 py-20 bg-gray-800/30">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="text-center mb-16"
            >
              <h2 className="text-5xl font-bold mb-6">
                Everything You Need to
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  {" "}Build Amazing Apps
                </span>
              </h2>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                From simple scripts to complex full-stack applications, CodeCraft IDE 
                provides all the tools you need in one powerful, browser-based environment.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <FeatureCard
                  key={feature.title}
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                  delay={0.1 * index}
                />
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="px-6 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
            >
              <h2 className="text-5xl font-bold mb-6">
                Ready to Start
                <span className="bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                  {" "}Building?
                </span>
              </h2>
              <p className="text-xl text-gray-400 mb-12">
                Join thousands of developers who are already building amazing projects with CodeCraft IDE.
                No installation required, just open your browser and start coding.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Link href="/ide">
                  <Button size="lg" className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-lg px-12 py-6">
                    <Code className="w-5 h-5 mr-2" />
                    Launch CodeCraft IDE
                  </Button>
                </Link>
                <Button size="lg" variant="outline" className="border-gray-600 hover:border-green-500 text-lg px-12 py-6">
                  <Sparkles className="w-5 h-5 mr-2" />
                  Try AI Features
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer className="px-6 py-12 border-t border-gray-800/50">
          <div className="max-w-7xl mx-auto text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Code className="w-6 h-6 text-blue-400" />
              <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                CodeCraft IDE
              </span>
            </div>
            <p className="text-gray-400">
              Built with ❤️ for developers, by developers. 
              Empowering creativity through code.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}