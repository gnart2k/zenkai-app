"use client"
import { useState } from "react";
import { Calendar, Clock, Video, TrendingUp, CheckCircle2, FileText } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Interview {
  id: string;
  jobTitle: string;
  company: string;
  date: string;
  type: "ai" | "technical" | "behavioral" | "final";
  status: "scheduled" | "completed" | "cancelled";
  duration?: string;
  score?: number;
  feedback?: string;
}

export function InterviewHistoryContainer() {
  const [interviews] = useState<Interview[]>([
    {
      id: "1",
      jobTitle: "Senior Frontend Developer",
      company: "TechCorp Inc.",
      date: "2026-01-18",
      type: "ai",
      status: "scheduled",
    },
    {
      id: "2",
      jobTitle: "React Developer",
      company: "Digital Agency Co.",
      date: "2026-01-12",
      type: "ai",
      status: "completed",
      duration: "42 minutes",
      score: 85,
      feedback: "Strong technical knowledge and excellent communication skills. Demonstrated good understanding of React patterns and best practices.",
    },
    {
      id: "3",
      jobTitle: "Full Stack Engineer",
      company: "StartupXYZ",
      date: "2026-01-10",
      type: "technical",
      status: "completed",
      duration: "60 minutes",
      score: 78,
      feedback: "Good problem-solving approach. Could improve on system design concepts.",
    },
    {
      id: "4",
      jobTitle: "React Native Developer",
      company: "Mobile First Inc.",
      date: "2026-01-08",
      type: "ai",
      status: "completed",
      duration: "45 minutes",
      score: 92,
      feedback: "Exceptional performance. Deep understanding of mobile development and React Native ecosystem.",
    },
    {
      id: "5",
      jobTitle: "Frontend Engineer",
      company: "E-commerce Platform",
      date: "2026-01-05",
      type: "behavioral",
      status: "completed",
      duration: "30 minutes",
      score: 88,
      feedback: "Excellent communication and team collaboration examples. Strong leadership potential.",
    },
    {
      id: "6",
      jobTitle: "UI/UX Engineer",
      company: "Design Studio",
      date: "2026-01-03",
      type: "ai",
      status: "cancelled",
    },
  ]);

  const upcomingInterviews = interviews.filter((i) => i.status === "scheduled");
  const completedInterviews = interviews.filter((i) => i.status === "completed");
  const cancelledInterviews = interviews.filter((i) => i.status === "cancelled");

  const averageScore =
    completedInterviews.reduce((acc, i) => acc + (i.score || 0), 0) /
      completedInterviews.length || 0;

  const getTypeLabel = (type: Interview["type"]) => {
    switch (type) {
      case "ai":
        return "AI Interview";
      case "technical":
        return "Technical";
      case "behavioral":
        return "Behavioral";
      case "final":
        return "Final Round";
      default:
        return type;
    }
  };

  const getTypeColor = (type: Interview["type"]) => {
    switch (type) {
      case "ai":
        return "bg-purple-500/10 text-purple-700";
      case "technical":
        return "bg-blue-500/10 text-blue-700";
      case "behavioral":
        return "bg-green-500/10 text-green-700";
      case "final":
        return "bg-orange-500/10 text-orange-700";
      default:
        return "";
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return "text-green-600";
    if (score >= 70) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl tracking-tight">Interview History</h2>
        <p className="text-muted-foreground">
          Track your interview performance and upcoming sessions
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-gradient-to-t from-blue-50 to-white shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Total Interviews</CardTitle>
            <Video className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{interviews.length}</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-t from-purple-50 to-white shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Completed</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{completedInterviews.length}</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-t from-orange-50 to-white shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Average Score</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{Math.round(averageScore)}%</div>
            <Progress value={averageScore} className="mt-2" />
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-t from-green-50 to-white shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Upcoming</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{upcomingInterviews.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="upcoming" className="space-y-4">
        <TabsList>
          <TabsTrigger value="upcoming">
            Upcoming ({upcomingInterviews.length})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed ({completedInterviews.length})
          </TabsTrigger>
          <TabsTrigger value="cancelled">
            Cancelled ({cancelledInterviews.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-4">
          {upcomingInterviews.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <p className="text-muted-foreground">No upcoming interviews</p>
              </CardContent>
            </Card>
          ) : (
            upcomingInterviews.map((interview) => (
              <Card key={interview.id}>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 text-primary">
                      <Calendar className="h-6 w-6" />
                    </div>
                    <div className="flex-1 space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold">{interview.jobTitle}</h3>
                          <p className="text-sm text-muted-foreground">
                            {interview.company}
                          </p>
                        </div>
                        <Badge variant="outline" className={getTypeColor(interview.type)}>
                          {getTypeLabel(interview.type)}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(interview.date).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          10:00 AM
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <Button>Join Interview</Button>
                        <Button variant="outline">Reschedule</Button>
                        <Button variant="outline">Cancel</Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {completedInterviews.map((interview) => (
            <Card key={interview.id}>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-green-500/10 text-green-600">
                    <CheckCircle2 className="h-6 w-6" />
                  </div>
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold">{interview.jobTitle}</h3>
                        <p className="text-sm text-muted-foreground">
                          {interview.company}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className={getTypeColor(interview.type)}>
                          {getTypeLabel(interview.type)}
                        </Badge>
                        {interview.score && (
                          <Badge
                            variant="outline"
                            className={getScoreColor(interview.score)}
                          >
                            {interview.score}%
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(interview.date).toLocaleDateString()}
                      </span>
                      {interview.duration && (
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {interview.duration}
                        </span>
                      )}
                    </div>
                    {interview.score && (
                      <div className="space-y-2">
                        <Progress value={interview.score} />
                      </div>
                    )}
                    {interview.feedback && (
                      <>
                        <Separator />
                        <div className="space-y-2">
                          <p className="text-sm font-medium">Feedback</p>
                          <p className="text-sm text-muted-foreground">
                            {interview.feedback}
                          </p>
                        </div>
                      </>
                    )}
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <FileText className="mr-2 h-3 w-3" />
                        View Full Report
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="cancelled" className="space-y-4">
          {cancelledInterviews.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">No cancelled interviews</p>
              </CardContent>
            </Card>
          ) : (
            cancelledInterviews.map((interview) => (
              <Card key={interview.id}>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-red-500/10 text-red-600">
                      <Clock className="h-6 w-6" />
                    </div>
                    <div className="flex-1 space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold">{interview.jobTitle}</h3>
                          <p className="text-sm text-muted-foreground">
                            {interview.company}
                          </p>
                        </div>
                        <Badge variant="outline" className="bg-red-500/10 text-red-700">
                          Cancelled
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>Was scheduled for {new Date(interview.date).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>

      {/* Performance Insights */}
      {completedInterviews.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Performance Insights</CardTitle>
            <CardDescription>
              Your interview performance breakdown
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-sm text-muted-foreground mb-2">Best Performance</p>
                <div className="flex items-center justify-between">
                  <span>
                    {completedInterviews.sort((a, b) => (b.score || 0) - (a.score || 0))[0]
                      ?.jobTitle}
                  </span>
                  <Badge variant="secondary">
                    {completedInterviews.sort((a, b) => (b.score || 0) - (a.score || 0))[0]
                      ?.score}%
                  </Badge>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-2">Recent Trend</p>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span className="text-green-600">Improving</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
