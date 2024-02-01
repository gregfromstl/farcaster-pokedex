async function validateMessage(trustedDataMessage: string) {
    const binaryData = new Uint8Array(
        trustedDataMessage
            .match(/.{1,2}/g)!
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
    if (trustedData.valid) {
        return trustedData;
    } else {
        throw new Error("Invalid message");
    }
}

export type FrameActionResponse = {
    untrustedData: {
        fid: number;
        url: string;
        messageHash: string;
        timestamp: number;
        network: number;
        buttonIndex: number;
        castId: {
            fid: number;
            hash: string;
        };
    };
    trustedData: {
        messageBytes: string;
    };
};

export type FrameAction = FrameActionResponse & {
    trustedData: {
        valid: boolean;
        message: {
            data: {
                type: "MESSAGE_TYPE_FRAME_ACTION";
                fid: number;
                timestamp: number;
                network: string;
                frameActionBody: {
                    url: string;
                    buttonIndex: number;
                    castId: {
                        fid: number;
                        hash: string;
                    };
                };
            };
            hash: string;
            hashScheme: string;
            signature: string;
            signatureScheme: string;
            signer: string;
        };
    };
};

export default class Frame<S> {
    state: S;
    url: string;
    action?: FrameAction;

    constructor({
        url,
        initialState,
        currentState,
        action,
    }: {
        url: string;
        initialState: S;
        currentState?: S;
        action?: FrameActionResponse;
    }) {
        this.state = { ...initialState, ...currentState };
        if (action) {
            const trustedData = validateMessage(
                action.trustedData.messageBytes
            );
            trustedData.then((data) => {
                this.action = action
                    ? { ...action, trustedData: data }
                    : undefined;
            });
        }
        this.url = url;
    }
}

export class NextFrame<S> extends Frame<S> {
    constructor(
        initialState: S,
        searchParams: { state?: string; action?: string; url: string }
    ) {
        const currentState = searchParams.state
            ? JSON.parse(decodeURIComponent(searchParams.state))
            : {};
        const action = searchParams.action
            ? JSON.parse(decodeURIComponent(searchParams.action))
            : undefined;

        super({
            initialState,
            currentState,
            action,
            url: decodeURIComponent(searchParams.url),
        });
    }
}
