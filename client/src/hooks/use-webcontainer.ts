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
        const instance = await WebContainer.boot();
        if (isMounted) {
          setWebcontainer(instance);
        }
      } catch (error) {
        console.error("Failed to boot WebContainer:", error);
      }
    };

    bootWebContainer();

    return () => {
      isMounted = false;
    };
  }, []);

  const runProject = async (files: Record<string, string>, artifacts: CodeArtifact[]) => {
    if (!webcontainer) return;

    setIsLoading(true);
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

      // Execute shell commands from artifacts
      const shellCommands = artifacts.filter(a => a.type === 'shell' && a.command);
      
      for (const cmd of shellCommands) {
        if (!cmd.command) continue;
        
        try {
          const process = await webcontainer.spawn('sh', ['-c', cmd.command]);
          const exitCode = await process.exit;
          
          if (exitCode !== 0) {
            console.warn(`Command failed with exit code ${exitCode}: ${cmd.command}`);
          }
        } catch (error) {
          console.error(`Failed to execute command: ${cmd.command}`, error);
        }
      }

      // Start the dev server and capture the URL
      webcontainer.on('server-ready', (port, url) => {
        setPreviewUrl(url);
        setIsLoading(false);
      });

      // Try to start a dev server
      const hasPackageJson = Object.keys(files).some(path => path.includes('package.json'));
      
      if (hasPackageJson) {
        try {
          // Install dependencies
          const installProcess = await webcontainer.spawn('npm', ['install']);
          await installProcess.exit;
          
          // Start dev server
          const startProcess = await webcontainer.spawn('npm', ['run', 'dev'], {
            env: { ...process.env, PORT: '3000' }
          });
          
          // Don't wait for this to exit as it's a long-running process
        } catch (error) {
          console.error("Failed to start dev server:", error);
          setIsLoading(false);
        }
      } else {
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
