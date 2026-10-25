import { files } from "@/lib/s3";

type RouteParams = { params: Promise<{ key: string[] }> };

export async function GET(_request: Request, { params }: RouteParams) {
  const key = (await params).key.join("/");
  if (!key.startsWith("avatars/") || key.split("/").some((part) => part === ".." || part === "")) {
    return new Response("Not found", { status: 404 });
  }

  try {
    const file = await files.download(key);
    const bytes = await file.arrayBuffer();
    return new Response(bytes, {
      headers: {
        "Content-Type": file.type || "application/octet-stream",
        "Cache-Control": "private, max-age=3600",
      },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
