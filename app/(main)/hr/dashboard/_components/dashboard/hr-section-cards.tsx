import { SectionCards, type SectionCardData } from "@/components/common/section-cards";

const hrData: SectionCardData[] = [
    {
      title: "Active Jobs",
      value: "12",
      change: "+2",
      changeType: "up",
      footerText: "Trending up this month",
      footerSubtext: "2 new jobs opened",
    },
    {
      title: "Total Candidates",
      value: "235",
      change: "+18.2%",
      changeType: "up",
      footerText: "Up from last month",
      footerSubtext: "Pipeline is growing",
    },
    {
      title: "Interviews Today",
      value: "8",
      change: "+3",
      changeType: "up",
      footerText: "More interviews scheduled",
      footerSubtext: "3 more than yesterday",
    },
    {
      title: "Avg. Time to Hire",
      value: "28 days",
      change: "-3 days",
      changeType: "up",
      footerText: "Faster hiring cycle",
      footerSubtext: "Improvement from last quarter",
    },
  ];

export function HRSectionCards() {
  return <SectionCards data={hrData} />;
}
