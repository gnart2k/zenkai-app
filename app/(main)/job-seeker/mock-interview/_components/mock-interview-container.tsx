"use client";
import { useState } from "react";
import { Upload, Play, FileText, Brain, CheckCircle2, Clock } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function MockInterviewContainer() {
  const [jdUploaded, setJdUploaded] = useState(false);
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [jdText, setJdText] = useState("");

  // Mock previous interviews
  const previousInterviews = [
    {
      id: "1",
      position: "Senior Frontend Developer",
      date: "2026-01-12",
      score: 85,
      duration: "42 minutes",
      status: "completed",
    },
    {
      id: "2",
      position: "Full Stack Engineer",
      date: "2026-01-08",
      score: 78,
      duration: "38 minutes",
      status: "completed",
    },
    {
      id: "3",
      position: "React Developer",
      date: "2026-01-05",
      score: 92,
      duration: "45 minutes",
      status: "completed",
    },
  ];

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setJdUploaded(true);
      // Mock reading file content
      setJdText("Senior Frontend Developer\n\nWe are seeking an experienced frontend developer...");
    }
  };

  const handleStartInterview = () => {
    setInterviewStarted(true);
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return "text-green-600";
    if (score >= 70) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl tracking-tight">Mock Interview</h2>
        <p className="text-muted-foreground">
          Practice with AI-powered interviews to prepare for real opportunities
        </p>
      </div>

      <Tabs defaultValue="new" className="space-y-4">
        <TabsList>
          <TabsTrigger value="new">New Mock Interview</TabsTrigger>
          <TabsTrigger value="history">Previous Interviews</TabsTrigger>
        </TabsList>

        <TabsContent value="new" className="space-y-6">
          {!interviewStarted ? (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Upload Job Description</CardTitle>
                  <CardDescription>
                    Upload or paste a job description to generate tailored interview questions
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Upload JD */}
                  <div className="border-2 border-dashed rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer">
                    <Label htmlFor="jd-upload" className="cursor-pointer">
                      <div className="flex flex-col items-center gap-4">
                        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary">
                          <Upload className="h-8 w-8" />
                        </div>
                        <div>
                          <p className="text-lg font-medium">Upload Job Description</p>
                          <p className="text-sm text-muted-foreground mt-1">
                            PDF, DOCX, or TXT (MAX. 5MB)
                          </p>
                        </div>
                        <Input
                          id="jd-upload"
                          type="file"
                          accept=".pdf,.docx,.doc,.txt"
                          className="hidden"
                          onChange={handleFileUpload}
                        />
                      </div>
                    </Label>
                  </div>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-2 text-muted-foreground">
                        Or paste text
                      </span>
                    </div>
                  </div>

                  {/* Paste JD */}
                  <div className="space-y-2">
                    <Label htmlFor="jd-text">Job Description Text</Label>
                    <Textarea
                      id="jd-text"
                      placeholder="Paste the job description here..."
                      rows={8}
                      value={jdText}
                      onChange={(e) => {
                        setJdText(e.target.value);
                        setJdUploaded(e.target.value.length > 0);
                      }}
                    />
                  </div>
                </CardContent>
              </Card>

              {jdUploaded && (
                <Card>
                  <CardHeader>
                    <CardTitle>Interview Settings</CardTitle>
                    <CardDescription>
                      Configure your mock interview preferences
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="difficulty">Difficulty Level</Label>
                        <select
                          id="difficulty"
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                          <option value="junior">Junior (0-2 years)</option>
                          <option value="mid">Mid-Level (3-5 years)</option>
                          <option value="senior">Senior (5+ years)</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="duration">Interview Duration</Label>
                        <select
                          id="duration"
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                          <option value="30">30 minutes</option>
                          <option value="45">45 minutes</option>
                          <option value="60">60 minutes</option>
                        </select>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-3">
                      <Label>Interview Topics</Label>
                      <div className="grid gap-2 md:grid-cols-2">
                        {["Technical Skills", "Problem Solving", "System Design", "Behavioral", "Leadership", "Communication"].map((topic) => (
                          <div key={topic} className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              id={topic}
                              defaultChecked
                              className="h-4 w-4 rounded border-gray-300"
                            />
                            <label htmlFor={topic} className="text-sm">
                              {topic}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <Separator />

                    <Button className="w-full" size="lg" onClick={handleStartInterview}>
                      <Play className="mr-2 h-4 w-4" />
                      Start Mock Interview
                    </Button>
                  </CardContent>
                </Card>
              )}
            </>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Interview in Progress</CardTitle>
                <CardDescription>
                  The AI interviewer is ready. Answer questions naturally as if in a real interview.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Video/Audio Interface Placeholder */}
                <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center">
                  <div className="text-center text-white space-y-4">
                    <div className="flex items-center justify-center w-24 h-24 rounded-full bg-primary/20 mx-auto">
                      <Brain className="h-12 w-12" />
                    </div>
                    <div>
                      <p className="text-xl font-medium">AI Interviewer</p>
                      <p className="text-sm text-gray-400">Listening...</p>
                    </div>
                  </div>
                </div>

                {/* Current Question */}
                <Card className="bg-primary/5 border-primary/20">
                  <CardContent className="pt-6">
                    <div className="flex gap-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/20 text-primary">
                        Q1
                      </div>
                      <div className="flex-1">
                        <p className="font-medium mb-2">Current Question:</p>
                        <p className="text-muted-foreground">
                          Can you tell me about your experience with React and modern frontend development?
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Interview Progress */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Progress</span>
                    <span>Question 1 of 8</span>
                  </div>
                  <Progress value={12.5} />
                </div>

                {/* Controls */}
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1">
                    Skip Question
                  </Button>
                  <Button variant="outline" className="flex-1">
                    Pause Interview
                  </Button>
                  <Button variant="destructive" className="flex-1" onClick={() => setInterviewStarted(false)}>
                    End Interview
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Previous Mock Interviews</CardTitle>
              <CardDescription>
                Review your past interview performances and track improvement
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {previousInterviews.map((interview) => (
                <div
                  key={interview.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 cursor-pointer transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 text-primary">
                      <FileText className="h-6 w-6" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-medium">{interview.position}</h4>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>{interview.duration}</span>
                        <span>•</span>
                        <span>{new Date(interview.date).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Score</p>
                      <p className={`text-xl font-semibold ${getScoreColor(interview.score)}`}>
                        {interview.score}%
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </div>
                </div>
              ))}

              {previousInterviews.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  <Brain className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No previous interviews yet</p>
                  <p className="text-sm">Start your first mock interview to practice!</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Performance Overview */}
          {previousInterviews.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Performance Overview</CardTitle>
                <CardDescription>
                  Your improvement over time
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-3">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Average Score</p>
                    <p className="text-2xl font-semibold">
                      {Math.round(previousInterviews.reduce((acc, i) => acc + i.score, 0) / previousInterviews.length)}%
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Total Interviews</p>
                    <p className="text-2xl font-semibold">{previousInterviews.length}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Improvement</p>
                    <p className="text-2xl font-semibold text-green-600">+14%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
