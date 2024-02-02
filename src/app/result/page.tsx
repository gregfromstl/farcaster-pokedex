import { Frame, FrameImage, FrameConfig } from "@devcaster/next/frames";
export const dynamic = "force-dynamic";

const getPokemon = async (fid: number) => {
    const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${fid % 1025}`
    );
    const data = await response.json();
    return {
        id: data.order,
        name: data.species.name,
        url: data.species.url,
        image: data.sprites.front_default,
    };
};

export default async function Result({ searchParams }: { searchParams: any }) {
    const frame = new FrameConfig<{
        fid: number;
    }>({ fid: -1 }, searchParams);
    if (frame.state.fid === -1) throw new Error("Failed to get FID");

    const pokemon = await getPokemon(frame.state.fid);

    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <Frame frame={frame}>
                <FrameImage
                    src={`${process.env.BASE_URL}/images/result?id=${
                        pokemon?.id
                    }&name=${pokemon?.name}&image=${encodeURIComponent(
                        pokemon?.image || ""
                    )}`}
                />
            </Frame>
        </main>
    );
}
