"use client"
import { useState } from "react";
import { Job, JobList } from "./job-list";
import { JobDetails } from "./job-detail";
import { JobForm } from "./job-form";
import { Toaster } from "@/components/ui/sonner";

type View = "list" | "details";

export default function JobContainer() {
    const [currentView, setCurrentView] = useState<View>("list");
    const [selectedJob, setSelectedJob] = useState<Job | null>(null);
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

    const handleBackToList = () => {
        setCurrentView("list");
        setSelectedJob(null);
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
                    ) : selectedJob ? (
                        <JobDetails
                            job={selectedJob}
                            onBack={handleBackToList}
                            onEdit={() => handleEditJob(selectedJob)}
                        />
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
