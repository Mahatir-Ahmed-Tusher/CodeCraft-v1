import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Loader2 } from "lucide-react";
import type { Project } from "@shared/schema";

interface ProjectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  files: Record<string, string>;
  onProjectSaved: (project: Project) => void;
}

export function ProjectModal({ 
  open, 
  onOpenChange, 
  files, 
  onProjectSaved 
}: ProjectModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const { toast } = useToast();

  const saveProjectMutation = useMutation({
    mutationFn: async () => {
      if (!name.trim()) {
        throw new Error("Project name is required");
      }

      // Determine project type based on files
      const hasReactFiles = Object.keys(files).some(path => 
        path.includes('.tsx') || path.includes('.jsx') || path.includes('package.json')
      );
      const projectType = hasReactFiles ? 'react' : 'node';

      const response = await apiRequest("POST", "/api/projects", {
        name: name.trim(),
        description: description.trim() || null,
        files,
        projectType
      });

      return await response.json();
    },
    onSuccess: (project: Project) => {
      toast({
        title: "Success",
        description: "Project saved successfully!",
      });
      
      // Invalidate projects query to refresh the list
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      
      onProjectSaved(project);
      
      // Reset form
      setName("");
      setDescription("");
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to save project",
        variant: "destructive",
      });
    },
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    saveProjectMutation.mutate();
  };

  const handleClose = () => {
    if (!saveProjectMutation.isPending) {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Save Project</DialogTitle>
          <DialogDescription>
            Save your generated application with a name and description.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSave} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Project Name *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="My Awesome App"
              required
              disabled={saveProjectMutation.isPending}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="A brief description of your project..."
              rows={3}
              disabled={saveProjectMutation.isPending}
            />
          </div>

          <div className="text-sm text-muted-foreground">
            {Object.keys(files).length} files will be saved
          </div>

          <DialogFooter className="flex space-x-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleClose}
              disabled={saveProjectMutation.isPending}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={saveProjectMutation.isPending || !name.trim()}
            >
              {saveProjectMutation.isPending && (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              )}
              Save Project
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
