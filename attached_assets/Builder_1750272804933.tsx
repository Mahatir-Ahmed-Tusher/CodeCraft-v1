import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { StepsList } from '../components/StepsList';
import { FileExplorer } from '../components/FileExplorer';
import { TabView } from '../components/TabView';
import { CodeEditor } from '../components/CodeEditor';
import { PreviewFrame } from '../components/PreviewFrame';
import { Step, FileItem, StepType } from '../types';
import axios from 'axios';
import { BACKEND_URL } from '../config';
import { parseXml } from '../steps';
import { useWebContainer } from '../hooks/useWebContainer';
import { FileSystemTree } from '@webcontainer/api';
import { Loader } from '../components/Loader';

export function Builder() {
  const location = useLocation();
  const { prompt } = location.state as { prompt: string };
  const [userPrompt, setPrompt] = useState("");
  const [llmMessages, setLlmMessages] = useState<{ role: "user" | "assistant"; content: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [templateSet, setTemplateSet] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const webcontainer = useWebContainer();

  const [currentStep, setCurrentStep] = useState(1);
  const [activeTab, setActiveTab] = useState<'code' | 'preview'>('code');
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
  
  const [steps, setSteps] = useState<Step[]>([]);
  const [files, setFiles] = useState<FileItem[]>([]);

  const defaultPackageJson: FileItem = {
    name: 'package.json',
    type: 'file',
    path: '/package.json',
    content: JSON.stringify({
      name: "web-app",
      version: "1.0.0",
      private: true,
      scripts: {
        dev: "vite",
        build: "vite build",
        preview: "vite preview"
      },
      dependencies: {
        react: "^18.2.0",
        "react-dom": "^18.2.0",
        "react-router-dom": "^6.14.0",
        axios: "^1.4.0"
      },
      devDependencies: {
        vite: "^4.4.0",
        "@types/react": "^18.2.0",
        "@types/react-dom": "^18.2.0",
        "@vitejs/plugin-react": "^4.0.0",
        tailwindcss: "^3.3.0",
        autoprefixer: "^10.4.0",
        postcss: "^8.4.0"
      }
    }, null, 2)
  };

  useEffect(() => {
    let originalFiles = [...files];
    let updateHappened = false;
    steps.filter(({ status }) => status === "pending").forEach(step => {
      updateHappened = true;
      if (step?.type === StepType.CreateFile) {
        let parsedPath = step.path?.split("/") ?? [];
        let currentFileStructure = [...originalFiles];
        const finalAnswerRef = currentFileStructure;

        let currentFolder = "";
        while (parsedPath.length) {
          currentFolder = `${currentFolder}/${parsedPath[0]}`;
          const currentFolderName = parsedPath[0];
          parsedPath = parsedPath.slice(1);

          if (!parsedPath.length) {
            const file = currentFileStructure.find(x => x.path === currentFolder);
            if (!file) {
              currentFileStructure.push({
                name: currentFolderName,
                type: 'file',
                path: currentFolder,
                content: step.code
              });
            } else {
              file.content = step.code;
            }
          } else {
            const folder = currentFileStructure.find(x => x.path === currentFolder);
            if (!folder) {
              currentFileStructure.push({
                name: currentFolderName,
                type: 'folder',
                path: currentFolder,
                children: []
              });
            }
            currentFileStructure = currentFileStructure.find(x => x.path === currentFolder)!.children!;
          }
        }
        originalFiles = finalAnswerRef;
      }
    });

    if (updateHappened) {
      if (!originalFiles.some(f => f.name === 'package.json')) {
        originalFiles.push(defaultPackageJson);
      }
      setFiles(originalFiles);
      setSteps(steps => steps.map((s: Step) => ({
        ...s,
        status: "completed"
      })));
    }
    console.log('Updated files:', files);
  }, [steps]);

  useEffect(() => {
    const createMountStructure = (files: FileItem[]): FileSystemTree => {
      const mountStructure: FileSystemTree = {};

      const processFile = (file: FileItem, isRootFolder: boolean) => {  
        if (file.type === 'folder') {
          mountStructure[file.name] = {
            directory: file.children ? 
              Object.fromEntries(
                file.children.map(child => [child.name, processFile(child, false)])
              ) 
              : {}
          };
        } else if (file.type === 'file') {
          if (isRootFolder) {
            mountStructure[file.name] = {
              file: {
                contents: file.content || ''
              }
            };
          } else {
            return {
              file: {
                contents: file.content || ''
              }
            };
          }
        }
        return mountStructure[file.name];
      };

      files.forEach(file => processFile(file, true));
      return mountStructure;
    };

    if (webcontainer && files.length > 0) {
      const mountStructure = createMountStructure(files);
      console.log('Mounting WebContainer structure:', mountStructure);
      webcontainer.mount(mountStructure as FileSystemTree).catch(error => {
        console.error('Failed to mount WebContainer:', error);
      });
    }
  }, [files, webcontainer]);

  async function init() {
    if (templateSet) return;
    setLoading(true);
    setErrorMessage(null);
    try {
      console.log('Sending /template request to', BACKEND_URL, 'with prompt:', prompt);
      const response = await axios.post(`${BACKEND_URL}/template`, {
        prompt: prompt.trim()
      }, {
        timeout: 10000
      });
      console.log('Template response:', response.data);
      setTemplateSet(true);
      
      const { prompts, uiPrompts } = response.data;
      setSteps(parseXml(uiPrompts[0]).map((x: Step) => ({
        ...x,
        status: "pending"
      })));

      console.log('Sending /chat request with prompts:', prompts);
      const stepsResponse = await axios.post(`${BACKEND_URL}/chat`, {
        messages: [...prompts, prompt].map(content => ({
          role: "user",
          content
        }))
      }, {
        timeout: 10000
      });
      console.log('Chat response:', stepsResponse.data);

      setSteps(s => [...s, ...parseXml(stepsResponse.data.response).map(x => ({
        ...x,
        status: "pending" as const
      }))]);

      setLlmMessages([...prompts, prompt].map(content => ({
        role: "user",
        content
      })));
      setLlmMessages(x => [...x, { role: "assistant", content: stepsResponse.data.response }]);
    } catch (error) {
      console.error('Init error:', error);
      if (axios.isAxiosError(error)) {
        const errorMsg = error.response?.data?.message || 'Unknown server error';
        console.error('Axios error details:', JSON.stringify({
          message: error.message,
          code: error.code,
          responseData: error.response?.data,
          status: error.response?.status,
          requestUrl: error.config?.url
        }, null, 2));
        setErrorMessage(`Error: ${errorMsg}`);
      } else {
        console.error('Non-Axios error:', error);
        setErrorMessage('Unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    init();
  }, [prompt]);

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      <header className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <h1 className="text-xl font-semibold text-gray-100">Website Builder</h1>
        <p className="text-sm text-gray-400 mt-1">Prompt: {prompt}</p>
      </header>
      
      <div className="flex-1 overflow-hidden">
        {errorMessage && (
          <div className="bg-red-600 text-white p-4 m-4 rounded">
            {errorMessage}
          </div>
        )}
        <div className="h-full grid grid-cols-4 gap-6 p-6">
          <div className="col-span-1 space-y-6 overflow-auto">
            <div>
              <div className="max-h-[75vh] overflow-scroll">
                <StepsList
                  steps={steps}
                  currentStep={currentStep}
                  onStepClick={setCurrentStep}
                />
              </div>
              <div>
                <div className='flex'>
                  <br />
                  {(loading || !templateSet) && <Loader />}
                  {!(loading || !templateSet) && (
                    <div className='flex'>
                      <textarea 
                        value={userPrompt} 
                        onChange={(e) => setPrompt(e.target.value)} 
                        className='p-2 w-full'
                      />
                      <button 
                        onClick={async () => {
                          const newMessage = {
                            role: "user" as const,
                            content: userPrompt
                          };
                          setLoading(true);
                          setErrorMessage(null);
                          try {
                            console.log('Sending /chat request to', BACKEND_URL, 'with messages:', [...llmMessages, newMessage]);
                            const stepsResponse = await axios.post(`${BACKEND_URL}/chat`, {
                              messages: [...llmMessages, newMessage]
                            }, {
                              timeout: 10000
                            });
                            console.log('Chat response:', stepsResponse.data);
                            setLlmMessages(x => [...x, newMessage, {
                              role: "assistant",
                              content: stepsResponse.data.response
                            }]);
                            setSteps(s => [...s, ...parseXml(stepsResponse.data.response).map(x => ({
                              ...x,
                              status: "pending" as const
                            }))]);
                          } catch (error) {
                            console.error('Chat error:', error);
                            if (axios.isAxiosError(error)) {
                              const errorMsg = error.response?.data?.message || 'Unknown server error';
                              console.error('Axios error details:', JSON.stringify({
                                message: error.message,
                                code: error.code,
                                responseData: error.response?.data,
                                status: error.response?.status,
                                requestUrl: error.config?.url
                              }, null, 2));
                              setErrorMessage(`Error: ${errorMsg}`);
                            } else {
                              console.error('Non-Axios error:', error);
                              setErrorMessage('Unexpected error occurred');
                            }
                          } finally {
                            setLoading(false);
                          }
                        }} 
                        className='bg-purple-400 px-4'
                      >
                        Send
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="col-span-1">
            <FileExplorer 
              files={files} 
              onFileSelect={setSelectedFile}
            />
          </div>
          <div className="col-span-2 bg-gray-900 rounded-lg shadow-lg p-4 h-[calc(100vh-8rem)]">
            <TabView activeTab={activeTab} onTabChange={setActiveTab} />
            <div className="h-[calc(100%-4rem)]">
              {activeTab === 'code' ? (
                <CodeEditor file={selectedFile} />
              ) : webcontainer ? (
                <PreviewFrame webContainer={webcontainer} />
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}