import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import type { Job } from "./job-list";

interface JobFormProps {
  isOpen: boolean;
  onClose: () => void;
  job?: Job | null;
  mode: "create" | "edit";
}

export function JobForm({ isOpen, onClose, job, mode }: JobFormProps) {
  const [formData, setFormData] = useState({
    title: job?.title || "",
    department: job?.department || "",
    location: job?.location || "",
    type: job?.type || "Full-time",
    status: job?.status || "draft",
    description: "",
    requirements: "",
    aiInterviewEnabled: job?.aiInterviewEnabled || true,
    aiInterviewQuestions: [] as string[],
    salary: "",
    experience: "",
  });

  const [currentQuestion, setCurrentQuestion] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log("Form submitted:", formData);
    onClose();
  };

  const addQuestion = () => {
    if (currentQuestion.trim()) {
      setFormData({
        ...formData,
        aiInterviewQuestions: [...formData.aiInterviewQuestions, currentQuestion.trim()],
      });
      setCurrentQuestion("");
    }
  };

  const removeQuestion = (index: number) => {
    setFormData({
      ...formData,
      aiInterviewQuestions: formData.aiInterviewQuestions.filter((_, i) => i !== index),
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Create New Job" : "Edit Job"}
          </DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Add a new job position with AI interview capabilities"
              : "Update job position details"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-sm">Basic Information</h3>
            
            <div className="space-y-2">
              <Label htmlFor="title">Job Title *</Label>
              <Input
                id="title"
                placeholder="e.g., Senior Frontend Developer"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="department">Department *</Label>
                <Select
                  value={formData.department}
                  onValueChange={(value) => setFormData({ ...formData, department: value })}
                >
                  <SelectTrigger id="department">
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Engineering">Engineering</SelectItem>
                    <SelectItem value="Product">Product</SelectItem>
                    <SelectItem value="Design">Design</SelectItem>
                    <SelectItem value="Marketing">Marketing</SelectItem>
                    <SelectItem value="Sales">Sales</SelectItem>
                    <SelectItem value="Operations">Operations</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location *</Label>
                <Input
                  id="location"
                  placeholder="e.g., Remote or New York, NY"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Employment Type *</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => setFormData({ ...formData, type: value })}
                >
                  <SelectTrigger id="type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Full-time">Full-time</SelectItem>
                    <SelectItem value="Part-time">Part-time</SelectItem>
                    <SelectItem value="Contract">Contract</SelectItem>
                    <SelectItem value="Internship">Internship</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData({ ...formData, status: value as Job["status"] })}
                >
                  <SelectTrigger id="status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="paused">Paused</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="experience">Experience Level</Label>
                <Select
                  value={formData.experience}
                  onValueChange={(value) => setFormData({ ...formData, experience: value })}
                >
                  <SelectTrigger id="experience">
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="entry">Entry Level (0-2 years)</SelectItem>
                    <SelectItem value="mid">Mid Level (3-5 years)</SelectItem>
                    <SelectItem value="senior">Senior (5-8 years)</SelectItem>
                    <SelectItem value="lead">Lead (8+ years)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="salary">Salary Range</Label>
                <Input
                  id="salary"
                  placeholder="e.g., $80,000 - $120,000"
                  value={formData.salary}
                  onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Job Description</Label>
              <Textarea
                id="description"
                placeholder="Describe the role, responsibilities, and what makes this position unique..."
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="requirements">Requirements</Label>
              <Textarea
                id="requirements"
                placeholder="List required skills, qualifications, and experience..."
                rows={4}
                value={formData.requirements}
                onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
              />
            </div>
          </div>

          {/* AI Interview Settings */}
          <div className="space-y-4 pt-4 border-t">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <h3 className="text-sm">AI Interview Settings</h3>
                <p className="text-sm text-muted-foreground">
                  Configure automated interview parameters
                </p>
              </div>
              <Switch
                checked={formData.aiInterviewEnabled}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, aiInterviewEnabled: checked })
                }
              />
            </div>

            {formData.aiInterviewEnabled && (
              <div className="space-y-4 pl-4 border-l-2">
                <div className="space-y-2">
                  <Label>AI Interview Questions</Label>
                  <p className="text-sm text-muted-foreground">
                    Add custom questions for the AI interviewer to ask candidates
                  </p>
                  
                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter a question..."
                      value={currentQuestion}
                      onChange={(e) => setCurrentQuestion(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addQuestion();
                        }
                      }}
                    />
                    <Button type="button" onClick={addQuestion}>
                      Add
                    </Button>
                  </div>

                  {formData.aiInterviewQuestions.length > 0 && (
                    <div className="space-y-2 mt-3">
                      {formData.aiInterviewQuestions.map((question, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="flex items-center justify-between gap-2 py-2 px-3"
                        >
                          <span className="flex-1 text-left">{question}</span>
                          <button
                            type="button"
                            onClick={() => removeQuestion(index)}
                            className="hover:text-destructive"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {mode === "create" ? "Create Job" : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
