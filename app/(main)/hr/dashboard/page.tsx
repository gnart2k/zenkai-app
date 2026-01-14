
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, Users, Calendar, DollarSign } from 'lucide-react';
import HRDashboard from "./_components/dashboard/HRDashboard";

export default function DashboardPage() {
  return (
    <div className="w-full">
        <HRDashboard/>
    </div>
  );
}
