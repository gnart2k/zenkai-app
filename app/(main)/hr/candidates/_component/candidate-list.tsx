"use client"
import { useState } from "react";
import { Search, Filter, Download, Mail, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Candidate, CandidateDetails } from "../../_components/candidate-details";
import { Job } from "../../jobs/_components/job-list";
import { SectionCards, type SectionCardData } from "@/components/common/section-cards";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface CandidateWithJob extends Candidate {
  jobTitle: string;
  jobDepartment: string;
}

export function CandidateList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [stageFilter, setStageFilter] = useState<string>("all");
  const [departmentFilter, setDepartmentFilter] = useState<string>("all");

  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const onViewCandidate = (candidate: Candidate, job?: Job) => {
    setSelectedCandidate(candidate);
  };
  // Mock data - combining candidates with their job applications
  const [candidates] = useState<CandidateWithJob[]>([
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
      jobTitle: "Senior Frontend Developer",
      jobDepartment: "Engineering",
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
      jobTitle: "Senior Frontend Developer",
      jobDepartment: "Engineering",
    },
    {
      id: "3",
      name: "Emily Rodriguez",
      email: "emily.rodriguez@email.com",
      phone: "+1 (555) 345-6789",
      location: "Austin, TX",
      linkedin: "https://linkedin.com/in/emilyrodriguez",
      appliedDate: "2026-01-11",
      stage: "Technical Review",
      aiScore: 92,
      experience: "7 years",
      currentRole: "Lead Frontend Developer",
      currentCompany: "Digital Agency Co.",
      jobTitle: "Senior Frontend Developer",
      jobDepartment: "Engineering",
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
      jobTitle: "Senior Frontend Developer",
      jobDepartment: "Engineering",
    },
    {
      id: "5",
      name: "Jessica Martinez",
      email: "jessica.martinez@email.com",
      phone: "+1 (555) 567-8901",
      location: "Boston, MA",
      linkedin: "https://linkedin.com/in/jessicamartinez",
      appliedDate: "2026-01-10",
      stage: "Final Interview",
      aiScore: 88,
      experience: "6 years",
      currentRole: "Product Manager",
      currentCompany: "SaaS Company",
      jobTitle: "Product Manager",
      jobDepartment: "Product",
    },
    {
      id: "6",
      name: "James Wilson",
      email: "james.wilson@email.com",
      phone: "+1 (555) 678-9012",
      location: "Chicago, IL",
      linkedin: "https://linkedin.com/in/jameswilson",
      appliedDate: "2026-01-09",
      stage: "AI Interview Completed",
      aiScore: 78,
      experience: "5 years",
      currentRole: "Product Designer",
      currentCompany: "Design Studio",
      jobTitle: "UX Designer",
      jobDepartment: "Design",
    },
    {
      id: "7",
      name: "Lisa Anderson",
      email: "lisa.anderson@email.com",
      phone: "+1 (555) 789-0123",
      location: "Remote",
      linkedin: "https://linkedin.com/in/lisaanderson",
      appliedDate: "2026-01-15",
      stage: "AI Interview Completed",
      aiScore: 95,
      experience: "8 years",
      currentRole: "Senior Data Scientist",
      currentCompany: "AI Research Lab",
      jobTitle: "Data Scientist",
      jobDepartment: "Engineering",
    },
    {
      id: "8",
      name: "Robert Taylor",
      email: "robert.taylor@email.com",
      phone: "+1 (555) 890-1234",
      location: "Los Angeles, CA",
      linkedin: "https://linkedin.com/in/roberttaylor",
      appliedDate: "2026-01-08",
      stage: "Offer Extended",
      aiScore: 91,
      experience: "7 years",
      currentRole: "Marketing Lead",
      currentCompany: "Growth Agency",
      jobTitle: "Marketing Manager",
      jobDepartment: "Marketing",
    },
  ]);

  // Mock jobs data for context
  const mockJobs: { [key: string]: Job } = {
    "Senior Frontend Developer": {
      id: "1",
      title: "Senior Frontend Developer",
      department: "Engineering",
      location: "Remote",
      type: "Full-time",
      status: "active",
      candidates: 45,
      interviewsScheduled: 12,
      interviewsCompleted: 8,
      postedDate: "2026-01-10",
      aiInterviewEnabled: true,
    },
    "Product Manager": {
      id: "2",
      title: "Product Manager",
      department: "Product",
      location: "New York, NY",
      type: "Full-time",
      status: "active",
      candidates: 32,
      interviewsScheduled: 8,
      interviewsCompleted: 5,
      postedDate: "2026-01-08",
      aiInterviewEnabled: true,
    },
    "UX Designer": {
      id: "3",
      title: "UX Designer",
      department: "Design",
      location: "San Francisco, CA",
      type: "Full-time",
      status: "paused",
      candidates: 28,
      interviewsScheduled: 3,
      interviewsCompleted: 12,
      postedDate: "2026-01-05",
      aiInterviewEnabled: false,
    },
    "Data Scientist": {
      id: "4",
      title: "Data Scientist",
      department: "Engineering",
      location: "Remote",
      type: "Contract",
      status: "active",
      candidates: 56,
      interviewsScheduled: 15,
      interviewsCompleted: 10,
      postedDate: "2026-01-12",
      aiInterviewEnabled: true,
    },
    "Marketing Manager": {
      id: "5",
      title: "Marketing Manager",
      department: "Marketing",
      location: "Austin, TX",
      type: "Full-time",
      status: "draft",
      candidates: 0,
      interviewsScheduled: 0,
      interviewsCompleted: 0,
      postedDate: "2026-01-14",
      aiInterviewEnabled: false,
    },
  };

  const departments = ["all", "Engineering", "Product", "Design", "Marketing"];
  const stages = ["all", "Applied", "AI Interview Scheduled", "AI Interview Completed", "Technical Review", "Final Interview", "Offer Extended", "Hired", "Rejected"];

  const filteredCandidates = candidates.filter((candidate) => {
    const matchesSearch =
      candidate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      candidate.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      candidate.jobTitle.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStage = stageFilter === "all" || candidate.stage === stageFilter;
    const matchesDepartment = departmentFilter === "all" || candidate.jobDepartment === departmentFilter;
    return matchesSearch && matchesStage && matchesDepartment;
  });

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('');
  };

  const getStageColor = (stage: string) => {
    switch (stage) {
      case "Applied":
        return "bg-gray-500/10 text-gray-700";
      case "AI Interview Scheduled":
        return "bg-blue-500/10 text-blue-700";
      case "AI Interview Completed":
        return "bg-purple-500/10 text-purple-700";
      case "Technical Review":
        return "bg-yellow-500/10 text-yellow-700";
      case "Final Interview":
        return "bg-orange-500/10 text-orange-700";
      case "Offer Extended":
        return "bg-green-500/10 text-green-700";
      case "Hired":
        return "bg-green-600/10 text-green-800";
      case "Rejected":
        return "bg-red-500/10 text-red-700";
      default:
        return "";
    }
  };

  const getScoreColor = (score: number | null) => {
    if (score === null) return "";
    if (score >= 85) return "text-green-600";
    if (score >= 70) return "text-yellow-600";
    return "text-red-600";
  };

  // Calculate stats
  const totalCandidates = candidates.length;
  const aiInterviewCompleted = candidates.filter(c => c.aiScore !== null).length;
  const averageScore = candidates.filter(c => c.aiScore !== null).reduce((acc, c) => acc + (c.aiScore || 0), 0) / aiInterviewCompleted || 0;
  const inReview = candidates.filter(c => c.stage === "Technical Review" || c.stage === "Final Interview").length;

  const candidateStatsData: SectionCardData[] = [
    {
      title: "Total Candidates",
      value: totalCandidates.toString(),
      change: "+0",
      changeType: "up",
      footerText: "Across all positions",
      footerSubtext: "Active applications",
    },
    {
      title: "AI Interviews Done",
      value: aiInterviewCompleted.toString(),
      change: "+0",
      changeType: "up",
      footerText: "Completed assessments",
      footerSubtext: "AI evaluations finished",
    },
    {
      title: "Average AI Score",
      value: `${Math.round(averageScore)}%`,
      change: "+0",
      changeType: "up",
      footerText: "Overall performance",
      footerSubtext: "Candidate quality metric",
    },
    {
      title: "In Review",
      value: inReview.toString(),
      change: "+0",
      changeType: "up",
      footerText: "Active evaluations",
      footerSubtext: "Under review process",
    },
  ];

  if (selectedCandidate) {
    return (
      <div className="p-4 lg:p-6">
        <CandidateDetails
          candidate={selectedCandidate}
          job={null}
          onBack={() => setSelectedCandidate(null)}
        />
      </div>
    )
  }
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex p-4 lg:p-6 items-center justify-between">
        <div className="">
          <h2 className="text-3xl tracking-tight font-semibold">Candidates</h2>
          <p className="text-muted-foreground">
            Manage all candidates across all job positions
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button variant="outline">
            <Mail className="mr-2 h-4 w-4" />
            Bulk Email
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <SectionCards data={candidateStatsData} />

      {/* Filters and Table */}
      <div className="p-4 lg:p-6">
        <Card>
          <CardHeader>
            <CardTitle>All Candidates</CardTitle>
            <CardDescription>
              View and manage candidate applications
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search candidates..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={stageFilter} onValueChange={setStageFilter}>
                <SelectTrigger className="w-[220px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Stage" />
                </SelectTrigger>
                <SelectContent>
                  {stages.map((stage) => (
                    <SelectItem key={stage} value={stage}>
                      {stage === "all" ? "All Stages" : stage}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept === "all" ? "All Departments" : dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Table */}
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Candidate</TableHead>
                    <TableHead>Applied For</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Stage</TableHead>
                    <TableHead>AI Score</TableHead>
                    <TableHead>Applied Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCandidates.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center h-24">
                        No candidates found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredCandidates.map((candidate) => (
                      <TableRow
                        key={candidate.id}
                        className="cursor-pointer"
                        onClick={() => onViewCandidate(candidate, mockJobs[candidate.jobTitle])}
                      >
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarFallback>
                                {getInitials(candidate.name)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p>{candidate.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {candidate.currentRole}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{candidate.jobTitle}</TableCell>
                        <TableCell>{candidate.jobDepartment}</TableCell>
                        <TableCell>{candidate.location}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={getStageColor(candidate.stage)}>
                            {candidate.stage}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {candidate.aiScore !== null ? (
                            <div className="flex items-center gap-2">
                              <span className={getScoreColor(candidate.aiScore)}>
                                {candidate.aiScore}%
                              </span>
                              <Progress value={candidate.aiScore} className="w-16" />
                            </div>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {new Date(candidate.appliedDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem onClick={(e) => {
                                e.stopPropagation();
                                onViewCandidate(candidate, mockJobs[candidate.jobTitle]);
                              }}>
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem>Send Email</DropdownMenuItem>
                              <DropdownMenuItem>Download Resume</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>Schedule Interview</DropdownMenuItem>
                              <DropdownMenuItem>Update Stage</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-600">
                                Reject Candidate
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
