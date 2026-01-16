"use client"
import { useState } from "react";
import { Search, MapPin, Briefcase, DollarSign, Clock, Bookmark, ExternalLink } from "lucide-react";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

interface JobPosting {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  salary: string;
  description: string;
  requirements: string[];
  benefits: string[];
  postedDate: string;
  department: string;
  experience: string;
  match: number;
  saved: boolean;
}

export function JobMarketContainer() {
  const [searchQuery, setSearchQuery] = useState("");
  const [locationFilter, setLocationFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [selectedJob, setSelectedJob] = useState<JobPosting | null>(null);
  const [isApplyDialogOpen, setIsApplyDialogOpen] = useState(false);

  const [jobs, setJobs] = useState<JobPosting[]>([
    {
      id: "1",
      title: "Senior Frontend Developer",
      company: "TechCorp Inc.",
      location: "Remote",
      type: "Full-time",
      salary: "$120k - $160k",
      description: "We are seeking an experienced Senior Frontend Developer to join our engineering team. You will be responsible for building and maintaining high-quality web applications using modern technologies like React, TypeScript, and Next.js.",
      requirements: [
        "5+ years of experience with React and modern frontend development",
        "Strong proficiency in TypeScript and JavaScript",
        "Experience with state management (Redux, Zustand, etc.)",
        "Excellent communication and collaboration skills",
      ],
      benefits: [
        "Competitive salary and equity",
        "Health, dental, and vision insurance",
        "Flexible work schedule",
        "Professional development budget",
      ],
      postedDate: "2026-01-10",
      department: "Engineering",
      experience: "5+ years",
      match: 95,
      saved: false,
    },
    {
      id: "2",
      title: "Full Stack Engineer",
      company: "StartupXYZ",
      location: "San Francisco, CA",
      type: "Full-time",
      salary: "$110k - $150k",
      description: "Join our fast-growing startup as a Full Stack Engineer. You'll work on building scalable web applications that serve thousands of users daily.",
      requirements: [
        "3+ years of full stack development experience",
        "Proficiency in React and Node.js",
        "Experience with PostgreSQL or MongoDB",
        "Strong problem-solving skills",
      ],
      benefits: [
        "Startup equity package",
        "Health insurance",
        "Unlimited PTO",
        "Modern office in downtown SF",
      ],
      postedDate: "2026-01-12",
      department: "Engineering",
      experience: "3-5 years",
      match: 88,
      saved: true,
    },
    {
      id: "3",
      title: "React Native Developer",
      company: "Mobile First Inc.",
      location: "New York, NY",
      type: "Full-time",
      salary: "$100k - $140k",
      description: "Build amazing mobile experiences for millions of users. We're looking for a talented React Native developer to join our mobile team.",
      requirements: [
        "4+ years of React Native experience",
        "Published apps on App Store and Google Play",
        "Understanding of mobile UI/UX principles",
        "Experience with native modules",
      ],
      benefits: [
        "Competitive compensation",
        "401(k) matching",
        "Hybrid work model",
        "Gym membership",
      ],
      postedDate: "2026-01-13",
      department: "Engineering",
      experience: "4-6 years",
      match: 82,
      saved: false,
    },
    {
      id: "4",
      title: "Product Manager",
      company: "Innovation Labs",
      location: "Remote",
      type: "Full-time",
      salary: "$130k - $170k",
      description: "Lead product strategy and execution for our flagship product. Work with engineering and design teams to deliver value to customers.",
      requirements: [
        "5+ years of product management experience",
        "Strong analytical and communication skills",
        "Experience with Agile methodologies",
        "Technical background preferred",
      ],
      benefits: [
        "Remote-first culture",
        "Stock options",
        "Health benefits",
        "Annual company retreats",
      ],
      postedDate: "2026-01-08",
      department: "Product",
      experience: "5+ years",
      match: 75,
      saved: false,
    },
    {
      id: "5",
      title: "UX Designer",
      company: "Design Studio",
      location: "Los Angeles, CA",
      type: "Full-time",
      salary: "$90k - $130k",
      description: "Create beautiful and intuitive user experiences for web and mobile applications. Collaborate with product and engineering teams.",
      requirements: [
        "3+ years of UX design experience",
        "Proficiency in Figma and Adobe Creative Suite",
        "Strong portfolio demonstrating UX process",
        "Understanding of design systems",
      ],
      benefits: [
        "Creative work environment",
        "Design tool subscriptions",
        "Professional development",
        "Flexible hours",
      ],
      postedDate: "2026-01-11",
      department: "Design",
      experience: "3-5 years",
      match: 70,
      saved: true,
    },
  ]);

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLocation = locationFilter === "all" || job.location.includes(locationFilter);
    const matchesType = typeFilter === "all" || job.type === typeFilter;
    return matchesSearch && matchesLocation && matchesType;
  });

  const handleSaveJob = (jobId: string) => {
    setJobs(jobs.map(job => 
      job.id === jobId ? { ...job, saved: !job.saved } : job
    ));
  };

  const handleApply = (job: JobPosting) => {
    setSelectedJob(job);
    setIsApplyDialogOpen(true);
  };

  const handleConfirmApply = () => {
    // Mock application submission
    setIsApplyDialogOpen(false);
    setSelectedJob(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl tracking-tight">Browse Jobs</h2>
        <p className="text-muted-foreground">
          Find your next opportunity from available positions
        </p>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search jobs..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={locationFilter} onValueChange={setLocationFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                <SelectItem value="Remote">Remote</SelectItem>
                <SelectItem value="San Francisco">San Francisco</SelectItem>
                <SelectItem value="New York">New York</SelectItem>
                <SelectItem value="Los Angeles">Los Angeles</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Job Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="Full-time">Full-time</SelectItem>
                <SelectItem value="Part-time">Part-time</SelectItem>
                <SelectItem value="Contract">Contract</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {filteredJobs.length} {filteredJobs.length === 1 ? "job" : "jobs"} found
        </p>
        <Select defaultValue="match">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="match">Best Match</SelectItem>
            <SelectItem value="recent">Most Recent</SelectItem>
            <SelectItem value="salary">Highest Salary</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Job Listings */}
      <div className="space-y-4">
        {filteredJobs.map((job) => (
          <Card key={job.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-3">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-xl font-semibold">{job.title}</h3>
                      <p className="text-muted-foreground">{job.company}</p>
                    </div>
                    <Badge variant="outline" className="bg-green-500/10 text-green-700">
                      {job.match}% Match
                    </Badge>
                  </div>

                  {/* Details */}
                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {job.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Briefcase className="h-4 w-4" />
                      {job.type}
                    </span>
                    <span className="flex items-center gap-1">
                      <DollarSign className="h-4 w-4" />
                      {job.salary}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      Posted {new Date(job.postedDate).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {job.description}
                  </p>

                  {/* Requirements Preview */}
                  <div className="flex flex-wrap gap-2">
                    {job.requirements.slice(0, 3).map((req, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {req.split(' ').slice(0, 3).join(' ')}...
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2">
                  <Button onClick={() => handleApply(job)}>
                    Apply Now
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleSaveJob(job.id)}
                  >
                    <Bookmark className={`h-4 w-4 ${job.saved ? "fill-current" : ""}`} />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredJobs.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <Briefcase className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <p className="text-muted-foreground">No jobs found matching your criteria</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Apply Dialog */}
      <Dialog open={isApplyDialogOpen} onOpenChange={setIsApplyDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Apply for {selectedJob?.title}</DialogTitle>
            <DialogDescription>
              {selectedJob?.company} • {selectedJob?.location}
            </DialogDescription>
          </DialogHeader>

          {selectedJob && (
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">About the Role</h4>
                <p className="text-sm text-muted-foreground">{selectedJob.description}</p>
              </div>

              <Separator />

              <div>
                <h4 className="font-medium mb-2">Requirements</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  {selectedJob.requirements.map((req, index) => (
                    <li key={index}>{req}</li>
                  ))}
                </ul>
              </div>

              <Separator />

              <div>
                <h4 className="font-medium mb-2">Benefits</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  {selectedJob.benefits.map((benefit, index) => (
                    <li key={index}>{benefit}</li>
                  ))}
                </ul>
              </div>

              <Separator />

              <div className="p-4 bg-primary/5 rounded-lg">
                <p className="text-sm">
                  <strong>Your CV will be submitted:</strong> John_Doe_Resume.pdf
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  The hiring team will review your application and schedule an AI interview if you're a good match.
                </p>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsApplyDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirmApply}>
              Submit Application
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
