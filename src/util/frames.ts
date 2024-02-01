export type FrameAction = {
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
        action?: FrameAction;
    }) {
        this.state = { ...initialState, ...currentState };
        this.action = action;
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
