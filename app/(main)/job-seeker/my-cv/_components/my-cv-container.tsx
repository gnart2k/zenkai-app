"use client";
import { useState } from "react";
import { Upload, FileText, Download, Trash2, CheckCircle2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";

export function MyCVContainer() {
  const [uploadedCV, setUploadedCV] = useState<{
    name: string;
    size: string;
    uploadDate: string;
    analysis: {
      skills: string[];
      experience: string;
      education: string;
      completeness: number;
    };
  } | null>({
    name: "John_Doe_Resume.pdf",
    size: "245 KB",
    uploadDate: "2026-01-15",
    analysis: {
      skills: ["React", "TypeScript", "Node.js", "Python", "AWS", "Docker", "GraphQL", "MongoDB"],
      experience: "5 years",
      education: "Bachelor's in Computer Science",
      completeness: 85,
    },
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Mock file upload
      setUploadedCV({
        name: file.name,
        size: `${(file.size / 1024).toFixed(0)} KB`,
        uploadDate: new Date().toISOString().split('T')[0],
        analysis: {
          skills: ["React", "TypeScript", "Node.js", "Python", "AWS", "Docker", "GraphQL", "MongoDB"],
          experience: "5 years",
          education: "Bachelor's in Computer Science",
          completeness: 85,
        },
      });
    }
  };

  const handleDelete = () => {
    setUploadedCV(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl tracking-tight">My CV / Resume</h2>
        <p className="text-muted-foreground">
          Upload and manage your resume for job applications
        </p>
      </div>

      {!uploadedCV ? (
        <Card>
          <CardHeader>
            <CardTitle>Upload Your Resume</CardTitle>
            <CardDescription>
              Upload your CV in PDF or DOCX format. Our AI will analyze it to match you with suitable jobs.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="border-2 border-dashed rounded-lg p-12 text-center hover:border-primary transition-colors cursor-pointer">
              <Label htmlFor="cv-upload" className="cursor-pointer">
                <div className="flex flex-col items-center gap-4">
                  <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary">
                    <Upload className="h-8 w-8" />
                  </div>
                  <div>
                    <p className="text-lg font-medium">Click to upload or drag and drop</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      PDF or DOCX (MAX. 5MB)
                    </p>
                  </div>
                  <Input
                    id="cv-upload"
                    type="file"
                    accept=".pdf,.docx,.doc"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                </div>
              </Label>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Current CV */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Current Resume</CardTitle>
                  <CardDescription>Your active resume for job applications</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                  <Label htmlFor="cv-replace">
                    <Button variant="outline" size="sm" asChild>
                      <span>
                        <Upload className="mr-2 h-4 w-4" />
                        Replace
                      </span>
                    </Button>
                    <Input
                      id="cv-replace"
                      type="file"
                      accept=".pdf,.docx,.doc"
                      className="hidden"
                      onChange={handleFileUpload}
                    />
                  </Label>
                  <Button variant="outline" size="sm" onClick={handleDelete}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-4 p-4 border rounded-lg">
                <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 text-primary">
                  <FileText className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium">{uploadedCV.name}</h4>
                  <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                    <span>{uploadedCV.size}</span>
                    <span>•</span>
                    <span>Uploaded {new Date(uploadedCV.uploadDate).toLocaleDateString()}</span>
                  </div>
                </div>
                <Badge variant="outline" className="bg-green-500/10 text-green-700">
                  <CheckCircle2 className="mr-1 h-3 w-3" />
                  Active
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* AI Analysis */}
          <Card>
            <CardHeader>
              <CardTitle>AI Resume Analysis</CardTitle>
              <CardDescription>
                Our AI has analyzed your resume to help match you with suitable positions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Completeness Score */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label>Resume Completeness</Label>
                  <span className="text-sm font-medium">{uploadedCV.analysis.completeness}%</span>
                </div>
                <Progress value={uploadedCV.analysis.completeness} />
                <p className="text-sm text-muted-foreground mt-2">
                  {uploadedCV.analysis.completeness >= 80 
                    ? "Your resume is well-structured and comprehensive!"
                    : "Consider adding more details to improve your resume completeness."}
                </p>
              </div>

              <Separator />

              {/* Detected Skills */}
              <div>
                <Label className="mb-3 block">Detected Skills</Label>
                <div className="flex flex-wrap gap-2">
                  {uploadedCV.analysis.skills.map((skill) => (
                    <Badge key={skill} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Experience & Education */}
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label className="mb-2 block">Total Experience</Label>
                  <p className="text-sm text-muted-foreground">{uploadedCV.analysis.experience}</p>
                </div>
                <div>
                  <Label className="mb-2 block">Education</Label>
                  <p className="text-sm text-muted-foreground">{uploadedCV.analysis.education}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Improvement Suggestions */}
          <Card>
            <CardHeader>
              <CardTitle>Improvement Suggestions</CardTitle>
              <CardDescription>
                Tips to make your resume stand out
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-500/10 text-blue-600 text-sm mt-0.5">
                    1
                  </div>
                  <div>
                    <p className="font-medium">Add quantifiable achievements</p>
                    <p className="text-sm text-muted-foreground">
                      Include specific metrics and numbers to demonstrate your impact
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-500/10 text-blue-600 text-sm mt-0.5">
                    2
                  </div>
                  <div>
                    <p className="font-medium">Highlight leadership experience</p>
                    <p className="text-sm text-muted-foreground">
                      Emphasize any team leadership or project management roles
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-500/10 text-blue-600 text-sm mt-0.5">
                    3
                  </div>
                  <div>
                    <p className="font-medium">Include relevant certifications</p>
                    <p className="text-sm text-muted-foreground">
                      Add any professional certifications related to your field
                    </p>
                  </div>
                </li>
              </ul>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
