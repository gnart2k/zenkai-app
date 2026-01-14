import { getUser } from "@/lib/core/db/queries";

export async function GET() {
  const user = await getUser();
  return Response.json(user);
}
