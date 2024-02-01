import { NextFrame } from "@/util/frames";
import InjectFrame from "./frame";
import FrameButton from "./frameButton";
import FrameImage from "./frameImage";
export const dynamic = "force-dynamic";

export default function Home({ searchParams }: { searchParams: any }) {
    const frame = new NextFrame<{
        fid: number;
    }>({ fid: -1 }, searchParams);

    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <InjectFrame frame={frame}>
                <FrameButton
                    onClick={(f: typeof frame) => {
                        f.state.fid = f.action!.untrustedData.fid;
                        return "/result";
                    }}
                >
                    Claim Pokemon
                </FrameButton>
                <FrameImage src={`${process.env.BASE_URL}/images/home`} />
            </InjectFrame>
        </main>
    );
}
