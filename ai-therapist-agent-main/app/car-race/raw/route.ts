import { NextRequest } from "next/server";
import { readFile } from "fs/promises";
import path from "path";

export async function GET(_req: NextRequest) {
  try {
    const htmlPath = path.resolve(process.cwd(), "..", "..", "..", "index.html");
    const html = await readFile(htmlPath, "utf-8");
    return new Response(html, {
      status: 200,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
      },
    });
  } catch (error) {
    return new Response("Car race game not found.", { status: 404 });
  }
}












