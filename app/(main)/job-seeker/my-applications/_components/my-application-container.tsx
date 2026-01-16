"use client"

import { useState } from "react";
import { Search, Filter, Eye, Clock, XCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface Application {
  id: string;
  jobTitle: string;
  company: string;
  appliedDate: string;
  status: "pending" | "under_review" | "interview_scheduled" | "interview_completed" | "offer" | "rejected";
  stage: string;
  interviewDate?: string;
  aiScore?: number;
  lastUpdate: string;
}

export function MyApplicationContainer() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [applications] = useState<Application[]>([
    {
      id: "1",
      jobTitle: "Senior Frontend Developer",
      company: "TechCorp Inc.",
      appliedDate: "2026-01-14",
      status: "interview_scheduled",
      stage: "AI Interview Scheduled",
      interviewDate: "2026-01-18",
      lastUpdate: "2026-01-15",
    },
    {
      id: "2",
      jobTitle: "Full Stack Engineer",
      company: "StartupXYZ",
      appliedDate: "2026-01-13",
      status: "under_review",
      stage: "Under Review",
      lastUpdate: "2026-01-14",
    },
    {
      id: "3",
      jobTitle: "React Developer",
      company: "Digital Agency Co.",
      appliedDate: "2026-01-10",
      status: "interview_completed",
      stage: "Interview Completed",
      aiScore: 85,
      lastUpdate: "2026-01-12",
    },
    {
      id: "4",
      jobTitle: "Frontend Engineer",
      company: "E-commerce Platform",
      appliedDate: "2026-01-08",
      status: "rejected",
      stage: "Application Declined",
      lastUpdate: "2026-01-11",
    },
    {
      id: "5",
      jobTitle: "React Native Developer",
      company: "Mobile First Inc.",
      appliedDate: "2026-01-12",
      status: "interview_completed",
      stage: "Final Interview Round",
      aiScore: 92,
      lastUpdate: "2026-01-15",
    },
    {
      id: "6",
      jobTitle: "UI/UX Engineer",
      company: "Design Studio",
      appliedDate: "2026-01-09",
      status: "pending",
      stage: "Application Submitted",
      lastUpdate: "2026-01-09",
    },
    {
      id: "7",
      jobTitle: "Lead Frontend Developer",
      company: "FinTech Corp",
      appliedDate: "2026-01-07",
      status: "offer",
      stage: "Offer Received",
      aiScore: 88,
      lastUpdate: "2026-01-16",
    },
  ]);

  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      app.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.company.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: Application["status"]) => {
    switch (status) {
      case "pending":
        return "bg-gray-500/10 text-gray-700";
      case "under_review":
        return "bg-yellow-500/10 text-yellow-700";
      case "interview_scheduled":
        return "bg-blue-500/10 text-blue-700";
      case "interview_completed":
        return "bg-purple-500/10 text-purple-700";
      case "offer":
        return "bg-green-500/10 text-green-700";
      case "rejected":
        return "bg-red-500/10 text-red-700";
      default:
        return "";
    }
  };

  const getInitials = (company: string) => {
    return company
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Calculate stats
  const totalApplications = applications.length;
  const activeApplications = applications.filter(
    (app) => !["rejected", "offer"].includes(app.status)
  ).length;
  const interviewScheduled = applications.filter(
    (app) => app.status === "interview_scheduled"
  ).length;
  const offersReceived = applications.filter((app) => app.status === "offer").length;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl tracking-tight">My Applications</h2>
        <p className="text-muted-foreground">
          Track and manage your job applications
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-gradient-to-t from-blue-50 to-white shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Total Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{totalApplications}</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-t from-purple-50 to-white shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Active</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{activeApplications}</div>
            <p className="text-xs text-muted-foreground">In progress</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-t from-green-50 to-white shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Interviews</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{interviewScheduled}</div>
            <p className="text-xs text-muted-foreground">Scheduled</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-t from-orange-50 to-white shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Offers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{offersReceived}</div>
            <p className="text-xs text-muted-foreground">Received</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search applications..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[200px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="under_review">Under Review</SelectItem>
                <SelectItem value="interview_scheduled">Interview Scheduled</SelectItem>
                <SelectItem value="interview_completed">Interview Completed</SelectItem>
                <SelectItem value="offer">Offer Received</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Applications List */}
      <div className="space-y-4">
        {filteredApplications.map((app) => (
          <Card key={app.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {getInitials(app.company)}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 space-y-3">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold">{app.jobTitle}</h3>
                      <p className="text-sm text-muted-foreground">{app.company}</p>
                    </div>
                    <Badge variant="outline" className={getStatusColor(app.status)}>
                      {app.stage}
                    </Badge>
                  </div>

                  {/* Details */}
                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      Applied {new Date(app.appliedDate).toLocaleDateString()}
                    </span>
                    {app.interviewDate && (
                      <span className="flex items-center gap-1 text-blue-600">
                        <Clock className="h-3 w-3" />
                        Interview on {new Date(app.interviewDate).toLocaleDateString()}
                      </span>
                    )}
                    {app.aiScore && (
                      <Badge variant="secondary">AI Score: {app.aiScore}%</Badge>
                    )}
                    <span>
                      Updated {new Date(app.lastUpdate).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Eye className="mr-2 h-3 w-3" />
                      View Details
                    </Button>
                    {app.status === "interview_scheduled" && (
                      <Button size="sm">Join Interview</Button>
                    )}
                    {app.status === "offer" && (
                      <>
                        <Button size="sm">Accept Offer</Button>
                        <Button variant="outline" size="sm">
                          Decline
                        </Button>
                      </>
                    )}
                    {app.status === "pending" && (
                      <Button variant="outline" size="sm">
                        <XCircle className="mr-2 h-3 w-3" />
                        Withdraw
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredApplications.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No applications found</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
