import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// This function can be marked `async` if using `await` inside
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
        const trustedDataMessage = body.trustedData.messageBytes;
        const binaryData = new Uint8Array(
            trustedDataMessage
                .match(/.{1,2}/g)
                .map((byte: string) => parseInt(byte, 16))
        );
        const trustedDataResult = await fetch(
            process.env.HUB_URL ??
                "https://nemes.farcaster.xyz:2281/v1/validateMessage",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/octet-stream",
                },
                body: binaryData,
            }
        );
        const trustedData = await trustedDataResult.json();
        newUrl.searchParams.set(
            "action",
            encodeURIComponent(
                JSON.stringify({
                    ...body,
                    trustedData,
                })
            )
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
