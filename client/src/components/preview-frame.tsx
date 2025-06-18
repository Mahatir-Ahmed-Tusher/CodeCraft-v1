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
        <div className="text-center">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <ExternalLink className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Live Preview</h3>
          <p className="text-muted-foreground text-sm mb-4">
            Your generated app will appear here
          </p>
          <Button variant="outline" disabled>
            <RefreshCw className="w-4 h-4 mr-2" />
            No Preview Available
          </Button>
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
          onError={() => setIsFrameLoading(false)}
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
          title="Application Preview"
        />
        
        {isFrameLoading && (
          <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
            <div className="text-center">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
              <p className="text-sm text-muted-foreground">Loading preview...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
