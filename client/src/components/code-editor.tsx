import { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { X, FileText, FileCode } from "lucide-react";
import { useTheme } from "@/components/theme-provider";

interface CodeEditorProps {
  files: Record<string, string>;
  activeFile: string;
  onActiveFileChange: (path: string) => void;
  onFileChange: (path: string, content: string) => void;
}

export function CodeEditor({ 
  files, 
  activeFile, 
  onActiveFileChange, 
  onFileChange 
}: CodeEditorProps) {
  const { theme } = useTheme();
  const [openTabs, setOpenTabs] = useState<string[]>([]);

  useEffect(() => {
    // Update open tabs when files change
    const fileKeys = Object.keys(files);
    setOpenTabs(fileKeys);
    
    // Set active file if not already set
    if (fileKeys.length > 0 && !fileKeys.includes(activeFile)) {
      onActiveFileChange(fileKeys[0]);
    }
  }, [files, activeFile, onActiveFileChange]);

  const getFileLanguage = (filePath: string) => {
    const ext = filePath.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'ts':
      case 'tsx':
        return 'typescript';
      case 'js':
      case 'jsx':
        return 'javascript';
      case 'html':
        return 'html';
      case 'css':
        return 'css';
      case 'json':
        return 'json';
      case 'md':
        return 'markdown';
      default:
        return 'plaintext';
    }
  };

  const getFileIcon = (filePath: string) => {
    const ext = filePath.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'tsx':
      case 'jsx':
        return <div className="w-4 h-4 bg-blue-500 rounded flex items-center justify-center text-white text-xs font-bold">R</div>;
      case 'ts':
      case 'js':
        return <div className="w-4 h-4 bg-yellow-500 rounded flex items-center justify-center text-white text-xs font-bold">JS</div>;
      case 'html':
        return <FileCode className="w-4 h-4 text-orange-500" />;
      case 'css':
        return <div className="w-4 h-4 bg-blue-600 rounded flex items-center justify-center text-white text-xs font-bold">CSS</div>;
      case 'json':
        return <FileText className="w-4 h-4 text-green-500" />;
      default:
        return <FileText className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const closeTab = (filePath: string, event: React.MouseEvent) => {
    event.stopPropagation();
    const newTabs = openTabs.filter(tab => tab !== filePath);
    setOpenTabs(newTabs);
    
    if (activeFile === filePath && newTabs.length > 0) {
      onActiveFileChange(newTabs[0]);
    }
  };

  if (Object.keys(files).length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <FileCode className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No Code Generated</h3>
          <p className="text-muted-foreground text-sm">
            Start a conversation to generate your application code
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-background">
      {/* File Tabs */}
      <div className="border-b bg-card overflow-x-auto">
        <div className="flex min-w-max">
          {openTabs.map((filePath) => (
            <div
              key={filePath}
              className={`px-4 py-2 text-sm border-r border-border flex items-center space-x-2 cursor-pointer min-w-0 ${
                activeFile === filePath 
                  ? 'bg-background border-b-2 border-b-primary' 
                  : 'hover:bg-muted/50'
              }`}
              onClick={() => onActiveFileChange(filePath)}
            >
              {getFileIcon(filePath)}
              <span className="truncate">{filePath.split('/').pop()}</span>
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
                onClick={(e) => closeTab(filePath, e)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 relative">
        {activeFile && files[activeFile] ? (
          <Editor
            height="100%"
            language={getFileLanguage(activeFile)}
            value={files[activeFile]}
            onChange={(value) => {
              if (value !== undefined) {
                onFileChange(activeFile, value);
              }
            }}
            theme={theme === 'dark' ? 'vs-dark' : 'vs'}
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              lineNumbers: 'on',
              roundedSelection: false,
              scrollBeyondLastLine: false,
              automaticLayout: true,
              wordWrap: 'on',
              tabSize: 2,
              insertSpaces: true,
            }}
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground">Select a file to view its contents</p>
          </div>
        )}
      </div>

      {/* File Explorer Sidebar */}
      <div className="absolute top-0 right-0 w-64 h-full bg-card border-l hidden lg:block">
        <div className="p-3 border-b">
          <h3 className="text-sm font-semibold">Files</h3>
        </div>
        <ScrollArea className="h-full">
          <div className="p-2 space-y-1">
            {Object.keys(files).map((filePath) => (
              <div
                key={filePath}
                className={`flex items-center space-x-2 px-2 py-1 rounded text-sm cursor-pointer ${
                  activeFile === filePath 
                    ? 'bg-primary text-primary-foreground' 
                    : 'hover:bg-muted'
                }`}
                onClick={() => onActiveFileChange(filePath)}
              >
                {getFileIcon(filePath)}
                <span className="truncate text-xs">{filePath}</span>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
