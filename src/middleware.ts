import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
    console.log(
        "New request received in middleware",
        request.url,
        request.method
    );
    const url = request.url;
    const method = request.method;

    // Create a new URL object from the request URL
    const newUrl = new URL(url);

    console.log("Params: ", newUrl.searchParams);
    console.log("Redirect:", newUrl.searchParams.get("isRedirect"));

    if (
        method === "POST" &&
        !parseInt(newUrl.searchParams.get("isRedirect") ?? "0") // this prevents infinite redirects
    ) {
        const body = await request.json();
        console.log("Body: ", body);

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
