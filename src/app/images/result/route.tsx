import satori from "satori";
import { NextRequest, NextResponse } from "next/server";
import { ImageResponse } from "next/og";
import { join } from "path";
import * as fs from "fs";
import { revalidatePath } from "next/cache";
export const dynamic = "force-dynamic";

const fontPath = join(process.cwd(), "PressStart.ttf");
let fontData = fs.readFileSync(fontPath);

export async function GET(request: NextRequest) {
    revalidatePath(request.url);
    const searchParams = request.nextUrl.searchParams;
    const name = searchParams.get("name") ?? "";
    const image = decodeURIComponent(searchParams.get("image") ?? "");
    const id = parseInt(searchParams.get("id") ?? "0");

    return new ImageResponse(
        (
            <div
                style={{
                    color: "black",
                    width: "100%",
                    height: "100%",
                    backgroundColor: "white",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "12px",
                    gap: "0px",
                }}
            >
                <img
                    src={
                        image ||
                        "https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/International_Pok%C3%A9mon_logo.svg/1280px-International_Pok%C3%A9mon_logo.svg.png"
                    }
                    style={{
                        width: image ? "200px" : "408px",
                        height: image ? "200px" : "150px",
                    }}
                    alt={name || "Pokemon"}
                />
                Your Pokemon is {name || "unknown"} (ID: {id})
            </div>
        ),
        {
            width: 600,
            height: 400,
            fonts: [
                {
                    name: "PressStart",
                    data: fontData,
                    weight: 400,
                    style: "normal",
                },
            ],
        }
    );
}
