import { framesMiddleware } from "@devcaster/next/frames";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
    return await framesMiddleware(request);
}
