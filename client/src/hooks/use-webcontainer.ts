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
      console.warn('WebContainer not available');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setPreviewUrl(null);
    mountedRef.current = false;

    try {
      // Convert files to WebContainer format
      const fileSystem: any = {};
      
      Object.entries(files).forEach(([path, content]) => {
        const parts = path.split('/');
        let current = fileSystem;
        
        for (let i = 0; i < parts.length - 1; i++) {
          if (!current[parts[i]]) {
            current[parts[i]] = { directory: {} };
          }
          current = current[parts[i]].directory;
        }
        
        current[parts[parts.length - 1]] = {
          file: { contents: content }
        };
      });

      // Mount the file system
      await webcontainer.mount(fileSystem);
      mountedRef.current = true;

      // Set up server-ready listener before starting any processes
      const serverReadyHandler = (port: number, url: string) => {
        console.log(`Server ready on port ${port}: ${url}`);
        setPreviewUrl(url);
        setIsLoading(false);
      };

      webcontainer.on('server-ready', serverReadyHandler);

      // Execute shell commands from artifacts in sequence
      const shellCommands = artifacts.filter(a => a.type === 'shell' && a.command);
      
      for (const cmd of shellCommands) {
        if (!cmd.command) continue;
        
        try {
          console.log(`Executing: ${cmd.command}`);
          
          if (cmd.command.includes('npm install')) {
            const installProcess = await webcontainer.spawn('npm', ['install']);
            const installExit = await installProcess.exit;
            console.log(`npm install exit code: ${installExit}`);
          } else if (cmd.command.includes('npm run dev')) {
            // Start dev server (don't await this as it's long-running)
            const devProcess = await webcontainer.spawn('npm', ['run', 'dev']);
            
            // Set a timeout to stop loading if server doesn't start
            setTimeout(() => {
              if (isLoading) {
                console.warn('Dev server timeout');
                setIsLoading(false);
              }
            }, 10000);
          } else {
            // Execute other commands
            const process = await webcontainer.spawn('sh', ['-c', cmd.command]);
            const exitCode = await process.exit;
            console.log(`Command "${cmd.command}" exit code: ${exitCode}`);
          }
        } catch (error) {
          console.error(`Failed to execute command: ${cmd.command}`, error);
        }
      }

      // If no dev command found, try to start a basic server
      if (!shellCommands.some(cmd => cmd.command?.includes('npm run dev'))) {
        const hasPackageJson = Object.keys(files).some(path => path.includes('package.json'));
        
        if (hasPackageJson) {
          try {
            console.log('Starting fallback dev server');
            const devProcess = await webcontainer.spawn('npm', ['run', 'dev']);
            setTimeout(() => {
              if (isLoading) {
                setIsLoading(false);
              }
            }, 8000);
          } catch (error) {
            console.error("Failed to start fallback dev server:", error);
            setIsLoading(false);
          }
        } else {
          setIsLoading(false);
        }
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
