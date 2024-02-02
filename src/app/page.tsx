import {
    FrameButton,
    FrameConfig,
    Frame,
    FrameImage,
} from "@devcaster/next/frames";
export const dynamic = "force-dynamic";

export default function Home({ searchParams }: { searchParams: any }) {
    const frame = new FrameConfig<{
        fid: number;
    }>({ fid: -1 }, searchParams);

    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <Frame frame={frame}>
                <FrameButton
                    onClick={(f: typeof frame) => {
                        f.state.fid = f.action!.untrustedData.fid;
                        return "/result";
                    }}
                >
                    Claim Pokemon
                </FrameButton>
                <FrameImage src={`${process.env.BASE_URL}/images/home`} />
            </Frame>
        </main>
    );
}
