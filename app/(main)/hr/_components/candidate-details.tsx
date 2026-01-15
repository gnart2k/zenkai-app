import { ArrowLeft, Mail, Phone, Linkedin, MapPin, Calendar, Download, FileText, Video, Brain, TrendingUp, CheckCircle2, XCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Job } from "../jobs/_components/job-list";

export interface Candidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  linkedin?: string;
  appliedDate: string;
  stage: string;
  aiScore: number | null;
  resumeUrl?: string;
  experience: string;
  currentRole: string;
  currentCompany: string;
}

interface CandidateDetailsProps {
  candidate: Candidate;
  job: Job | null;
  onBack: () => void;
}

export function CandidateDetails({ candidate, job, onBack }: CandidateDetailsProps) {
  // Mock AI Interview Data
  const aiInterviewData = {
    completedDate: "2026-01-14",
    duration: "42 minutes",
    overallScore: candidate.aiScore || 0,
    skillScores: [
      { skill: "Technical Knowledge", score: 88, feedback: "Strong understanding of React, TypeScript, and modern frontend patterns" },
      { skill: "Problem Solving", score: 85, feedback: "Demonstrated excellent analytical thinking and systematic approach" },
      { skill: "Communication", score: 75, feedback: "Clear explanations, could improve on conciseness" },
      { skill: "Experience Relevance", score: 90, feedback: "Highly relevant background with similar tech stack" },
    ],
    transcript: [
      {
        question: "Tell me about your experience with React and modern frontend frameworks",
        answer: "I've been working with React for the past 5 years, starting with class components and transitioning to hooks. I've built several large-scale applications using React, TypeScript, and Next.js. In my current role, I lead a team of 4 frontend engineers working on a SaaS platform that serves over 100,000 users.",
        score: 90,
      },
      {
        question: "Describe a challenging project you've worked on and how you overcame obstacles",
        answer: "One of the most challenging projects was rebuilding our company's design system from scratch. We had legacy code spanning 5 years with inconsistent patterns. I led the initiative to create a new component library using TypeScript and Storybook, which reduced our bundle size by 40% and improved developer velocity significantly.",
        score: 92,
      },
      {
        question: "How do you approach code reviews and collaboration with team members?",
        answer: "I believe code reviews are essential for knowledge sharing and maintaining quality. I focus on being constructive and educational, not just pointing out issues. I also encourage team discussions for complex architectural decisions and maintain detailed documentation.",
        score: 78,
      },
      {
        question: "What's your experience with TypeScript and type-safe development?",
        answer: "I've been using TypeScript exclusively for the past 3 years. I'm comfortable with advanced types, generics, and setting up strict type checking. I find it invaluable for catching errors early and improving code maintainability.",
        score: 85,
      },
    ],
  };

  const timeline = [
    { event: "Application Submitted", date: "2026-01-12", status: "completed" },
    { event: "Resume Screened", date: "2026-01-13", status: "completed" },
    { event: "AI Interview Completed", date: "2026-01-14", status: "completed" },
    { event: "Technical Review", date: "2026-01-15", status: "current" },
    { event: "Final Interview", date: "Pending", status: "pending" },
  ];

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('');
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return "text-green-600";
    if (score >= 70) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 85) return "bg-green-500/10";
    if (score >= 70) return "bg-yellow-500/10";
    return "bg-red-500/10";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <Button variant="outline" size="icon" onClick={onBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-start gap-4">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="text-lg">
                {getInitials(candidate.name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-3xl tracking-tight">{candidate.name}</h2>
              <p className="text-muted-foreground mt-1">
                {candidate.currentRole} at {candidate.currentCompany}
              </p>
              <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {candidate.location}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Applied {new Date(candidate.appliedDate).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Download Resume
          </Button>
          <Button variant="outline">
            <Mail className="mr-2 h-4 w-4" />
            Contact
          </Button>
        </div>
      </div>

      {/* Quick Info */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid gap-4 md:grid-cols-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                {candidate.email}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Phone</p>
              <p className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                {candidate.phone}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">LinkedIn</p>
              <p className="flex items-center gap-2">
                <Linkedin className="h-4 w-4" />
                <a href={candidate.linkedin || "#"} className="text-blue-600 hover:underline">
                  View Profile
                </a>
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Experience</p>
              <p>{candidate.experience}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Score Overview */}
      {candidate.aiScore !== null && (
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm">AI Interview Score</CardTitle>
              <Brain className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl ${getScoreColor(aiInterviewData.overallScore)}`}>
                {aiInterviewData.overallScore}%
              </div>
              <Progress value={aiInterviewData.overallScore} className="mt-2" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm">Interview Duration</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl">{aiInterviewData.duration}</div>
              <p className="text-xs text-muted-foreground">
                Completed on {new Date(aiInterviewData.completedDate).toLocaleDateString()}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm">Top Skill</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl">
                {Math.max(...aiInterviewData.skillScores.map(s => s.score))}%
              </div>
              <p className="text-xs text-muted-foreground">
                {aiInterviewData.skillScores.sort((a, b) => b.score - a.score)[0].skill}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm">Current Stage</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-lg">{candidate.stage}</div>
              <Badge variant="outline" className="mt-2 bg-blue-500/10 text-blue-700">
                In Progress
              </Badge>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Content Tabs */}
      <Tabs defaultValue="interview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="interview">AI Interview Results</TabsTrigger>
          <TabsTrigger value="profile">Profile & Resume</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="notes">Notes & Feedback</TabsTrigger>
        </TabsList>

        <TabsContent value="interview" className="space-y-4">
          {/* Skill Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Skill Assessment</CardTitle>
              <CardDescription>
                AI-evaluated competencies based on interview responses
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {aiInterviewData.skillScores.map((skill, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span>{skill.skill}</span>
                    <Badge variant="outline" className={getScoreBgColor(skill.score)}>
                      <span className={getScoreColor(skill.score)}>{skill.score}%</span>
                    </Badge>
                  </div>
                  <Progress value={skill.score} />
                  <p className="text-sm text-muted-foreground">{skill.feedback}</p>
                  {index < aiInterviewData.skillScores.length - 1 && <Separator className="mt-4" />}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Interview Transcript */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Interview Transcript</CardTitle>
                  <CardDescription>
                    Questions asked and candidate responses with AI scoring
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  <Video className="mr-2 h-4 w-4" />
                  Watch Recording
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {aiInterviewData.transcript.map((item, index) => (
                <div key={index} className="space-y-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-start gap-2">
                        <Badge variant="outline" className="mt-1">Q{index + 1}</Badge>
                        <p className="text-sm font-medium">{item.question}</p>
                      </div>
                      <div className="pl-12">
                        <p className="text-sm text-muted-foreground italic">
                          "{item.answer}"
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline" className={getScoreBgColor(item.score)}>
                      <span className={getScoreColor(item.score)}>{item.score}%</span>
                    </Badge>
                  </div>
                  {index < aiInterviewData.transcript.length - 1 && <Separator />}
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="profile" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Professional Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="text-sm mb-2">Current Position</h4>
                  <p className="text-sm text-muted-foreground">
                    {candidate.currentRole} at {candidate.currentCompany}
                  </p>
                </div>
                <Separator />
                <div>
                  <h4 className="text-sm mb-2">Total Experience</h4>
                  <p className="text-sm text-muted-foreground">{candidate.experience}</p>
                </div>
                <Separator />
                <div>
                  <h4 className="text-sm mb-2">Applied For</h4>
                  <p className="text-sm text-muted-foreground">{job?.title || "-"}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Key Skills</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {["React", "TypeScript", "Next.js", "Node.js", "GraphQL", "TailwindCSS", "Git", "Agile", "Leadership", "System Design"].map((skill) => (
                    <Badge key={skill} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Work Experience</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <h4>Senior Frontend Engineer</h4>
                    <p className="text-sm text-muted-foreground">TechCorp Inc.</p>
                  </div>
                  <p className="text-sm text-muted-foreground">2021 - Present</p>
                </div>
                <p className="text-sm text-muted-foreground">
                  Leading frontend development for a SaaS platform serving 100K+ users. Built design system, 
                  improved performance by 40%, and mentored junior developers.
                </p>
              </div>
              <Separator />
              <div className="space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <h4>Frontend Developer</h4>
                    <p className="text-sm text-muted-foreground">StartupXYZ</p>
                  </div>
                  <p className="text-sm text-muted-foreground">2019 - 2021</p>
                </div>
                <p className="text-sm text-muted-foreground">
                  Developed customer-facing web applications using React and Redux. 
                  Collaborated with design team to implement responsive UI components.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Education</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <h4>Bachelor of Science in Computer Science</h4>
                    <p className="text-sm text-muted-foreground">University of Technology</p>
                  </div>
                  <p className="text-sm text-muted-foreground">2015 - 2019</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timeline" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Application Timeline</CardTitle>
              <CardDescription>
                Track the candidate's progress through the hiring pipeline
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {timeline.map((item, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                        item.status === "completed" ? "bg-green-500/10 text-green-600" :
                        item.status === "current" ? "bg-blue-500/10 text-blue-600" :
                        "bg-gray-500/10 text-gray-400"
                      }`}>
                        {item.status === "completed" ? (
                          <CheckCircle2 className="h-4 w-4" />
                        ) : item.status === "current" ? (
                          <Clock className="h-4 w-4" />
                        ) : (
                          <XCircle className="h-4 w-4" />
                        )}
                      </div>
                      {index < timeline.length - 1 && (
                        <div className={`w-0.5 h-12 ${
                          item.status === "completed" ? "bg-green-500/20" : "bg-gray-200"
                        }`} />
                      )}
                    </div>
                    <div className="flex-1 pb-8">
                      <div className="flex items-center justify-between">
                        <h4>{item.event}</h4>
                        <p className="text-sm text-muted-foreground">{item.date}</p>
                      </div>
                      {item.status === "current" && (
                        <Badge variant="outline" className="mt-2 bg-blue-500/10 text-blue-700">
                          Current Stage
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Update Candidate Stage</CardTitle>
              <CardDescription>Move candidate to the next stage in the pipeline</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Select Stage</Label>
                <Select defaultValue={candidate.stage}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Applied">Applied</SelectItem>
                    <SelectItem value="Resume Screened">Resume Screened</SelectItem>
                    <SelectItem value="AI Interview Scheduled">AI Interview Scheduled</SelectItem>
                    <SelectItem value="AI Interview Completed">AI Interview Completed</SelectItem>
                    <SelectItem value="Technical Review">Technical Review</SelectItem>
                    <SelectItem value="Final Interview">Final Interview</SelectItem>
                    <SelectItem value="Offer Extended">Offer Extended</SelectItem>
                    <SelectItem value="Hired">Hired</SelectItem>
                    <SelectItem value="Rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button className="w-full">Update Stage</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Add Note</CardTitle>
              <CardDescription>
                Add internal notes and feedback about this candidate
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="note">Note</Label>
                <Textarea
                  id="note"
                  placeholder="Add your observations, feedback, or notes here..."
                  rows={4}
                />
              </div>
              <Button>Save Note</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Previous Notes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 p-4 border rounded-lg">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm">John Doe (Hiring Manager)</p>
                    <p className="text-xs text-muted-foreground">January 14, 2026 at 2:30 PM</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Strong technical performance in AI interview. Shows excellent understanding of React 
                  and frontend architecture. Recommend moving to technical review stage.
                </p>
              </div>
              <div className="space-y-2 p-4 border rounded-lg">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm">AI System</p>
                    <p className="text-xs text-muted-foreground">January 14, 2026 at 10:15 AM</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Candidate completed AI interview with an overall score of 85%. 
                  Demonstrated strong technical knowledge and relevant experience.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Action Footer */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <Button variant="outline">Schedule Interview</Button>
              <Button variant="outline">Send Email</Button>
              <Button variant="outline">Request References</Button>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="text-red-600 hover:text-red-700">
                Reject
              </Button>
              <Button>Move to Next Stage</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
