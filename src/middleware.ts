import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
    const url = request.url;
    const method = request.method;

    // Create a new URL object from the request URL
    const newUrl = new URL(url);

    if (
        method === "POST" &&
        !parseInt(newUrl.searchParams.get("isRedirect") ?? "0") // this prevents infinite redirects
    ) {
        const body = await request.json();

        newUrl.searchParams.set(
            "action",
            encodeURIComponent(JSON.stringify(body))
        );
    }

    newUrl.searchParams.set(
        "url",
        encodeURIComponent(process.env.BASE_URL ?? url)
    );
    return NextResponse.rewrite(newUrl);
}

export const config = {
    matcher: "/((?!_next|static|\\.ico).)*/",
};
