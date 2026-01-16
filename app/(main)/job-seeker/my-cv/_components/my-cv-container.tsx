"use client";

import { useState } from "react";
import { Upload, FileText, Download, Trash2, CheckCircle2, ChevronDown, Star } from "lucide-react";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface CV {
  id: string;
  name: string;
  size: string;
  uploadDate: string;
  isPrimary: boolean;
  analysis: {
    skills: string[];
    experience: string;
    education: string;
    completeness: number;
  };
}

export function MyCVContainer() {
  const [cvList, setCVList] = useState<CV[]>([
    {
      id: "1",
      name: "John_Doe_Resume_2026.pdf",
      size: "245 KB",
      uploadDate: "2026-01-15",
      isPrimary: true,
      analysis: {
        skills: ["React", "TypeScript", "Node.js", "Python", "AWS", "Docker", "GraphQL", "MongoDB"],
        experience: "5 years",
        education: "Bachelor's in Computer Science",
        completeness: 85,
      },
    },
    {
      id: "2",
      name: "John_Doe_Resume_Old.pdf",
      size: "230 KB",
      uploadDate: "2025-12-10",
      isPrimary: false,
      analysis: {
        skills: ["React", "JavaScript", "Node.js", "MongoDB"],
        experience: "4 years",
        education: "Bachelor's in Computer Science",
        completeness: 75,
      },
    },
    {
      id: "3",
      name: "John_Doe_Developer_CV.pdf",
      size: "198 KB",
      uploadDate: "2025-11-05",
      isPrimary: false,
      analysis: {
        skills: ["React", "JavaScript", "HTML", "CSS"],
        experience: "3 years",
        education: "Bachelor's in Computer Science",
        completeness: 70,
      },
    },
  ]);

  const [selectedCV, setSelectedCV] = useState<CV>(cvList.find(cv => cv.isPrimary) || cvList[0]);
  const [hoveredCVId, setHoveredCVId] = useState<string | null>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Create new CV object
      const newCV: CV = {
        id: Date.now().toString(),
        name: file.name,
        size: `${(file.size / 1024).toFixed(0)} KB`,
        uploadDate: new Date().toISOString().split('T')[0],
        isPrimary: true, // New upload becomes primary
        analysis: {
          skills: ["React", "TypeScript", "Node.js", "Python", "AWS", "Docker", "GraphQL", "MongoDB"],
          experience: "5 years",
          education: "Bachelor's in Computer Science",
          completeness: 85,
        },
      };

      // Set all other CVs to non-primary
      const updatedCVList = cvList.map(cv => ({ ...cv, isPrimary: false }));
      
      // Add new CV to the beginning of the list
      setCVList([newCV, ...updatedCVList]);
      setSelectedCV(newCV);
    }
    
    // Reset the input
    event.target.value = '';
  };

  const handleSetPrimary = (cvId: string) => {
    const updatedCVList = cvList.map(cv => ({
      ...cv,
      isPrimary: cv.id === cvId,
    }));
    setCVList(updatedCVList);
    const primary = updatedCVList.find(cv => cv.id === cvId);
    if (primary) {
      setSelectedCV(primary);
    }
  };

  const handleDelete = (cvId: string, event?: React.MouseEvent) => {
    event?.stopPropagation();
    
    const cvToDelete = cvList.find(cv => cv.id === cvId);
    const updatedCVList = cvList.filter(cv => cv.id !== cvId);
    
    // If deleting the primary CV, make the most recent one primary
    if (cvToDelete?.isPrimary && updatedCVList.length > 0) {
      updatedCVList[0].isPrimary = true;
      setSelectedCV(updatedCVList[0]);
    } else if (selectedCV.id === cvId && updatedCVList.length > 0) {
      setSelectedCV(updatedCVList[0]);
    }
    
    setCVList(updatedCVList);
  };

  const handleSelectCV = (cv: CV) => {
    setSelectedCV(cv);
  };

  const primaryCV = cvList.find(cv => cv.isPrimary);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl tracking-tight">My CV / Resume</h2>
        <p className="text-muted-foreground">
          Upload and manage your resumes for job applications
        </p>
      </div>

      {cvList.length === 0 ? (
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
          {/* Current CV with Dropdown */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <CardTitle className="mb-2">My Resumes</CardTitle>
                  <CardDescription>
                    {primaryCV ? `${primaryCV.name} is your primary resume` : 'Select a primary resume'}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                  <Label htmlFor="cv-add">
                    <Button size="sm" asChild>
                      <span>
                        <Upload className="mr-2 h-4 w-4" />
                        Upload New CV
                      </span>
                    </Button>
                    <Input
                      id="cv-add"
                      type="file"
                      accept=".pdf,.docx,.doc"
                      className="hidden"
                      onChange={handleFileUpload}
                    />
                  </Label>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* CV Selector Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="flex items-start gap-4 p-4 border rounded-lg cursor-pointer hover:bg-accent/50 transition-colors">
                    <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 text-primary">
                      <FileText className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{selectedCV.name}</h4>
                        {selectedCV.isPrimary && (
                          <Badge variant="outline" className="bg-green-500/10 text-green-700">
                            <Star className="mr-1 h-3 w-3 fill-current" />
                            Primary
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                        <span>{selectedCV.size}</span>
                        <span>•</span>
                        <span>Uploaded {new Date(selectedCV.uploadDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <ChevronDown className="h-5 w-5 text-muted-foreground" />
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[400px]">
                  <DropdownMenuLabel>
                    All Resumes ({cvList.length})
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {cvList.map((cv) => (
                    <DropdownMenuItem
                      key={cv.id}
                      className="cursor-pointer p-3 relative group"
                      onMouseEnter={() => setHoveredCVId(cv.id)}
                      onMouseLeave={() => setHoveredCVId(null)}
                      onClick={() => handleSelectCV(cv)}
                    >
                      <div className="flex items-start gap-3 flex-1">
                        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 text-primary">
                          <FileText className="h-5 w-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="font-medium truncate">{cv.name}</p>
                            {cv.isPrimary && (
                              <Badge variant="outline" className="bg-green-500/10 text-green-700 shrink-0">
                                <Star className="mr-1 h-2 w-2 fill-current" />
                                Primary
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                            <span>{cv.size}</span>
                            <span>•</span>
                            <span>{new Date(cv.uploadDate).toLocaleDateString()}</span>
                          </div>
                        </div>
                        
                        {/* Action buttons - shown on hover */}
                        {hoveredCVId === cv.id && (
                          <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                            {!cv.isPrimary && (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleSetPrimary(cv.id);
                                }}
                                title="Set as primary"
                              >
                                <Star className="h-4 w-4" />
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive hover:text-destructive"
                              onClick={(e) => handleDelete(cv.id, e)}
                              title="Delete CV"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
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
                  <span className="text-sm font-medium">{selectedCV.analysis.completeness}%</span>
                </div>
                <Progress value={selectedCV.analysis.completeness} />
                <p className="text-sm text-muted-foreground mt-2">
                  {selectedCV.analysis.completeness >= 80 
                    ? "Your resume is well-structured and comprehensive!"
                    : "Consider adding more details to improve your resume completeness."}
                </p>
              </div>

              <Separator />

              {/* Detected Skills */}
              <div>
                <Label className="mb-3 block">Detected Skills</Label>
                <div className="flex flex-wrap gap-2">
                  {selectedCV.analysis.skills.map((skill) => (
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
                  <p className="text-sm text-muted-foreground">{selectedCV.analysis.experience}</p>
                </div>
                <div>
                  <Label className="mb-2 block">Education</Label>
                  <p className="text-sm text-muted-foreground">{selectedCV.analysis.education}</p>
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
