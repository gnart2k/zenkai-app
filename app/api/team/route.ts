import { getTeamForUser } from "@/lib/core/db/queries";

export async function GET() {
  const team = await getTeamForUser();
  return Response.json(team);
}
