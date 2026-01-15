import { useState } from "react";
import { MoreHorizontal, Search, Plus, Filter } from "lucide-react";
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
import { SectionCards, type SectionCardData } from "@/components/section-cards";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export interface Job {
    id: string;
    title: string;
    department: string;
    location: string;
    type: string;
    status: "active" | "paused" | "closed" | "draft";
    candidates: number;
    interviewsScheduled: number;
    interviewsCompleted: number;
    postedDate: string;
    aiInterviewEnabled: boolean;
}

interface JobListProps {
    onCreateJob: () => void;
    onEditJob: (job: Job) => void;
    onViewJob: (job: Job) => void;
}

export function JobList({ onCreateJob, onEditJob, onViewJob }: JobListProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [departmentFilter, setDepartmentFilter] = useState<string>("all");

    // Mock data
    const [jobs] = useState<Job[]>([
        {
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
        {
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
        {
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
        {
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
        {
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
    ]);

    const jobStatsData: SectionCardData[] = [
        {
            title: "Active Jobs",
            value: jobs.filter((j) => j.status === "active").length.toString(),
            change: "+0",
            changeType: "up",
            footerText: "Currently active",
            footerSubtext: "Jobs open for hiring",
        },
        {
            title: "Total Candidates",
            value: jobs.reduce((sum, job) => sum + job.candidates, 0).toString(),
            change: "+0",
            changeType: "up",
            footerText: "Total applicants",
            footerSubtext: "Across all jobs",
        },
        {
            title: "Scheduled Interviews",
            value: jobs.reduce((sum, job) => sum + job.interviewsScheduled, 0).toString(),
            change: "+0",
            changeType: "up",
            footerText: "Upcoming interviews",
            footerSubtext: "Scheduled this week",
        },
        {
            title: "Completed Interviews",
            value: jobs.reduce((sum, job) => sum + job.interviewsCompleted, 0).toString(),
            change: "+0",
            changeType: "up",
            footerText: "Interviews done",
            footerSubtext: "This month",
        },
    ];

    const departments = ["all", "Engineering", "Product", "Design", "Marketing"];

    const filteredJobs = jobs.filter((job) => {
        const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            job.department.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === "all" || job.status === statusFilter;
        const matchesDepartment = departmentFilter === "all" || job.department === departmentFilter;
        return matchesSearch && matchesStatus && matchesDepartment;
    });

    const getStatusColor = (status: Job["status"]) => {
        switch (status) {
            case "active":
                return "bg-green-500/10 text-green-700 hover:bg-green-500/20";
            case "paused":
                return "bg-yellow-500/10 text-yellow-700 hover:bg-yellow-500/20";
            case "closed":
                return "bg-gray-500/10 text-gray-700 hover:bg-gray-500/20";
            case "draft":
                return "bg-blue-500/10 text-blue-700 hover:bg-blue-500/20";
            default:
                return "";
        }
    };

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex px-4 pt-4 lg:px-6 items-center justify-between">
                <div>
                    <h2 className="text-3xl tracking-tight">Job Positions</h2>
                    <p className="text-muted-foreground">
                        Manage and monitor your AI-powered interview positions
                    </p>
                </div>
                <Button onClick={onCreateJob}>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Job
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="w-full">
                <SectionCards data={jobStatsData} />
            </div>

            {/* Filters */}
            <div className="px:4 lg:px-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Job Listings</CardTitle>
                        <CardDescription>
                            Filter and search through your open positions
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex gap-4 mb-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search jobs..."
                                    className="pl-8"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="w-[180px]">
                                    <Filter className="mr-2 h-4 w-4" />
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Status</SelectItem>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="paused">Paused</SelectItem>
                                    <SelectItem value="closed">Closed</SelectItem>
                                    <SelectItem value="draft">Draft</SelectItem>
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
                                        <TableHead>Job Title</TableHead>
                                        <TableHead>Department</TableHead>
                                        <TableHead>Location</TableHead>
                                        <TableHead>Type</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Candidates</TableHead>
                                        <TableHead>AI Interviews</TableHead>
                                        <TableHead>Posted</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredJobs.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={9} className="text-center h-24">
                                                No jobs found
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        filteredJobs.map((job) => (
                                            <TableRow key={job.id} className="cursor-pointer" onClick={() => onViewJob(job)}>
                                                <TableCell>
                                                    {job.title}
                                                </TableCell>
                                                <TableCell>{job.department}</TableCell>
                                                <TableCell>{job.location}</TableCell>
                                                <TableCell>{job.type}</TableCell>
                                                <TableCell>
                                                    <Badge variant="outline" className={getStatusColor(job.status)}>
                                                        {job.status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>{job.candidates}</TableCell>
                                                <TableCell>
                                                    <div className="flex flex-col text-sm">
                                                        <span className="text-muted-foreground">
                                                            {job.interviewsCompleted} / {job.interviewsScheduled + job.interviewsCompleted}
                                                        </span>
                                                        {job.aiInterviewEnabled && (
                                                            <Badge variant="outline" className="mt-1 w-fit">
                                                                AI Enabled
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    {new Date(job.postedDate).toLocaleDateString()}
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
                                                                onViewJob(job);
                                                            }}>
                                                                View Details
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem onClick={(e) => {
                                                                e.stopPropagation();
                                                                onEditJob(job);
                                                            }}>
                                                                Edit Job
                                                            </DropdownMenuItem>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem>View Candidates</DropdownMenuItem>
                                                            <DropdownMenuItem>View Analytics</DropdownMenuItem>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem className="text-red-600">
                                                                Delete Job
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
