import { NextRequest, NextResponse } from "next/server";
import { join } from "path";
import * as fs from "fs";
import { revalidatePath } from "next/cache";
import satori from "satori";
import sharp from "sharp";
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const fontPath = join(process.cwd(), "PressStart.ttf");
let fontData = fs.readFileSync(fontPath);

export async function GET(request: NextRequest) {
    revalidatePath(request.url);

    const svg = await satori(
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
                fontSize: "16px",
                gap: "32px",
            }}
        >
            <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/International_Pok%C3%A9mon_logo.svg/1280px-International_Pok%C3%A9mon_logo.svg.png"
                style={{
                    width: "408px",
                    height: "150px",
                }}
                alt="Pokemon"
            />
            What&apos;s your FID&apos;s Pokemon?
        </div>,
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

    // Convert SVG to PNG using Sharp
    const pngBuffer = await sharp(Buffer.from(svg)).toFormat("png").toBuffer();

    // Set the content type to PNG and send the response
    return new NextResponse(pngBuffer, {
        status: 200,
        headers: {
            "Content-Type": "image/png",
            "Cache-Control": "max-age=10",
        },
    });
}
