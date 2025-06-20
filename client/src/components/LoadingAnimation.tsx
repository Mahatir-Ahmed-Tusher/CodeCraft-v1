import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Typed from 'typed.js';

const LoadingAnimation: React.FC = () => {
  const typedRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const options = {
      strings: [
        'useState(() => { return []; });\n// Architecting state management patterns...',
        'app.get("/api/data", (req, res) => res.json(data));\n// Building robust API endpoints...',
        'const fetchData = async () => await fetch("/api");\n// Implementing async data fetching...',
        'return <div className="flex justify-center">\n// Crafting responsive layouts with Tailwind...',
        '<Suspense fallback={<Loader />}>\n// Optimizing with React suspense boundaries...',
        'const port = process.env.PORT || 3000;\n// Configuring production-ready servers...',
        'import { motion } from "framer-motion";\n// Adding smooth micro-interactions...',
        'const middleware = (req, res, next) => next();\n// Setting up Express middleware chain...',
        'export default function Component() {\n// Creating reusable React components...',
        'const schema = z.object({ name: z.string() });\n// Implementing type-safe validation...',
        'git commit -m "feat: add new feature"\n// Following semantic versioning standards...',
        'docker build -t myapp:latest .\n// Containerizing for seamless deployment...',
      ],
      typeSpeed: 35,
      backSpeed: 15,
      backDelay: 1500,
      startDelay: 300,
      loop: true,
      showCursor: true,
      cursorChar: '▋',
      smartBackspace: true,
    };

    if (typedRef.current) {
      const typed = new Typed(typedRef.current, options);
      return () => {
        typed.destroy();
      };
    }
  }, []);

  const floatingElements = Array.from({ length: 6 }, (_, i) => (
    <motion.div
      key={i}
      className="absolute w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full opacity-20"
      animate={{
        x: [0, Math.random() * 100 - 50, 0],
        y: [0, Math.random() * 100 - 50, 0],
        scale: [1, 1.5, 1],
        opacity: [0.2, 0.8, 0.2],
      }}
      transition={{
        duration: 3 + Math.random() * 2,
        repeat: Infinity,
        delay: i * 0.5,
      }}
      style={{
        left: `${10 + Math.random() * 80}%`,
        top: `${10 + Math.random() * 80}%`,
      }}
    />
  ));

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="flex items-start space-x-3 chat-message mb-4"
    >
      {/* AI Avatar */}
      <motion.div 
        className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0 relative overflow-hidden"
        animate={{ 
          boxShadow: [
            "0 0 0 0 rgba(147, 51, 234, 0.4)",
            "0 0 0 8px rgba(147, 51, 234, 0)",
            "0 0 0 0 rgba(147, 51, 234, 0)"
          ]
        }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          className="w-4 h-4 text-white"
        >
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
        </motion.div>
      </motion.div>

      {/* Message Container */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-lg rounded-tl-none p-4 max-w-md bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 border border-slate-200 dark:border-slate-700 relative overflow-hidden"
      >
        {/* Background gradient animation */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5"
          animate={{
            backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{
            backgroundSize: "200% 200%",
          }}
        />
        
        {/* Floating elements */}
        {floatingElements}

        {/* Header */}
        <div className="flex items-center gap-2 mb-3 relative z-10">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-lg"
          >
            🚀
          </motion.div>
          <motion.h3 
            className="text-sm font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Crafting Your Application
          </motion.h3>
        </div>

        {/* Code Display */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-4 rounded-lg border border-slate-700 relative overflow-hidden">
          {/* Terminal-like header */}
          <div className="flex items-center gap-2 mb-3">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500 opacity-80"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500 opacity-80"></div>
              <div className="w-3 h-3 rounded-full bg-green-500 opacity-80"></div>
            </div>
            <div className="text-xs text-slate-400 ml-2 font-mono">
              ~/project/src/components
            </div>
          </div>
          
          {/* Animated background grid */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{
              backgroundImage: `linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
                               linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)`,
              backgroundSize: '20px 20px'
            }} />
          </div>

          <pre className="text-sm font-mono text-slate-300 overflow-hidden max-h-32 leading-relaxed relative z-10">
            <span ref={typedRef}></span>
          </pre>
        </div>

        {/* Progress Indicators */}
        <div className="mt-4 space-y-2 relative z-10">
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full"
            />
            <span className="text-xs text-slate-600 dark:text-slate-400">
              Analyzing requirements & generating components...
            </span>
          </div>
          
          <motion.div
            className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <motion.div
              className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full"
              animate={{
                width: ["0%", "100%", "0%"],
                x: ["0%", "0%", "100%"],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </motion.div>
        </div>

        {/* Fun message */}
        <motion.p 
          className="mt-3 text-xs text-slate-600 dark:text-slate-400 text-center relative z-10"
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <motion.span
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="inline-block mr-1"
          >
            ☕
          </motion.span>
          Brewing some digital magic... This won't take long!
        </motion.p>
      </motion.div>
    </motion.div>
  );
};

export default LoadingAnimation;