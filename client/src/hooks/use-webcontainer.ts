import { useState, useEffect, useRef } from "react";
import { WebContainer } from "@webcontainer/api";
import type { CodeArtifact } from "@shared/schema";

export function useWebContainer() {
  const [webcontainer, setWebcontainer] = useState<WebContainer | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const mountedRef = useRef(false);

  useEffect(() => {
    let isMounted = true;

    const bootWebContainer = async () => {
      try {
        // Check if WebContainer is supported
        if (typeof SharedArrayBuffer === 'undefined') {
          console.warn('SharedArrayBuffer not available, WebContainer preview disabled');
          return;
        }

        const instance = await WebContainer.boot();
        if (isMounted) {
          setWebcontainer(instance);
        }
      } catch (error) {
        console.error("Failed to boot WebContainer:", error);
        // Don't block the UI if WebContainer fails
      }
    };

    bootWebContainer();

    return () => {
      isMounted = false;
    };
  }, []);

  const runProject = async (files: Record<string, string>, artifacts: CodeArtifact[]) => {
    if (!webcontainer) {
      console.warn('WebContainer not available - SharedArrayBuffer may not be supported');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setPreviewUrl(null);
    mountedRef.current = false;

    try {
      // Add default package.json if missing (adapted from Builder.tsx logic)
      if (!files['package.json']) {
        files['package.json'] = JSON.stringify({
          name: "generated-app",
          version: "1.0.0",
          private: true,
          type: "module",
          scripts: {
            dev: "vite --host 0.0.0.0 --port 3000",
            build: "vite build",
            preview: "vite preview"
          },
          dependencies: {
            react: "^18.2.0",
            "react-dom": "^18.2.0",
            "lucide-react": "^0.263.1"
          },
          devDependencies: {
            "@types/react": "^18.2.15",
            "@types/react-dom": "^18.2.7",
            "@vitejs/plugin-react": "^4.0.3",
            autoprefixer: "^10.4.14",
            postcss: "^8.4.27",
            tailwindcss: "^3.3.3",
            typescript: "^5.0.2",
            vite: "^4.4.5"
          }
        }, null, 2);
      }

      // Add default Vite config if missing
      if (!files['vite.config.ts'] && !files['vite.config.js']) {
        files['vite.config.ts'] = `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 3000,
    strictPort: true
  }
})`;
      }

      // Convert files to WebContainer format (adapted from Builder.tsx)
      const createMountStructure = (fileMap: Record<string, string>) => {
        const mountStructure: any = {};

        Object.entries(fileMap).forEach(([filePath, content]) => {
          const parts = filePath.split('/').filter(Boolean);
          let current = mountStructure;
          
          for (let i = 0; i < parts.length - 1; i++) {
            const dirName = parts[i];
            if (!current[dirName]) {
              current[dirName] = { directory: {} };
            }
            current = current[dirName].directory;
          }
          
          const fileName = parts[parts.length - 1];
          current[fileName] = {
            file: { contents: content }
          };
        });

        return mountStructure;
      };

      const mountStructure = createMountStructure(files);
      console.log('Mounting WebContainer with structure:', Object.keys(mountStructure));

      // Mount the file system
      await webcontainer.mount(mountStructure);
      mountedRef.current = true;

      // Set up server-ready listener
      const serverReadyHandler = (port: number, url: string) => {
        console.log(`Server ready on port ${port}: ${url}`);
        setPreviewUrl(url);
        setIsLoading(false);
      };

      webcontainer.on('server-ready', serverReadyHandler);

      // Install dependencies first
      console.log('Installing dependencies...');
      try {
        const installProcess = await webcontainer.spawn('npm', ['install']);
        const exitCode = await installProcess.exit;
        console.log(`npm install completed with exit code: ${exitCode}`);
        
        if (exitCode !== 0) {
          throw new Error(`npm install failed with exit code ${exitCode}`);
        }
      } catch (error) {
        console.error('Failed to install dependencies:', error);
        setIsLoading(false);
        return;
      }

      // Start the development server
      console.log('Starting development server...');
      try {
        const devProcess = await webcontainer.spawn('npm', ['run', 'dev']);
        
        // Set timeout for server start
        const timeout = setTimeout(() => {
          console.warn('Dev server start timeout');
          setIsLoading(false);
        }, 15000);

        // Clear timeout if server starts successfully
        webcontainer.on('server-ready', () => {
          clearTimeout(timeout);
        });
        
      } catch (error) {
        console.error('Failed to start dev server:', error);
        setIsLoading(false);
      }

    } catch (error) {
      console.error("Failed to run project:", error);
      setIsLoading(false);
    }
  };

  return {
    webcontainer,
    isLoading,
    previewUrl,
    runProject,
    isMounted: mountedRef.current
  };
}
