"use client"
import { useState } from "react";
import { Job, JobList } from "./job-list";
import { JobDetails } from "./job-detail";
import { JobForm } from "./job-form";
import { CandidateDetails, type Candidate } from "./candidate/job-candidate-details";
import { Toaster } from "@/components/ui/sonner";

type View = "list" | "details" | "candidate";

export default function JobContainer() {
    const [currentView, setCurrentView] = useState<View>("list");
    const [selectedJob, setSelectedJob] = useState<Job | null>(null);
    const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [formMode, setFormMode] = useState<"create" | "edit">("create");

    const handleCreateJob = () => {
        setFormMode("create");
        setSelectedJob(null);
        setIsFormOpen(true);
    };

    const handleEditJob = (job: Job) => {
        setFormMode("edit");
        setSelectedJob(job);
        setIsFormOpen(true);
    };

    const handleViewJob = (job: Job) => {
        setSelectedJob(job);
        setCurrentView("details");
    };

    const handleViewCandidate = (candidate: Candidate) => {
        setSelectedCandidate(candidate);
        setCurrentView("candidate");
    };

    const handleBackToList = () => {
        setCurrentView("list");
        setSelectedJob(null);
        setSelectedCandidate(null);
    };

    const handleBackToJobDetails = () => {
        setCurrentView("details");
        setSelectedCandidate(null);
    };

    return (
        <>
            <div className="min-h-screen bg-background w-full @container/main">
                <div className="">
                    {currentView === "list" ? (
                        <JobList
                            onCreateJob={handleCreateJob}
                            onEditJob={handleEditJob}
                            onViewJob={handleViewJob}
                        />
                    ) : currentView === "details" && selectedJob ? (
                        <div className="p-4 lg:p-6">
                        <JobDetails
                            job={selectedJob}
                            onBack={handleBackToList}
                            onEdit={() => handleEditJob(selectedJob)}
                            onViewCandidate={handleViewCandidate}
                        />
                        </div>
                    ) : currentView === "candidate" && selectedCandidate && selectedJob ? (
                        <div className="p-4 lg:p-6">
                        <CandidateDetails
                            candidate={selectedCandidate}
                            job={selectedJob}
                            onBack={handleBackToJobDetails}
                        />
                        </div>
                    ) : null}

                    <JobForm
                        isOpen={isFormOpen}
                        onClose={() => setIsFormOpen(false)}
                        job={selectedJob}
                        mode={formMode}
                    />
                </div>
                <Toaster />
            </div>
        </>
    );
}

// ==================================
// type View = "list" | "details" | "candidate";

// export default function App() {
//   const [currentView, setCurrentView] = useState<View>("list");
//   const [selectedJob, setSelectedJob] = useState<Job | null>(null);
//   const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
//   const [isFormOpen, setIsFormOpen] = useState(false);
//   const [formMode, setFormMode] = useState<"create" | "edit">("create");

//   const handleCreateJob = () => {
//     setFormMode("create");
//     setSelectedJob(null);
//     setIsFormOpen(true);
//   };

//   const handleEditJob = (job: Job) => {
//     setFormMode("edit");
//     setSelectedJob(job);
//     setIsFormOpen(true);
//   };

//   const handleViewJob = (job: Job) => {
//     setSelectedJob(job);
//     setCurrentView("details");
//   };

//   const handleViewCandidate = (candidate: Candidate) => {
//     setSelectedCandidate(candidate);
//     setCurrentView("candidate");
//   };

//   const handleBackToList = () => {
//     setCurrentView("list");
//     setSelectedJob(null);
//     setSelectedCandidate(null);
//   };

//   const handleBackToJobDetails = () => {
//     setCurrentView("details");
//     setSelectedCandidate(null);
//   };

//   return (
//     <div className="min-h-screen bg-background">
//       <div className="container mx-auto py-8 px-4">
//         {currentView === "list" ? (
//           <JobList
//             onCreateJob={handleCreateJob}
//             onEditJob={handleEditJob}
//             onViewJob={handleViewJob}
//           />
//         ) : currentView === "details" && selectedJob ? (
//           <JobDetails
//             job={selectedJob}
//             onBack={handleBackToList}
//             onEdit={() => handleEditJob(selectedJob)}
//             onViewCandidate={handleViewCandidate}
//           />
//         ) : currentView === "candidate" && selectedCandidate && selectedJob ? (
//           <CandidateDetails
//             candidate={selectedCandidate}
//             job={selectedJob}
//             onBack={handleBackToJobDetails}
//           />
//         ) : null}

//         <JobForm
//           isOpen={isFormOpen}
//           onClose={() => setIsFormOpen(false)}
//           job={selectedJob}
//           mode={formMode}
//         />
//       </div>
//       <Toaster />
//     </div>
//   );
// }