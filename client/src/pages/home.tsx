import { useState } from "react";
import { Sidebar } from "@/components/sidebar";
import { ChatInterface } from "@/components/chat-interface";
import { CodeEditor } from "@/components/code-editor";
import { PreviewFrame } from "@/components/preview-frame";
import { ProjectModal } from "@/components/project-modal";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { Code, Eye, Columns, Save, Download } from "lucide-react";
import { useWebContainer } from "@/hooks/use-webcontainer";
import type { CodeArtifact } from "@shared/schema";

export default function Home() {
  const [currentProject, setCurrentProject] = useState<any>(null);
  const [files, setFiles] = useState<Record<string, string>>({});
  const [activeFile, setActiveFile] = useState<string>("App.tsx");
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [viewMode, setViewMode] = useState<"code" | "preview" | "split">("code");
  const { webcontainer, isLoading, previewUrl, runProject } = useWebContainer();

  const handleCodeGenerated = async (artifacts: CodeArtifact[]) => {
    const newFiles: Record<string, string> = {};
    
    // Process file artifacts
    artifacts
      .filter(artifact => artifact.type === 'file')
      .forEach(artifact => {
        if (artifact.path && artifact.content) {
          newFiles[artifact.path] = artifact.content;
        }
      });

    setFiles(newFiles);
    
    // Set the first file as active
    const fileKeys = Object.keys(newFiles);
    if (fileKeys.length > 0) {
      setActiveFile(fileKeys[0]);
    }

    // Run the project in WebContainer
    if (webcontainer && Object.keys(newFiles).length > 0) {
      await runProject(newFiles, artifacts);
    }
  };

  const handleFileChange = (path: string, content: string) => {
    setFiles(prev => ({
      ...prev,
      [path]: content
    }));
  };

  const handleDownload = () => {
    if (!currentProject) return;
    
    // Create zip download
    const link = document.createElement('a');
    link.href = `/api/projects/${currentProject.id}/download`;
    link.download = `${currentProject.name}.zip`;
    link.click();
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      
      <div className="flex-1 flex overflow-hidden">
        <ResizablePanelGroup direction="horizontal">
          {/* Chat Interface */}
          <ResizablePanel defaultSize={50} minSize={30}>
            <ChatInterface 
              onCodeGenerated={handleCodeGenerated}
              currentProject={currentProject}
              onProjectChange={setCurrentProject}
            />
          </ResizablePanel>
          
          <ResizableHandle />
          
          {/* Code Editor and Preview */}
          <ResizablePanel defaultSize={50} minSize={30}>
            <div className="flex flex-col h-full">
              {/* Header with tabs and actions */}
              <div className="flex items-center justify-between px-4 py-2 border-b bg-card">
                <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as any)}>
                  <TabsList>
                    <TabsTrigger value="code" className="flex items-center gap-2">
                      <Code className="w-4 h-4" />
                      Code
                    </TabsTrigger>
                    <TabsTrigger value="preview" className="flex items-center gap-2">
                      <Eye className="w-4 h-4" />
                      Preview
                    </TabsTrigger>
                    <TabsTrigger value="split" className="flex items-center gap-2">
                      <Columns className="w-4 h-4" />
                      Split
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
                
                <div className="flex items-center gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setShowSaveModal(true)}
                    disabled={Object.keys(files).length === 0}
                  >
                    <Save className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={handleDownload}
                    disabled={!currentProject}
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Content area */}
              <div className="flex-1 overflow-hidden">
                {viewMode === "code" && (
                  <CodeEditor
                    files={files}
                    activeFile={activeFile}
                    onActiveFileChange={setActiveFile}
                    onFileChange={handleFileChange}
                  />
                )}
                
                {viewMode === "preview" && (
                  <PreviewFrame
                    url={previewUrl}
                    isLoading={isLoading}
                  />
                )}
                
                {viewMode === "split" && (
                  <ResizablePanelGroup direction="horizontal">
                    <ResizablePanel defaultSize={50}>
                      <CodeEditor
                        files={files}
                        activeFile={activeFile}
                        onActiveFileChange={setActiveFile}
                        onFileChange={handleFileChange}
                      />
                    </ResizablePanel>
                    <ResizableHandle />
                    <ResizablePanel defaultSize={50}>
                      <PreviewFrame
                        url={previewUrl}
                        isLoading={isLoading}
                      />
                    </ResizablePanel>
                  </ResizablePanelGroup>
                )}
              </div>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>

      <ProjectModal
        open={showSaveModal}
        onOpenChange={setShowSaveModal}
        files={files}
        onProjectSaved={(project) => {
          setCurrentProject(project);
          setShowSaveModal(false);
        }}
      />
    </div>
  );
}
