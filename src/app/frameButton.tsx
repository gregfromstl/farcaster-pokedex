import Frame, { FrameAction } from "@/util/frames";
import { redirect } from "next/navigation";

export async function HydratedFrameButton<S>({
    frame,
    onClick,
    index,
    children,
}: {
    frame: Frame<S>;
    onClick: (
        frame: Frame<S> & { action: FrameAction }
    ) => Promise<string | void> | string | void;
    index: number;
    children: string | number;
}) {
    if (index > 4) {
        throw new Error("Too many buttons in frame (max is 4)");
    }

    const fulfillAction = async (frame: Frame<S>) => {
        if (!frame.action) throw new Error("No action to fulfill");
        console.log("fulfilling action");
        const result = await onClick(
            frame as Frame<S> & { action: FrameAction }
        );
        console.log("complete");
        redirect(
            (result ?? frame.url) +
                `?state=${encodeURIComponent(
                    JSON.stringify(frame.state)
                )}&isRedirect=1&url=${encodeURIComponent(result ?? frame.url)}`
        );
    };

    if (frame.action && frame.action.untrustedData.buttonIndex === index) {
        await fulfillAction(frame);
    }

    return (
        <meta property={`fc:frame:button:${index}`} content={`${children}`} />
    );
}

export default function FrameButton<S>({
    children,
    onClick,
}: {
    children: string | number;
    onClick: (
        frame: Frame<S> & { action: FrameAction }
    ) => Promise<string | void> | string | void;
}) {
    return <></>;
}
