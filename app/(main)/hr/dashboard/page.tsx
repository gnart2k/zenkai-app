
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, Users, Calendar, DollarSign } from 'lucide-react';

export default function DashboardPage() {
  return (
    <div>
        <div className="mb-4">
            <h1 className="text-2xl font-bold tracking-tight">Welcome back!</h1>
            <p className="text-muted-foreground">Here is a summary of the hiring process.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                    Active Openings
                </CardTitle>
                <Briefcase className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                <div className="text-2xl font-bold">+12</div>
                <p className="text-xs text-muted-foreground">
                    +2 since last month
                </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                    New Candidates
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                <div className="text-2xl font-bold">+235</div>
                <p className="text-xs text-muted-foreground">
                    +30 since last week
                </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Upcoming Interviews</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                <div className="text-2xl font-bold">+8</div>
                <p className="text-xs text-muted-foreground">
                    +2 scheduled today
                </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                    Hiring Cost
                </CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                <div className="text-2xl font-bold">$4,231</div>
                <p className="text-xs text-muted-foreground">
                    -$520 since last month
                </p>
                </CardContent>
            </Card>
        </div>

        {/* Placeholder for future charts and activity feeds */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
                <CardHeader>
                    <CardTitle>Hiring Pipeline</CardTitle>
                    <CardDescription>A visual overview of the candidate pipeline.</CardDescription>
                </CardHeader>
                <CardContent>
                    {/* Placeholder for pipeline chart */}
                    <div className="h-64 bg-gray-200 rounded-md flex items-center justify-center">
                        <p className="text-gray-500">Pipeline Chart Coming Soon</p>
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>A feed of recent activities in the hiring process.</CardDescription>
                </CardHeader>
                <CardContent>
                    {/* Placeholder for activity feed */}
                    <div className="h-64 bg-gray-200 rounded-md flex items-center justify-center">
                        <p className="text-gray-500">Activity Feed Coming Soon</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
