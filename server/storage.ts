import { projects, chatMessages, type Project, type InsertProject, type ChatMessage, type InsertChatMessage } from "@shared/schema";

export interface IStorage {
  // Projects
  createProject(project: InsertProject): Promise<Project>;
  getProject(id: number): Promise<Project | undefined>;
  getAllProjects(): Promise<Project[]>;
  updateProject(id: number, updates: Partial<InsertProject>): Promise<Project | undefined>;
  deleteProject(id: number): Promise<boolean>;
  
  // Chat Messages
  createChatMessage(message: InsertChatMessage): Promise<ChatMessage>;
  getChatMessages(projectId: number): Promise<ChatMessage[]>;
  deleteChatMessages(projectId: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private projects: Map<number, Project>;
  private chatMessages: Map<number, ChatMessage>;
  private currentProjectId: number;
  private currentMessageId: number;

  constructor() {
    this.projects = new Map();
    this.chatMessages = new Map();
    this.currentProjectId = 1;
    this.currentMessageId = 1;
  }

  // Projects
  async createProject(insertProject: InsertProject): Promise<Project> {
    const id = this.currentProjectId++;
    const now = new Date();
    const project: Project = { 
      ...insertProject, 
      id, 
      createdAt: now,
      updatedAt: now
    };
    this.projects.set(id, project);
    return project;
  }

  async getProject(id: number): Promise<Project | undefined> {
    return this.projects.get(id);
  }

  async getAllProjects(): Promise<Project[]> {
    return Array.from(this.projects.values());
  }

  async updateProject(id: number, updates: Partial<InsertProject>): Promise<Project | undefined> {
    const project = this.projects.get(id);
    if (!project) return undefined;
    
    const updatedProject: Project = {
      ...project,
      ...updates,
      updatedAt: new Date()
    };
    this.projects.set(id, updatedProject);
    return updatedProject;
  }

  async deleteProject(id: number): Promise<boolean> {
    const deleted = this.projects.delete(id);
    if (deleted) {
      // Also delete associated chat messages
      await this.deleteChatMessages(id);
    }
    return deleted;
  }

  // Chat Messages
  async createChatMessage(insertMessage: InsertChatMessage): Promise<ChatMessage> {
    const id = this.currentMessageId++;
    const message: ChatMessage = {
      ...insertMessage,
      id,
      createdAt: new Date()
    };
    this.chatMessages.set(id, message);
    return message;
  }

  async getChatMessages(projectId: number): Promise<ChatMessage[]> {
    return Array.from(this.chatMessages.values())
      .filter(msg => msg.projectId === projectId)
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  }

  async deleteChatMessages(projectId: number): Promise<boolean> {
    const messagesToDelete = Array.from(this.chatMessages.entries())
      .filter(([_, msg]) => msg.projectId === projectId);
    
    messagesToDelete.forEach(([id]) => {
      this.chatMessages.delete(id);
    });
    
    return true;
  }
}

export const storage = new MemStorage();
