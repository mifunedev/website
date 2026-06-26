import { getLatestVideos, watchListSchema } from "@/lib/youtube";
import JsonLd from "@/components/seo/JsonLd";
import WatchShowcase from "./WatchShowcase";

// Async server component: pulls the channel's latest uploads from the keyless
// Atom feed at build time (hourly ISR) and hands them to the client showcase.
// Emits VideoObject JSON-LD only when real uploads are present.
export default async function WatchSection() {
  const videos = await getLatestVideos(6);
  return (
    <>
      {videos.length > 0 && <JsonLd data={watchListSchema(videos)} />}
      <WatchShowcase videos={videos} />
    </>
  );
}
