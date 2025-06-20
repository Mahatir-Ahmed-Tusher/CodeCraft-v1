import { useState } from "react";
import { Sidebar } from "@/components/sidebar";
import { ChatInterface } from "@/components/chat-interface";
import { CodeEditor } from "@/components/code-editor";
import { PreviewFrame } from "@/components/preview-frame";
import { ProjectModal } from "@/components/project-modal";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { Code, Eye, Columns, Save, Download, Sparkles } from "lucide-react";
import { useWebContainer } from "@/hooks/use-webcontainer";
import { motion } from "framer-motion";
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

    console.log('Generated files:', Object.keys(newFiles));
    setFiles(newFiles);
    
    // Set the first meaningful file as active (prefer App.tsx or main component)
    const fileKeys = Object.keys(newFiles);
    let activeFileToSet = fileKeys[0];
    
    // Prioritize main component files
    const priorityFiles = ['src/App.tsx', 'App.tsx', 'src/main.tsx', 'main.tsx', 'index.tsx'];
    for (const priority of priorityFiles) {
      if (fileKeys.includes(priority)) {
        activeFileToSet = priority;
        break;
      }
    }
    
    if (activeFileToSet) {
      setActiveFile(activeFileToSet);
    }

    // Run the project in WebContainer with enhanced file structure
    if (Object.keys(newFiles).length > 0) {
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
    <div className="flex h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/20 to-purple-50/20 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 relative">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-blue-400/10 to-purple-600/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 90, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div 
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-purple-400/10 to-pink-600/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, -90, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div 
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-green-400/5 to-blue-600/5 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <Sidebar />
      
      <div className="flex-1 flex overflow-hidden relative z-10">
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
            <div className="flex flex-col h-full bg-gradient-to-br from-white/50 to-slate-50/50 dark:from-slate-800/50 dark:to-slate-900/50 backdrop-blur-xl">
              {/* Header with tabs and actions */}
              <motion.div 
                className="flex items-center justify-between px-6 py-4 border-b bg-gradient-to-r from-white/80 to-slate-50/80 dark:from-slate-800/80 dark:to-slate-900/80 backdrop-blur-xl"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Tabs value={viewMode} onValueChange={(value: any) => setViewMode(value as any)}>
                  <TabsList className="bg-gradient-to-r from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 p-1 rounded-xl shadow-lg">
                    <TabsTrigger 
                      value="code" 
                      className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300 rounded-lg px-4 py-2"
                    >
                      <Code className="w-4 h-4" />
                      <span className="font-medium">Code</span>
                    </TabsTrigger>
                    <TabsTrigger 
                      value="preview" 
                      className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300 rounded-lg px-4 py-2"
                    >
                      <Eye className="w-4 h-4" />
                      <span className="font-medium">Preview</span>
                    </TabsTrigger>
                    <TabsTrigger 
                      value="split" 
                      className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300 rounded-lg px-4 py-2"
                    >
                      <Columns className="w-4 h-4" />
                      <span className="font-medium">Split</span>
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
                
                <div className="flex items-center gap-3">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setShowSaveModal(true)}
                      disabled={Object.keys(files).length === 0}
                      className="bg-gradient-to-r from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 hover:from-slate-200 hover:to-slate-300 dark:hover:from-slate-600 dark:hover:to-slate-700 shadow-lg hover:shadow-xl transition-all duration-300 rounded-lg px-4 py-2"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      <span className="font-medium">Save</span>
                    </Button>
                  </motion.div>
                  
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={handleDownload}
                      disabled={!currentProject}
                      className="bg-gradient-to-r from-green-100 to-blue-100 dark:from-green-900/50 dark:to-blue-900/50 hover:from-green-200 hover:to-blue-200 dark:hover:from-green-800/50 dark:hover:to-blue-800/50 shadow-lg hover:shadow-xl transition-all duration-300 rounded-lg px-4 py-2"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      <span className="font-medium">Export</span>
                    </Button>
                  </motion.div>
                </div>
              </motion.div>

              {/* Content area */}
              <div className="flex-1 overflow-hidden relative">
                {/* Subtle animated background for coding area */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  <div className="absolute inset-0 opacity-30 dark:opacity-20">
                    <div className="absolute inset-0" style={{
                      backgroundImage: `radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
                                       radial-gradient(circle at 80% 20%, rgba(147, 51, 234, 0.1) 0%, transparent 50%),
                                       radial-gradient(circle at 40% 80%, rgba(16, 185, 129, 0.1) 0%, transparent 50%)`,
                    }} />
                  </div>
                </div>

                <motion.div
                  key={viewMode}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="h-full relative z-10"
                >
                  {viewMode === "code" && (
                    <div className="h-full bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 relative overflow-hidden">
                      {/* Code editor background effects */}
                      <div className="absolute inset-0 opacity-5">
                        <div className="absolute inset-0" style={{
                          backgroundImage: `linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
                                           linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)`,
                          backgroundSize: '20px 20px'
                        }} />
                      </div>
                      
                      {/* Gradient overlay for modern look */}
                      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />
                      
                      {/* No Code Generated State */}
                      {Object.keys(files).length === 0 && (
                        <div className="flex flex-col items-center justify-center h-full bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 relative">
                          <div className="text-center p-8">
                            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-slate-200 to-slate-300 dark:from-slate-600 dark:to-slate-700 rounded-full flex items-center justify-center">
                              <svg className="w-8 h-8 text-slate-400 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                              </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-2">No Code Generated</h3>
                            <p className="text-slate-600 dark:text-slate-400">Start a conversation to generate your application code</p>
                          </div>
                        </div>
                      )}
                      
                      {/* Code Editor - only show when files exist */}
                      {Object.keys(files).length > 0 && (
                        <CodeEditor
                          files={files}
                          activeFile={activeFile}
                          onActiveFileChange={setActiveFile}
                          onFileChange={handleFileChange}
                        />
                      )}
                    </div>
                  )}
                  
                  {viewMode === "preview" && (
                    <div className="h-full bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 relative overflow-hidden">
                      {/* Preview frame background effects */}
                      <div className="absolute inset-0 opacity-10">
                        <div className="absolute inset-0" style={{
                          backgroundImage: `radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.1) 0%, transparent 70%)`,
                        }} />
                      </div>
                      
                      {/* Gradient overlay for modern look */}
                      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 via-blue-500 to-purple-500" />
                      
                      <PreviewFrame
                        url={previewUrl}
                        isLoading={isLoading}
                      />
                    </div>
                  )}
                  
                  {viewMode === "split" && (
                    <div className="h-full relative">
                      {/* Split view gradient overlay */}
                      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500" />
                      
                      <ResizablePanelGroup direction="horizontal">
                        <ResizablePanel defaultSize={50}>
                          <div className="h-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
                            {/* Code side background effects */}
                            <div className="absolute inset-0 opacity-5">
                              <div className="absolute inset-0" style={{
                                backgroundImage: `linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
                                                 linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)`,
                                backgroundSize: '20px 20px'
                              }} />
                            </div>
                            
                            <CodeEditor
                              files={files}
                              activeFile={activeFile}
                              onActiveFileChange={setActiveFile}
                              onFileChange={handleFileChange}
                            />
                          </div>
                        </ResizablePanel>
                        
                        <ResizableHandle className="bg-gradient-to-b from-purple-500/20 to-pink-500/20" />
                        
                        <ResizablePanel defaultSize={50}>
                          <div className="h-full bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 relative overflow-hidden">
                            {/* Preview side background effects */}
                            <div className="absolute inset-0 opacity-10">
                              <div className="absolute inset-0" style={{
                                backgroundImage: `radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.1) 0%, transparent 70%)`,
                              }} />
                            </div>
                            
                            <PreviewFrame
                              url={previewUrl}
                              isLoading={isLoading}
                            />
                          </div>
                        </ResizablePanel>
                      </ResizablePanelGroup>
                    </div>
                  )}
                </motion.div>
              </div>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>

      <ProjectModal
        open={showSaveModal}
        onOpenChange={setShowSaveModal}
        files={files}
        onProjectSaved={(project: any) => {
          setCurrentProject(project);
          setShowSaveModal(false);
        }}
      />
    </div>
  );
}