"use client"
import { useRouter } from "next/navigation";
import { Briefcase, FileText, Clock, TrendingUp, CheckCircle2, Calendar } from "lucide-react";
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

export function JobSeekerDashboardContainer() {
  const router = useRouter();
  // Mock data
  const stats = {
    applicationsSubmitted: 12,
    interviewsScheduled: 3,
    interviewsCompleted: 5,
    avgInterviewScore: 82,
  };

  const recentApplications = [
    {
      id: "1",
      jobTitle: "Senior Frontend Developer",
      company: "TechCorp Inc.",
      status: "Interview Scheduled",
      appliedDate: "2026-01-14",
      interviewDate: "2026-01-18",
    },
    {
      id: "2",
      jobTitle: "Full Stack Engineer",
      company: "StartupXYZ",
      status: "Under Review",
      appliedDate: "2026-01-13",
    },
    {
      id: "3",
      jobTitle: "React Developer",
      company: "Digital Agency Co.",
      status: "Interview Completed",
      appliedDate: "2026-01-10",
      aiScore: 85,
    },
  ];

  const upcomingInterviews = [
    {
      id: "1",
      jobTitle: "Senior Frontend Developer",
      company: "TechCorp Inc.",
      date: "2026-01-18",
      time: "10:00 AM",
      type: "AI Interview",
    },
    {
      id: "2",
      jobTitle: "UX Engineer",
      company: "Design Studio",
      date: "2026-01-20",
      time: "2:00 PM",
      type: "Technical Interview",
    },
  ];

  const recommendedJobs = [
    {
      id: "1",
      title: "Senior Frontend Developer",
      company: "Innovation Labs",
      location: "Remote",
      type: "Full-time",
      salary: "$120k - $160k",
      match: 95,
    },
    {
      id: "2",
      title: "React Native Developer",
      company: "Mobile First Inc.",
      location: "San Francisco, CA",
      type: "Full-time",
      salary: "$110k - $150k",
      match: 88,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Interview Scheduled":
        return "bg-blue-500/10 text-blue-700";
      case "Under Review":
        return "bg-yellow-500/10 text-yellow-700";
      case "Interview Completed":
        return "bg-purple-500/10 text-purple-700";
      case "Offer Received":
        return "bg-green-500/10 text-green-700";
      default:
        return "bg-gray-500/10 text-gray-700";
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div>
        <h2 className="text-3xl font-semibold tracking-tight">Welcome back!</h2>
        <p className="text-muted-foreground">
          Track your applications and prepare for interviews
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-gradient-to-t from-blue-50 to-white shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Applications</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{stats.applicationsSubmitted}</div>
            <p className="text-xs text-muted-foreground">Total submitted</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-t from-purple-50 to-white shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Scheduled</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{stats.interviewsScheduled}</div>
            <p className="text-xs text-muted-foreground">Upcoming interviews</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-t from-green-50 to-white shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Completed</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{stats.interviewsCompleted}</div>
            <p className="text-xs text-muted-foreground">Interviews done</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-t from-orange-50 to-white shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Avg Score</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{stats.avgInterviewScore}%</div>
            <Progress value={stats.avgInterviewScore} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Applications */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Applications</CardTitle>
                <CardDescription>Your latest job applications</CardDescription>
              </div>
              <Button variant="ghost" size="sm" onClick={() => router.push('/job-seeker/my-applications')}>
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentApplications.map((app) => (
              <div key={app.id} className="flex items-start justify-between p-3 border rounded-lg hover:bg-accent/50 cursor-pointer transition-colors">
                <div className="space-y-1">
                  <p className="font-medium">{app.jobTitle}</p>
                  <p className="text-sm text-muted-foreground">{app.company}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="outline" className={getStatusColor(app.status)}>
                      {app.status}
                    </Badge>
                    {app.aiScore && (
                      <Badge variant="outline">
                        Score: {app.aiScore}%
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="text-right text-sm text-muted-foreground">
                  {new Date(app.appliedDate).toLocaleDateString()}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Upcoming Interviews */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Upcoming Interviews</CardTitle>
                <CardDescription>Your scheduled interviews</CardDescription>
              </div>
              <Button variant="ghost" size="sm" onClick={() => router.push('/job-seeker/my-applications')}>
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingInterviews.map((interview) => (
              <div key={interview.id} className="flex items-start gap-3 p-3 border rounded-lg hover:bg-accent/50 cursor-pointer transition-colors">
                <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 text-primary">
                  <Calendar className="h-6 w-6" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="font-medium">{interview.jobTitle}</p>
                  <p className="text-sm text-muted-foreground">{interview.company}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="outline">{interview.type}</Badge>
                    <span className="text-sm text-muted-foreground">
                      {new Date(interview.date).toLocaleDateString()} at {interview.time}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            {upcomingInterviews.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No upcoming interviews
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recommended Jobs */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Recommended Jobs</CardTitle>
              <CardDescription>Based on your profile and preferences</CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={() => router.push('/job-seeker/job-market')}>
              Browse All
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {recommendedJobs.map((job) => (
            <div key={job.id} className="flex items-start justify-between p-4 border rounded-lg hover:bg-accent/50 cursor-pointer transition-colors">
              <div className="flex-1 space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-medium">{job.title}</h4>
                    <p className="text-sm text-muted-foreground">{job.company}</p>
                  </div>
                  <Badge variant="outline" className="bg-green-500/10 text-green-700">
                    {job.match}% Match
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>{job.location}</span>
                  <span>•</span>
                  <span>{job.type}</span>
                  <span>•</span>
                  <span>{job.salary}</span>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => router.push('/job-seeker/my-cv')}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Update CV
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Keep your resume up to date to increase your chances
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => router.push('/job-seeker/mock-interview')}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Practice Interview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Use our AI mock interview to prepare and improve
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => router.push('/job-seeker/job-market')}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              Find Jobs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Browse and apply to jobs that match your skills
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
