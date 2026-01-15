import { ArrowLeft, Calendar, MapPin, Briefcase, DollarSign, Users, CheckCircle2, Clock, TrendingUp, Bot } from "lucide-react";
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
import type { Job } from "./job-list";
import type { Candidate } from "../../_components/candidate-details";

interface JobDetailsProps {
  job: Job;
  onBack: () => void;
  onEdit: () => void;
  onViewCandidate: (candidate: Candidate) => void;
}

export function JobDetails({ job, onBack, onEdit, onViewCandidate }: JobDetailsProps) {
  const getStatusColor = (status: Job["status"]) => {
    switch (status) {
      case "active":
        return "bg-green-500/10 text-green-700";
      case "paused":
        return "bg-yellow-500/10 text-yellow-700";
      case "closed":
        return "bg-gray-500/10 text-gray-700";
      case "draft":
        return "bg-blue-500/10 text-blue-700";
      default:
        return "";
    }
  };

  const interviewCompletionRate = job.interviewsScheduled + job.interviewsCompleted > 0
    ? (job.interviewsCompleted / (job.interviewsScheduled + job.interviewsCompleted)) * 100
    : 0;

  // Mock data for demonstration
  const mockInterviewQuestions = [
    "Tell me about your experience with React and modern frontend frameworks",
    "Describe a challenging project you've worked on and how you overcame obstacles",
    "How do you approach code reviews and collaboration with team members?",
    "What's your experience with TypeScript and type-safe development?",
  ];

  const mockRecentCandidates: Candidate[] = [
    { 
      id: "1",
      name: "Sarah Johnson", 
      email: "sarah.johnson@email.com",
      phone: "+1 (555) 123-4567",
      location: "San Francisco, CA",
      linkedin: "https://linkedin.com/in/sarahjohnson",
      appliedDate: "2026-01-12",
      stage: "AI Interview Completed", 
      aiScore: 85,
      experience: "5 years",
      currentRole: "Frontend Developer",
      currentCompany: "TechCorp Inc.",
    },
    { 
      id: "2",
      name: "Michael Chen", 
      email: "michael.chen@email.com",
      phone: "+1 (555) 234-5678",
      location: "New York, NY",
      linkedin: "https://linkedin.com/in/michaelchen",
      appliedDate: "2026-01-13",
      stage: "AI Interview Scheduled", 
      aiScore: null,
      experience: "6 years",
      currentRole: "Senior Frontend Engineer",
      currentCompany: "StartupXYZ",
    },
    { 
      id: "3",
      name: "Emily Rodriguez", 
      email: "emily.rodriguez@email.com",
      phone: "+1 (555) 345-6789",
      location: "Austin, TX",
      linkedin: "https://linkedin.com/in/emilyrodriguez",
      appliedDate: "2026-01-11",
      stage: "AI Interview Completed", 
      aiScore: 92,
      experience: "7 years",
      currentRole: "Lead Frontend Developer",
      currentCompany: "Digital Agency Co.",
    },
    { 
      id: "4",
      name: "David Kim", 
      email: "david.kim@email.com",
      phone: "+1 (555) 456-7890",
      location: "Seattle, WA",
      linkedin: "https://linkedin.com/in/davidkim",
      appliedDate: "2026-01-14",
      stage: "Applied", 
      aiScore: null,
      experience: "4 years",
      currentRole: "Frontend Developer",
      currentCompany: "E-commerce Platform",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <Button variant="outline" size="icon" onClick={onBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <h2 className="text-3xl tracking-tight">{job.title}</h2>
              <Badge variant="outline" className={getStatusColor(job.status)}>
                {job.status}
              </Badge>
              {job.aiInterviewEnabled && (
                <Badge variant="outline" className="gap-1">
                  <Bot className="h-3 w-3" />
                  AI Enabled
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-4 text-muted-foreground">
              <span className="flex items-center gap-1">
                <Briefcase className="h-4 w-4" />
                {job.department}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {job.location}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                Posted {new Date(job.postedDate).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
        <Button onClick={onEdit}>Edit Job</Button>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Total Candidates</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{job.candidates}</div>
            <p className="text-xs text-muted-foreground">
              Active applicants
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Interviews Scheduled</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{job.interviewsScheduled}</div>
            <p className="text-xs text-muted-foreground">
              Upcoming AI interviews
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Completed</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{job.interviewsCompleted}</div>
            <p className="text-xs text-muted-foreground">
              Interviews finished
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Completion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{Math.round(interviewCompletionRate)}%</div>
            <Progress value={interviewCompletionRate} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="ai-settings">AI Interview Settings</TabsTrigger>
          <TabsTrigger value="candidates">Candidates</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Job Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                    <Briefcase className="h-4 w-4" />
                    Employment Type
                  </div>
                  <p>{job.type}</p>
                </div>
                <Separator />
                <div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                    <DollarSign className="h-4 w-4" />
                    Salary Range
                  </div>
                  <p>$100,000 - $150,000</p>
                </div>
                <Separator />
                <div>
                  <div className="text-sm text-muted-foreground mb-1">
                    Experience Level
                  </div>
                  <p>Senior (5-8 years)</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest candidate updates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockRecentCandidates.map((candidate, index) => (
                    <div key={index} className="flex items-start justify-between">
                      <div className="space-y-1">
                        <p className="text-sm">{candidate.name}</p>
                        <p className="text-xs text-muted-foreground">{candidate.stage}</p>
                      </div>
                      <div className="text-right">
                        {candidate.aiScore !== null && (
                          <Badge variant="secondary">{candidate.aiScore}%</Badge>
                        )}
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(candidate.appliedDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Job Description</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="mb-2">About the Role</h4>
                <p className="text-muted-foreground">
                  We are seeking an experienced Senior Frontend Developer to join our engineering team.
                  You will be responsible for building and maintaining high-quality web applications
                  using modern technologies like React, TypeScript, and Next.js.
                </p>
              </div>
              <div>
                <h4 className="mb-2">Key Responsibilities</h4>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Design and implement responsive, performant user interfaces</li>
                  <li>Collaborate with designers and backend engineers</li>
                  <li>Write clean, maintainable, and well-tested code</li>
                  <li>Mentor junior developers and participate in code reviews</li>
                </ul>
              </div>
              <div>
                <h4 className="mb-2">Requirements</h4>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>5+ years of experience with React and modern frontend development</li>
                  <li>Strong proficiency in TypeScript and JavaScript</li>
                  <li>Experience with state management (Redux, Zustand, etc.)</li>
                  <li>Excellent communication and collaboration skills</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ai-settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>AI Interview Configuration</CardTitle>
              <CardDescription>
                Customize how the AI conducts interviews for this position
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p>AI Interview Status</p>
                  <p className="text-sm text-muted-foreground">
                    Automated interviews are currently enabled
                  </p>
                </div>
                <Badge variant="outline" className="bg-green-500/10 text-green-700">
                  Enabled
                </Badge>
              </div>

              <Separator />

              <div>
                <h4 className="mb-3">Interview Questions</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  The AI interviewer will ask candidates these questions during the screening process
                </p>
                <div className="space-y-2">
                  {mockInterviewQuestions.map((question, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                      <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-sm">
                        {index + 1}
                      </div>
                      <p className="flex-1 text-sm">{question}</p>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <h4 className="text-sm">Interview Duration</h4>
                  <p className="text-muted-foreground">30-45 minutes</p>
                </div>
                <div className="space-y-2">
                  <h4 className="text-sm">Passing Score</h4>
                  <p className="text-muted-foreground">70% or higher</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="candidates" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Candidate Pipeline</CardTitle>
              <CardDescription>
                Track candidates through the interview process
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockRecentCandidates.map((candidate, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 cursor-pointer transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary">
                        {candidate.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p>{candidate.name}</p>
                        <p className="text-sm text-muted-foreground">{candidate.stage}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      {candidate.aiScore !== null && (
                        <div className="text-right">
                          <p className="text-sm">AI Score</p>
                          <Badge variant="secondary">{candidate.aiScore}%</Badge>
                        </div>
                      )}
                      <Button variant="outline" size="sm" onClick={() => onViewCandidate(candidate)}>
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Interview Analytics</CardTitle>
              <CardDescription>
                Performance metrics and insights
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Average AI Score</p>
                  <p className="text-2xl">78%</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Time to Interview</p>
                  <p className="text-2xl">3.2 days</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Interview Success Rate</p>
                  <p className="text-2xl">64%</p>
                </div>
              </div>
              <Separator />
              <div>
                <h4 className="mb-3">Top Skills Assessed</h4>
                <div className="space-y-3">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm">React & Frontend Development</span>
                      <span className="text-sm text-muted-foreground">92%</span>
                    </div>
                    <Progress value={92} />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm">Problem Solving</span>
                      <span className="text-sm text-muted-foreground">85%</span>
                    </div>
                    <Progress value={85} />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm">Communication Skills</span>
                      <span className="text-sm text-muted-foreground">78%</span>
                    </div>
                    <Progress value={78} />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm">TypeScript Proficiency</span>
                      <span className="text-sm text-muted-foreground">71%</span>
                    </div>
                    <Progress value={71} />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}