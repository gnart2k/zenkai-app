
import { NextResponse } from 'next/server';
import { db } from '@/lib/db/drizzle';
import { jobPostings } from '@/lib/db/schema';
import { z } from 'zod';
import { auth } from '@/lib/auth';

const createJobPostingSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  status: z.enum(['draft', 'published', 'archived']).default('draft'),
  isPublic: z.boolean().default(false),
  interviewConfig: z.any().optional(),
  teamId: z.number(),
});

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const parsedData = createJobPostingSchema.safeParse(body);

    if (!parsedData.success) {
      return NextResponse.json({ error: parsedData.error.errors }, { status: 400 });
    }

    const { title, description, status, isPublic, interviewConfig, teamId } = parsedData.data;

    const [newJob] = await db
      .insert(jobPostings)
      .values({
        title,
        description,
        status,
        isPublic,
        interviewConfig,
        teamId,
        createdById: parseInt(session.user.id),
      })
      .returning();

    return NextResponse.json(newJob, { status: 201 });
  } catch (error) {
    console.error('Error creating job posting:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
