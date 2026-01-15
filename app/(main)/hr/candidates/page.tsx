import { Candidate } from "../_components/candidate-details";
import { Job } from "../jobs/_components/job-list";
import { CandidateList } from "./_component/candidate-list";

export default function CandidatePage() {
  return (
    <div className="@container/main">
      <CandidateList/>
    </div>
  );
}   