import { useState, useEffect, useCallback } from 'react';
import { WebContainer } from '@webcontainer/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, AlertCircle, Terminal, Play, Download, ExternalLink } from 'lucide-react';

interface EnhancedWebContainerProps {
  files: Record<string, string>;
  onPreviewReady?: (url: string) => void;
  onError?: (error: string) => void;
}

interface BuildStep {
  id: string;
  name: string;
  status: 'pending' | 'running' | 'completed' | 'error';
  output?: string;
}

export function EnhancedWebContainer({ files, onPreviewReady, onError }: EnhancedWebContainerProps) {
  const [webcontainer, setWebcontainer] = useState<WebContainer | null>(null);
  const [buildSteps, setBuildSteps] = useState<BuildStep[]>([]);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [buildProgress, setBuildProgress] = useState(0);
  const [isSupported, setIsSupported] = useState(true);
  const [logs, setLogs] = useState<string[]>([]);
  const [isBuilding, setIsBuilding] = useState(false);

  const updateStep = useCallback((stepId: string, updates: Partial<BuildStep>) => {
    setBuildSteps(prev => prev.map(step => 
      step.id === stepId ? { ...step, ...updates } : step
    ));
  }, []);

  const addLog = useCallback((message: string) => {
    setLogs(prev => [...prev.slice(-49), `[${new Date().toLocaleTimeString()}] ${message}`]);
  }, []);

  useEffect(() => {
    const initWebContainer = async () => {
      try {
        // Check browser support
        if (typeof SharedArrayBuffer === 'undefined') {
          setIsSupported(false);
          addLog('SharedArrayBuffer not available - requires Cross-Origin-Isolation headers');
          onError?.('WebContainer requires SharedArrayBuffer support');
          return;
        }

        addLog('Initializing WebContainer...');
        const instance = await WebContainer.boot();
        setWebcontainer(instance);
        addLog('WebContainer initialized successfully');
      } catch (error) {
        addLog(`Failed to initialize WebContainer: ${error}`);
        setIsSupported(false);
        onError?.(error instanceof Error ? error.message : 'Unknown error');
      }
    };

    initWebContainer();
  }, [onError, addLog]);

  const buildProject = useCallback(async () => {
    if (!webcontainer || !files || Object.keys(files).length === 0) return;

    setIsBuilding(true);
    setBuildProgress(0);
    
    const steps: BuildStep[] = [
      { id: 'mount', name: 'Mounting files', status: 'pending' },
      { id: 'install', name: 'Installing dependencies', status: 'pending' },
      { id: 'build', name: 'Building project', status: 'pending' },
      { id: 'serve', name: 'Starting dev server', status: 'pending' }
    ];
    
    setBuildSteps(steps);

    try {
      // Step 1: Mount files
      updateStep('mount', { status: 'running' });
      addLog('Mounting project files...');
      
      const fileSystemTree = Object.entries(files).reduce((tree, [path, content]) => {
        const pathParts = path.split('/');
        let current = tree;
        
        for (let i = 0; i < pathParts.length - 1; i++) {
          const part = pathParts[i];
          if (!current[part]) {
            current[part] = { directory: {} };
          }
          current = current[part].directory;
        }
        
        const fileName = pathParts[pathParts.length - 1];
        current[fileName] = { file: { contents: content } };
        
        return tree;
      }, {} as any);

      await webcontainer.mount(fileSystemTree);
      updateStep('mount', { status: 'completed' });
      setBuildProgress(25);
      addLog(`Mounted ${Object.keys(files).length} files`);

      // Step 2: Install dependencies
      updateStep('install', { status: 'running' });
      addLog('Installing dependencies...');
      
      const installProcess = await webcontainer.spawn('npm', ['install']);
      const installExitCode = await installProcess.exit;
      
      if (installExitCode !== 0) {
        throw new Error('Failed to install dependencies');
      }
      
      updateStep('install', { status: 'completed' });
      setBuildProgress(60);
      addLog('Dependencies installed successfully');

      // Step 3: Build project (if build script exists)
      const packageJson = JSON.parse(files['package.json'] || '{}');
      if (packageJson.scripts?.build) {
        updateStep('build', { status: 'running' });
        addLog('Building project...');
        
        const buildProcess = await webcontainer.spawn('npm', ['run', 'build']);
        const buildExitCode = await buildProcess.exit;
        
        if (buildExitCode !== 0) {
          addLog('Build failed, continuing with dev server...');
        } else {
          addLog('Build completed successfully');
        }
        
        updateStep('build', { status: buildExitCode === 0 ? 'completed' : 'error' });
        setBuildProgress(80);
      } else {
        updateStep('build', { status: 'completed' });
        setBuildProgress(80);
        addLog('No build script found, skipping build step');
      }

      // Step 4: Start dev server
      updateStep('serve', { status: 'running' });
      addLog('Starting development server...');
      
      const devProcess = await webcontainer.spawn('npm', ['run', 'dev']);
      
      // Listen for server ready
      webcontainer.on('server-ready', (port, url) => {
        addLog(`Development server started on port ${port}`);
        setPreviewUrl(url);
        onPreviewReady?.(url);
        updateStep('serve', { status: 'completed' });
        setBuildProgress(100);
        setIsBuilding(false);
      });

      // Listen for errors
      devProcess.output.pipeTo(new WritableStream({
        write(data) {
          const output = new TextDecoder().decode(data);
          addLog(output.trim());
          
          // Check for common error patterns
          if (output.includes('Error:') || output.includes('error')) {
            addLog(`Server error detected: ${output}`);
          }
          
          // Check for server ready indicators
          if (output.includes('Local:') || output.includes('localhost:') || output.includes('ready')) {
            // Server might be ready, try to get URL
            setTimeout(() => {
              if (!previewUrl) {
                // Fallback URL detection
                const port = output.match(/:(\d+)/)?.[1] || '3000';
                const url = `https://${window.location.hostname.split('.')[0]}-${port}.${window.location.hostname.split('.').slice(1).join('.')}`;
                setPreviewUrl(url);
                onPreviewReady?.(url);
                updateStep('serve', { status: 'completed' });
                setBuildProgress(100);
                setIsBuilding(false);
              }
            }, 2000);
          }
        }
      }));

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      addLog(`Build failed: ${errorMessage}`);
      onError?.(errorMessage);
      setBuildSteps(prev => prev.map(step => 
        step.status === 'running' ? { ...step, status: 'error' } : step
      ));
      setIsBuilding(false);
    }
  }, [webcontainer, files, onPreviewReady, onError, updateStep, addLog]);

  const getStepIcon = (status: BuildStep['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'running':
        return <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />;
      default:
        return <div className="w-4 h-4 border-2 border-gray-300 rounded-full" />;
    }
  };

  if (!isSupported) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-orange-500" />
            WebContainer Not Supported
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Your browser doesn't support WebContainer technology. This requires SharedArrayBuffer and Cross-Origin-Isolation headers.
            </AlertDescription>
          </Alert>
          
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Alternative options:</p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Download ZIP
              </Button>
              <Button variant="outline" size="sm">
                <ExternalLink className="w-4 h-4 mr-2" />
                Open in CodeSandbox
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Build Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Terminal className="w-5 h-5" />
              WebContainer Build
            </span>
            <Badge variant={previewUrl ? "default" : "secondary"}>
              {previewUrl ? "Ready" : "Stopped"}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {isBuilding && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Building project...</span>
                <span>{buildProgress}%</span>
              </div>
              <Progress value={buildProgress} className="h-2" />
            </div>
          )}

          <div className="flex gap-2">
            <Button 
              onClick={buildProject} 
              disabled={!webcontainer || isBuilding || Object.keys(files).length === 0}
              className="flex items-center gap-2"
            >
              <Play className="w-4 h-4" />
              {isBuilding ? 'Building...' : 'Start Preview'}
            </Button>
            
            {previewUrl && (
              <Button variant="outline" asChild>
                <a href={previewUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Open Preview
                </a>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Build Steps */}
      {buildSteps.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Build Steps</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {buildSteps.map((step) => (
                <div key={step.id} className="flex items-center gap-3 py-2">
                  {getStepIcon(step.status)}
                  <span className="text-sm">{step.name}</span>
                  {step.status === 'completed' && (
                    <Badge variant="outline" className="ml-auto text-xs">
                      Done
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Console Logs */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Console Output</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-black text-green-400 p-3 rounded font-mono text-xs h-40 overflow-y-auto">
            {logs.length === 0 ? (
              <div className="text-gray-500">No output yet...</div>
            ) : (
              logs.map((log, index) => (
                <div key={index}>{log}</div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Preview Frame */}
      {previewUrl && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Live Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <iframe
              src={previewUrl}
              className="w-full h-96 border rounded"
              title="Live Preview"
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}