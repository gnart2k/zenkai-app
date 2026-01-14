
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { db } from '@/lib/db/drizzle';
import { jobPostings, teams, users } from '@/lib/db/schema';
import { and, eq, desc } from 'drizzle-orm';
import { auth } from '@/lib/auth';
import { DataTable } from './_components/data-table';
import { columns } from './_components/columns';

async function getJobs(teamId: number) {
    const data = await db
      .select({
        id: jobPostings.id,
        title: jobPostings.title,
        status: jobPostings.status,
        createdAt: jobPostings.createdAt,
      })
      .from(jobPostings)
      .where(eq(jobPostings.teamId, teamId))
      .orderBy(desc(jobPostings.createdAt));

    return data;
}

export default async function JobsPage() {
    const session = await auth();
    if (!session?.user?.id) {
        return null;
    }

    // In a real app, you would get the teamId from the user's session or another source
    const teamId = 1; 
    const data = await getJobs(teamId);

    return (
        <div>
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Job Postings</h1>
                    <p className="text-muted-foreground">Manage your company&apos;s job openings.</p>
                </div>
                <Button asChild>
                    <Link href="/dashboard/jobs/create">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Create Job
                    </Link>
                </Button>
            </div>
            <DataTable columns={columns} data={data} />
        </div>
    );
}
