import { Link } from "wouter";
import { Button } from "../components/ui/button.tsx";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card.tsx";
import { Badge } from "../components/ui/badge.tsx";
import { useLanguage } from "../contexts/LanguageContext.tsx";
import { MobileNav } from "../components/mobile-nav.tsx";

import { 
  Code, 
  Zap, 
  Eye, 
  Download, 
  MessageSquare, 
  Rocket, 
  CheckCircle, 
  ArrowRight,
  Github,
  Twitter,
  Mail,
  Star,
  Users,
  Globe,
  Smartphone,
  Database,
  Layers,
  BarChart3,
  TrendingUp,
  Sparkles,
  Monitor,
  Palette,
  Play
} from "lucide-react";
import { useState, useEffect } from "react";
import Typed from "typed.js";
import { motion, AnimatePresence } from "framer-motion";

export default function Landing() {
  const { t } = useLanguage();
  const [showFABMessage, setShowFABMessage] = useState(false);

  useEffect(() => {
    // Show FAB message on page load
    setShowFABMessage(true);
    const hideTimer = setTimeout(() => {
      setShowFABMessage(false);
    }, 5000);

    return () => clearTimeout(hideTimer);
  }, []);

  useEffect(() => {
    // Typed.js for Feature Preview
    const typed = new Typed('.typed-code', {
      strings: [
        `import React, { useState } from 'react';
export default function TodoApp() {
  const [todos, setTodos] = useState([]);
  const addTodo = () => {
    // Add new todo
  };
  return (
    <div className="app">
      <TodoList todos={todos} />
    </div>
  );
}`,
        `import React from 'react';
export default function Dashboard() {
  return (
    <div className="dashboard">
      <h1>Analytics Dashboard</h1>
      <Chart data={data} />
      <MetricCard title="Users" value="1,234" />
    </div>
  );
}`,
        `import React from 'react';
export default function LandingPage() {
  return (
    <div className="landing">
      <Hero />
      <Features />
      <Testimonials />
      <CTA />
    </div>
  );
}`
      ],
      typeSpeed: 50,
      backSpeed: 30,
      backDelay: 3000,
      loop: true,
      showCursor: true,
      cursorChar: '|',
    });

    // Typed.js for DataGenie Preview
    const typedDataGenie = new Typed('.typed-datagenie', {
      strings: [
        `import pandas as pd
from sklearn.model_selection import train_test_split
# Load and preprocess data
df = pd.read_csv('data.csv')
X_train, X_test, y_train, y_test = train_test_split(df.drop('target', axis=1), df['target'], test_size=0.2)`,
        `import numpy as np
from sklearn.linear_model import LogisticRegression
# Train model
model = LogisticRegression()
model.fit(X_train, y_train)
# Predict
predictions = model.predict(X_test)`,
        `import matplotlib.pyplot as plt
import seaborn as sns
# Visualize data
plt.figure(figsize=(10, 6))
sns.scatterplot(data=df, x='feature1', y='feature2', hue='target')
plt.title('Data Distribution')`
      ],
      typeSpeed: 50,
      backSpeed: 30,
      backDelay: 3000,
      loop: true,
      showCursor: true,
      cursorChar: '|',
    });

    // Typed.js for IDE Preview
    const typedIDE = new Typed('.typed-ide', {
      strings: [
        `import React from 'react';
const App = () => {
  return (
    <div className="app">
      // Your masterpiece begins here
    </div>
  );
};
export default App;`
      ],
      typeSpeed: 50,
      backSpeed: 30,
      backDelay: 3000,
      loop: true,
      showCursor: true,
      cursorChar: '|',
    });

    return () => {
      typed.destroy();
      typedDataGenie.destroy();
      typedIDE.destroy();
    };
  }, []);

  const features = [
    {
      icon: <MessageSquare className="w-6 h-6" />,
      title: "Natural Language to Code",
      description: "Describe your app idea in plain English and watch it come to life instantly."
    },
    {
      icon: <Eye className="w-6 h-6" />,
      title: "Live Preview",
      description: "See your application running in real-time as you make changes."
    },
    {
      icon: <Code className="w-6 h-6" />,
      title: "Modern Stack",
      description: "Generated apps use React, TypeScript, Tailwind CSS, and modern best practices."
    },
    {
      icon: <Download className="w-6 h-6" />,
      title: "Export & Deploy",
      description: "Download your code as a ZIP file or deploy directly to the web."
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Lightning Fast",
      description: "AI-powered generation creates complete applications in seconds."
    },
    {
      icon: <Layers className="w-6 h-6" />,
      title: "Full-Stack Ready",
      description: "Generate both frontend React apps and backend Node.js APIs."
    }
  ];

  const useCases = [
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Landing Pages",
      description: "Create stunning marketing websites and portfolios",
      examples: ["Business websites", "Personal portfolios", "Product showcases"]
    },
    {
      icon: <Smartphone className="w-8 h-8" />,
      title: "Web Applications",
      description: "Build interactive tools and productivity apps",
      examples: ["Todo managers", "Calculators", "Form builders"]
    },
    {
      icon: <Database className="w-8 h-8" />,
      title: "Dashboard & Analytics",
      description: "Generate data visualization and admin panels",
      examples: ["Analytics dashboards", "Admin interfaces", "Charts & graphs"]
    }
  ];

  const testimonials = [
    {
      name: "Mashrufa Hasnin Nourin",
      role: "Student",
      content: "CodeCraft helped me quickly prototype an app for a local project in Netrakona. It saved me some time, though I still needed to tweak the code.",
      rating: 4
    },
    {
      name: "Tanvir Rahman",
      role: "Startup Founder",
      content: "We used CodeCraft to build an MVP for our Bangladesh-based startup. The tool was helpful, but we had to make a few adjustments for our needs.",
      rating: 4
    },
    {
      name: "Farzana Akter",
      role: "UI/UX Designer",
      content: "I tried CodeCraft for a client demo. It made the process easier, but some features needed manual work.",
      rating: 4
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Floating Action Button with Enhanced Animation and Typed.js */}
<motion.div
  initial={{ scale: 0, opacity: 0 }}
  animate={{ scale: 1, opacity: 1 }}
  transition={{
    delay: 1,
    duration: 0.6,
    type: "spring",
    stiffness: 180,
    damping: 18,
  }}
  whileHover={{
    rotate: [0, -10, 10, -10, 10, 0],
    transition: { duration: 0.6 },
  }}
  className="fixed bottom-6 right-6 z-50 group"
>
  <Link href="/chat">
    <motion.div className="relative flex items-center">
      <Button
        size="lg"
        className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-600 via-blue-500 to-cyan-400 hover:scale-110 hover:shadow-[0_0_35px_rgba(99,102,241,0.8)] transition-all duration-300 ease-in-out border-4 border-white/80 dark:border-gray-800/80 shadow-2xl backdrop-blur-md"
      >
        <motion.div
          initial={{ rotate: 0 }}
          animate={{ rotate: [0, 10, -10, 10, 0] }}
          transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
        >
          <MessageSquare className="w-6 h-6 text-white" />
        </motion.div>
        {!showFABMessage && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center shadow-md"
          >
            <span className="text-xs font-bold text-white">!</span>
          </motion.div>
        )}
      </Button>

      <AnimatePresence>
        {showFABMessage && (
          <motion.div
            initial={{ opacity: 0, x: 30, scale: 0.8 }}
            animate={{ opacity: 1, x: 10, scale: 1 }}
            exit={{ opacity: 0, x: 30, scale: 0.8 }}
            transition={{ duration: 0.4 }}
            className="ml-4 px-4 py-2 rounded-xl bg-white dark:bg-gray-900 shadow-xl border border-blue-400/50 dark:border-purple-500/50 text-sm font-medium text-blue-700 dark:text-purple-300"
          >
            <span id="typed-message"></span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  </Link>

  {/* Typed.js Script */}
  {showFABMessage && typeof window !== "undefined" && (
    <script>
      {`
        import Typed from 'typed.js';
        const typed = new Typed('#typed-message', {
          strings: ['Chat with CodeCraft AI', 'Get coding help instantly', 'Your AI pair programmer'],
          typeSpeed: 40,
          backSpeed: 20,
          backDelay: 2000,
          loop: true,
        });
      `}
    </script>
  )}
</motion.div>


      {/* Navigation */}
      <nav className="border-b bg-gradient-to-r from-blue-50 via-purple-50 to-cyan-50 dark:from-blue-950/50 dark:via-purple-950/50 dark:to-cyan-950/50 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 rounded-lg flex items-center justify-center shadow-lg">
              <Code className="w-4 h-4 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">CodeCraft</span>
          </div>
          
          <div className="hidden md:flex items-center space-x-6">
            <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors hover:scale-105 duration-200">{t('nav.features')}</a>
            <Link href="/blog" className="text-muted-foreground hover:text-foreground transition-colors hover:scale-105 duration-200">{t('nav.blog')}</Link>
            <Link href="/about" className="text-muted-foreground hover:text-foreground transition-colors hover:scale-105 duration-200">{t('nav.about')}</Link>
            <Link href="/projects">
              <Button variant="ghost" className="hover:scale-105 transition-transform duration-200">{t('nav.projects')}</Button>
            </Link>
            <Link href="/settings">
              <Button variant="ghost" className="hover:scale-105 transition-transform duration-200">{t('nav.settings')}</Button>
            </Link>
          </div>
          
          <MobileNav />
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden bg-gradient-to-br from-blue-50 via-purple-50 to-cyan-50 dark:from-blue-950/50 dark:via-purple-950/50 dark:to-cyan-950/50">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="absolute top-10 right-10 w-72 h-72 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full opacity-10 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-gradient-to-r from-purple-400 to-cyan-500 rounded-full opacity-10 blur-3xl animate-pulse delay-1000"></div>
        
        <div className="container mx-auto text-center max-w-4xl relative z-10">
          <Badge variant="secondary" className="mb-6 px-4 py-2 text-sm font-medium bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/50 dark:to-purple-900/50 border-0 shadow-lg">
            ✨ AI-Powered • No-Code • Open Source
          </Badge>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent animate-gradient-x">
              {t('hero.title').split(' ').slice(0, 4).join(' ')}
            </span>
            <br />
            <span className="bg-gradient-to-r from-purple-600 via-cyan-600 to-blue-600 bg-clip-text text-transparent animate-gradient-x">
              {t('hero.title').split(' ').slice(4).join(' ')}
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-3xl mx-auto leading-relaxed">
            {t('hero.subtitle')}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
            <a href="https://codecraft.vercel.app/" target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="lg" className="w-full sm:w-auto px-8 py-4 text-lg border-2 border-purple-200 dark:border-purple-800 hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 dark:hover:from-purple-900/20 dark:hover:to-blue-900/20 transform hover:scale-110 transition-all duration-300 shadow-xl">
                <Monitor className="w-6 h-6 mr-3" />
                CodeCraft IDE
              </Button>
            </a>
            
            <Link href="/generator">
              <Button size="lg" className="w-full sm:w-auto px-8 py-4 text-lg bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 hover:from-blue-600 hover:via-purple-600 hover:to-cyan-600 transform hover:scale-110 transition-all duration-300 shadow-2xl hover:shadow-blue-500/25">
                <Rocket className="w-6 h-6 mr-3" />
                {t('hero.getStarted')}
              </Button>
            </Link>
            
            <Link href="/datagenie">
              <Button variant="outline" size="lg" className="w-full sm:w-auto px-8 py-4 text-lg border-2 border-cyan-200 dark:border-cyan-800 hover:bg-gradient-to-r hover:from-cyan-50 hover:to-purple-50 dark:hover:from-cyan-900/20 dark:hover:to-purple-900/20 transform hover:scale-110 transition-all duration-300 shadow-xl">
                <Database className="w-6 h-6 mr-3" />
                {t('hero.tryDataGenie')}
              </Button>
            </Link>
          </div>

          {/* Feature Preview */}
          <motion.div 
            className="mt-20 relative"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="bg-card shadow-2xl overflow-hidden border-0 bg-gradient-to-r from-white/80 to-gray-50/80 dark:from-gray-900/80 dark:to-gray-800/80 backdrop-blur-sm">
              <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-gradient-to-r from-gray-50/90 to-white/90 dark:from-gray-800/90 dark:to-gray-900/90">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full shadow-sm"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full shadow-sm"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full shadow-sm"></div>
                </div>
                <div className="text-sm text-muted-foreground font-medium">CodeCraft Editor</div>
                <div className="w-6"></div>
              </div>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                  >
                    <div className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-blue-500" />
                      Your Prompt
                    </div>
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/50 dark:to-purple-950/50 rounded-lg p-4 text-sm border border-blue-200/50 dark:border-blue-800/50">
                      "Create a todo list app with React that has add, delete, and mark complete functionality"
                    </div>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.4 }}
                  >
                    <div className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
                      <Code className="w-4 h-4 text-green-500" />
                      Generated Code
                    </div>
                    <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-lg p-4 text-sm text-green-400 font-mono border shadow-inner min-h-[200px]">
                      <span className="typed-code"></span>
                    </div>
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* DataGenie Promotion Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-blue-50 via-purple-50 to-cyan-50 dark:from-blue-950/50 dark:via-purple-950/50 dark:to-cyan-950/50 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <motion.div 
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ 
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full blur-3xl"
        ></motion.div>
        
        <div className="container mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-6xl mx-auto"
          >
            <div className="text-center mb-16">
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="inline-flex items-center gap-3 mb-6"
              >
                <div className="p-4 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 rounded-full shadow-2xl">
                  <Database className="w-12 h-12 text-white" />
                </div>
                <h2 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">
                  {t('datagenie.title')}
                </h2>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles className="w-8 h-8 text-blue-500" />
                </motion.div>
              </motion.div>
              
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-2xl text-gray-600 dark:text-gray-300 mb-4 font-medium"
              >
                {t('datagenie.subtitle')}
              </motion.p>
              
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="text-lg text-gray-500 dark:text-gray-400 mb-12 max-w-4xl mx-auto"
              >
                {t('datagenie.description')}
              </motion.p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="space-y-8"
              >
                <div className="space-y-6">
                  {[
                    { icon: <Zap className="w-6 h-6" />, title: "Data Processing", desc: "Effortlessly handle large datasets with powerful AI-driven tools" },
                    { icon: <BarChart3 className="w-6 h-6" />, title: "Advanced Analytics", desc: "Generate insights with built-in machine learning and visualization" },
                    { icon: <Database className="w-6 h-6" />, title: "Data Integration", desc: "Seamlessly connect and process data from multiple sources" }
                  ].map((feature, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.2 }}
                      className="flex items-start gap-4"
                    >
                      <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg shadow-lg flex-shrink-0">
                        <div className="text-white">{feature.icon}</div>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">{feature.title}</h3>
                        <p className="text-gray-600 dark:text-gray-400">{feature.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.8 }}
                >
                  <Link href="/datagenie">
                    <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 hover:from-blue-700 hover:via-purple-700 hover:to-cyan-700 text-white font-semibold px-12 py-4 text-lg transform hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-blue-500/25">
                      <Database className="w-6 h-6 mr-3" />
                      {t('hero.tryDataGenie')}
                      <ArrowRight className="w-6 h-6 ml-3" />
                    </Button>
                  </Link>
                </motion.div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="relative"
              >
                <div className="relative bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl shadow-2xl overflow-hidden border border-gray-700">
                  <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700 bg-gradient-to-r from-gray-800 to-gray-900">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>
                    <div className="text-sm text-gray-400 font-medium">DataGenie Console</div>
                    <div className="w-6"></div>
                  </div>
                  <div className="p-6">
                    <div className="space-y-3 text-sm font-mono">
                      <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.8, delay: 1 }}
                        className="text-blue-400"
                      >
                        <span className="typed-datagenie"></span>
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.8, delay: 1.2 }}
                        className="text-green-400"
                      >
                        # AI-powered data analysis
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.8, delay: 1.4 }}
                        className="text-purple-400"
                      >
                        model = train_model(data)
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.8, delay: 1.6 }}
                        className="text-yellow-400 ml-4"
                      >
                        predictions = model.predict(X_test)
                      </motion.div>
                    </div>
                  </div>
                </div>
                <motion.div
                  animate={{ y: [-10, 10, -10] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -top-4 -right-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full p-3 shadow-lg"
                >
                  <Sparkles className="w-6 h-6 text-white" />
                </motion.div>
                <motion.div
                  animate={{ y: [10, -10, 10] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                  className="absolute -bottom-4 -left-4 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full p-3 shadow-lg"
                >
                  <Database className="w-6 h-6 text-white" />
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CodeCraft IDE Promotion Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-purple-50 via-cyan-50 to-blue-50 dark:from-purple-950/50 dark:via-cyan-950/50 dark:to-blue-950/50 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <motion.div 
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ 
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-r from-purple-400 to-cyan-500 rounded-full blur-3xl"
        ></motion.div>
        
        <div className="container mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-6xl mx-auto"
          >
            <div className="text-center mb-16">
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="inline-flex items-center gap-3 mb-6"
              >
                <div className="p-4 bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500 rounded-full shadow-2xl">
                  <Monitor className="w-12 h-12 text-white" />
                </div>
                <h2 className="text-5xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent">
                  CodeCraft IDE
                </h2>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles className="w-8 h-8 text-purple-500" />
                </motion.div>
              </motion.div>
              
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-2xl text-gray-600 dark:text-gray-300 mb-4 font-medium"
              >
                The Ultimate Cloud-Based Development Environment
              </motion.p>
              
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="text-lg text-gray-500 dark:text-gray-400 mb-12 max-w-4xl mx-auto"
              >
                Experience the future of coding with our powerful IDE that combines AI assistance, 
                real-time collaboration, and instant deployment in one seamless platform.
              </motion.p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="space-y-8"
              >
                <div className="space-y-6">
                  {[
                    { icon: <Zap className="w-6 h-6" />, title: "Lightning Fast Performance", desc: "Experience blazing-fast code execution with our optimized cloud infrastructure" },
                    { icon: <Palette className="w-6 h-6" />, title: "Beautiful UI/UX", desc: "Enjoy a modern, intuitive interface designed for maximum productivity" },
                    { icon: <Play className="w-6 h-6" />, title: "Instant Preview", desc: "See your changes live with real-time preview and hot reloading" }
                  ].map((feature, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.2 }}
                      className="flex items-start gap-4"
                    >
                      <div className="p-3 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-lg shadow-lg flex-shrink-0">
                        <div className="text-white">{feature.icon}</div>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">{feature.title}</h3>
                        <p className="text-gray-600 dark:text-gray-400">{feature.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.8 }}
                >
                    <Link href="/ide-landing-page">
                    <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 hover:from-purple-700 hover:via-blue-700 hover:to-cyan-700 text-white font-semibold px-12 py-4 text-lg transform hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-purple-500/25">
                      <Monitor className="w-6 h-6 mr-3" />
                      Launch CodeCraft IDE
                      <ArrowRight className="w-6 h-6 ml-3" />
                    </Button>
                    </Link>
                </motion.div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="relative"
              >
                <div className="relative bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl shadow-2xl overflow-hidden border border-gray-700">
                  <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700 bg-gradient-to-r from-gray-800 to-gray-900">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>
                    <div className="text-sm text-gray-400 font-medium">CodeCraft IDE</div>
                    <div className="w-6"></div>
                  </div>
                  <div className="p-6">
                    <div className="space-y-3 text-sm font-mono">
                      <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.8, delay: 1 }}
                        className="text-blue-400"
                      >
                        <span className="typed-ide"></span>
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.8, delay: 1.2 }}
                        className="text-green-400"
                      >
                        // AI-powered code completion
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.8, delay: 1.4 }}
                        className="text-purple-400"
                      >
                        function createApp() {'{'}
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.8, delay: 1.6 }}
                        className="text-yellow-400 ml-4"
                      >
                        return &lt;App /&gt;;
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.8, delay: 1.8 }}
                        className="text-purple-400"
                      >
                        {'}'}
                      </motion.div>
                    </div>
                  </div>
                </div>
                <motion.div
                  animate={{ y: [-10, 10, -10] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -top-4 -right-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full p-3 shadow-lg"
                >
                  <Sparkles className="w-6 h-6 text-white" />
                </motion.div>
                <motion.div
                  animate={{ y: [10, -10, 10] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                  className="absolute -bottom-4 -left-4 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full p-3 shadow-lg"
                >
                  <Code className="w-6 h-6 text-white" />
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      <section id="features" className="py-20 px-4 bg-muted/20">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {t('features.title')}
            </h2>
            <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
              {t('features.subtitle')}
            </p>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Everything You Need to Build Amazing Apps
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              From idea to deployment in minutes, not months
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-800/50">
                <CardHeader>
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 rounded-lg flex items-center justify-center text-white mb-4 shadow-lg">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="use-cases" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              What Can You Build?
            </h2>
            <p className="text-xl text-muted-foreground">
              From simple tools to complex applications
            </p>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-8">
            {useCases.map((useCase, index) => (
              <Card key={index} className="text-center p-8 hover:shadow-xl transition-all duration-300 hover:scale-105 bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-800/50">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 rounded-full flex items-center justify-center text-white mx-auto mb-6 shadow-lg">
                  {useCase.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4">{useCase.title}</h3>
                <p className="text-muted-foreground mb-6">{useCase.description}</p>
                <ul className="space-y-2">
                  {useCase.examples.map((example, i) => (
                    <li key={i} className="flex items-center justify-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      {example}
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="testimonials" className="py-20 px-4 bg-muted/20">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Loved by Creators Worldwide
            </h2>
            <p className="text-xl text-muted-foreground">
              See what people are saying about CodeCraft
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="p-6 hover:shadow-xl transition-all duration-300 hover:scale-105 bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-800/50">
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4">"{testimonial.content}"</p>
                <div>
                  <div className="font-semibold">{testimonial.name}</div>
                  <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-gradient-to-br from-blue-50 via-purple-50 to-cyan-50 dark:from-blue-950/50 dark:via-purple-950/50 dark:to-cyan-950/50">
        <div className="container mx-auto text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Ready to Build Your Next App?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join thousands of creators who are building faster with AI
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/generator">
                <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-blue-500 via-purple-500 to-cyanavra-500 hover:from-blue-600 hover:via-purple-600 hover:to-cyan-600 transform hover:scale-105 transition-all duration-200 shadow-xl">
                  Start Building Now
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              
              <Link href="/chat">
                <Button size="lg" variant="outline" className="w-full sm:w-auto border-2 border-purple-200 dark:border-purple-800 hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 dark:hover:from-purple-900/20 dark:hover:to-blue-900/20 transform hover:scale-105 transition-all duration-200">
                  <MessageSquare className="w-5 h-5 mr-2" />
                  Try Chat Assistant
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 px-4 bg-muted/10">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 rounded-lg flex items-center justify-center shadow-lg">
                  <Code className="w-4 h-4 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">CodeCraft</span>
              </div>
              <p className="text-muted-foreground text-sm">
                Building the future of no-code development with AI
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/generator" className="hover:text-foreground transition-colors">Code Generator</Link></li>
                <li><Link href="/chat" className="hover:text-foreground transition-colors">AI Chat</Link></li>
                <li><Link href="/projects" className="hover:text-foreground transition-colors">My Projects</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#features" className="hover:text-foreground transition-colors">Features</a></li>
                <li><a href="#use-cases" className="hover:text-foreground transition-colors">Use Cases</a></li>
                <li><a href="#testimonials" className="hover:text-foreground transition-colors">Testimonials</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Connect</h4>
              <div className="flex space-x-4">
                <Button variant="ghost" size="sm" className="p-2 hover:scale-110 transition-transform duration-200">
                  <Github className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" className="p-2 hover:scale-110 transition-transform duration-200">
                  <Twitter className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" className="p-2 hover:scale-110 transition-transform duration-200">
                  <Mail className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}