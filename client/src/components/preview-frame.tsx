import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw, ExternalLink, AlertCircle } from "lucide-react";

interface PreviewFrameProps {
  url: string | null;
  isLoading: boolean;
}

export function PreviewFrame({ url, isLoading }: PreviewFrameProps) {
  const [key, setKey] = useState(0);
  const [isFrameLoading, setIsFrameLoading] = useState(false);

  const refresh = () => {
    setKey(prev => prev + 1);
    setIsFrameLoading(true);
  };

  const openInNewTab = () => {
    if (url) {
      window.open(url, '_blank');
    }
  };

  useEffect(() => {
    if (url) {
      setIsFrameLoading(true);
    }
  }, [url]);

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h3 className="text-lg font-semibold mb-2">Starting Preview</h3>
          <p className="text-muted-foreground text-sm">
            Setting up your application...
          </p>
        </div>
      </div>
    );
  }

  if (!url) {
    return (
      <div className="flex-1 flex items-center justify-center bg-background">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <ExternalLink className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Live Preview</h3>
          <p className="text-muted-foreground text-sm mb-4">
            Generate an application to see the live preview here. Your app will run in real-time as you make changes.
          </p>
          <div className="text-xs text-muted-foreground space-y-2">
            <div>Note: Live preview requires Cross-Origin-Isolation headers</div>
            <div className="text-blue-600 dark:text-blue-400">
              💡 Generated files are available in the code editor and can be downloaded as a ZIP
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Preview Header */}
      <div className="flex items-center justify-between p-3 border-b bg-card">
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1">
            <div className={`w-2 h-2 rounded-full ${isFrameLoading ? 'bg-yellow-500' : 'bg-green-500'}`}></div>
            <span className="text-sm text-muted-foreground">
              {isFrameLoading ? 'Loading...' : 'Live'}
            </span>
          </div>
          <div className="text-xs text-muted-foreground truncate max-w-xs">
            {url}
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={refresh}
            disabled={isFrameLoading}
          >
            <RefreshCw className={`w-4 h-4 ${isFrameLoading ? 'animate-spin' : ''}`} />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={openInNewTab}
          >
            <ExternalLink className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Preview Frame */}
      <div className="flex-1 relative">
        <iframe
          key={key}
          src={url}
          className="w-full h-full border-0 bg-white"
          onLoad={() => setIsFrameLoading(false)}
          onError={() => {
            setIsFrameLoading(false);
            console.error('Preview iframe failed to load');
          }}
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals allow-downloads"
          title="Application Preview"
          allow="cross-origin-isolated"
        />
        
        {isFrameLoading && (
          <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
            <div className="text-center">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
              <p className="text-sm text-muted-foreground">Starting application...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
