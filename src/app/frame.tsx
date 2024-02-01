import React from "react";
import FrameButton, { HydratedFrameButton } from "./frameButton";
import FrameState from "@/util/frames";

export default async function InjectFrame<S>({
    frame,
    children,
}: {
    frame: FrameState<S>;
    children: React.ReactNode;
}) {
    let buttonIndex = 1;
    const hydratedChildren = React.Children.map(children, (child) => {
        if (
            React.isValidElement<React.ComponentProps<typeof FrameButton>>(
                child
            ) &&
            child.type === FrameButton
        ) {
            return (
                <HydratedFrameButton
                    {...child.props}
                    index={buttonIndex++}
                    frame={frame}
                />
            );
        }
        return child;
    });

    return (
        <>
            <meta name="fc:frame" content="vNext" />
            <meta
                name="fc:frame:post_url"
                content={
                    frame.url +
                    "?state=" +
                    encodeURIComponent(JSON.stringify(frame.state))
                }
            />
            {hydratedChildren}
        </>
    );
}
