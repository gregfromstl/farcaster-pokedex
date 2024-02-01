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

        const result = await onClick(
            frame as Frame<S> & { action: FrameAction }
        );
        const redirectUrl =
            (result ?? frame.url) +
            `?state=${encodeURIComponent(
                JSON.stringify(frame.state)
            )}&isRedirect=1&url=${encodeURIComponent(result ?? frame.url)}`;

        const bytes = new TextEncoder().encode(redirectUrl).length;
        if (bytes > 256)
            throw new Error(
                "The redirect URL exceeds 256 bytes, consider reducing the size of your state and fetching more data only when its needed"
            );

        redirect(redirectUrl);
    };

    while (!frame.initialized) {
        await new Promise((resolve) => setTimeout(resolve, 100));
    }

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
