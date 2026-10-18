import { getLatestVideos, watchListSchema } from "@/lib/youtube";
import JsonLd from "@/components/seo/JsonLd";
import WatchShowcase from "./WatchShowcase";

export default async function WatchSection() {
  const videos = await getLatestVideos(6);
  return (
    <>
      {videos.length > 0 && <JsonLd data={watchListSchema(videos)} />}
      <WatchShowcase videos={videos} />
    </>
  );
}
