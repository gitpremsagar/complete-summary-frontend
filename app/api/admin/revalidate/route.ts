import { revalidatePath } from "next/cache";

export const runtime = "nodejs";

/** Called by the API after content edits so the statically rendered summary pages pick up changes. */
export async function POST(request: Request) {
  const secret = process.env.ADMIN_INTERNAL_SECRET;
  if (!secret) {
    return Response.json({ message: "Revalidation is not configured" }, { status: 503 });
  }
  if (request.headers.get("x-admin-secret") !== secret) {
    return Response.json({ message: "Forbidden" }, { status: 403 });
  }

  const body = (await request.json().catch(() => null)) as { paths?: unknown } | null;
  const paths = Array.isArray(body?.paths) ? body.paths.filter((p): p is string => typeof p === "string") : [];
  if (paths.length === 0) {
    return Response.json({ message: "No paths to revalidate" }, { status: 400 });
  }

  for (const path of paths.slice(0, 20)) {
    // revalidatePath needs the route pattern for dynamic segments, and those are not known here.
    if (path.includes("[") || path.includes("]")) continue;
    revalidatePath(path);
  }

  return Response.json({ revalidated: paths.length });
}
