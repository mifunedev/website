export const YOUTUBE_HANDLE = "@ryaneggz";
export const YOUTUBE_CHANNEL_URL = `https://www.youtube.com/${YOUTUBE_HANDLE}`;

export const YOUTUBE_CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID?.trim() || "";

export interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  url: string;
  embedUrl: string;
  thumbnail: string;
  published: string;
}

function decodeEntities(input: string): string {
  return input
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)));
}

function parseFeed(xml: string, limit: number): YouTubeVideo[] {
  const videos: YouTubeVideo[] = [];
  const entries = xml.split("<entry>").slice(1);

  for (const entry of entries) {
    const id = entry.match(/<yt:videoId>([^<]+)<\/yt:videoId>/)?.[1]?.trim();
    if (!id) continue;

    const title = decodeEntities(
      entry.match(/<title>([^<]*)<\/title>/)?.[1] ?? "",
    ).trim();
    const description = decodeEntities(
      entry.match(/<media:description>([\s\S]*?)<\/media:description>/)?.[1] ?? "",
    ).trim();
    const published = entry.match(/<published>([^<]+)<\/published>/)?.[1]?.trim() ?? "";

    videos.push({
      id,
      title: title || "Untitled",
      description,
      url: `https://www.youtube.com/watch?v=${id}`,
      embedUrl: `https://www.youtube-nocookie.com/embed/${id}`,
      thumbnail: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
      published,
    });

    if (videos.length >= limit) break;
  }

  return videos;
}

export async function getLatestVideos(limit = 6): Promise<YouTubeVideo[]> {
  if (!YOUTUBE_CHANNEL_ID) return [];

  try {
    const res = await fetch(
      `https://www.youtube.com/feeds/videos.xml?channel_id=${YOUTUBE_CHANNEL_ID}`,
      {
        headers: { Accept: "application/atom+xml" },
        next: { revalidate: 3600 },
      },
    );
    if (!res.ok) return [];
    return parseFeed(await res.text(), limit);
  } catch {
    return [];
  }
}

export function watchListSchema(videos: YouTubeVideo[]): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: videos.map((v, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "VideoObject",
        name: v.title,
        description: v.description || v.title,
        thumbnailUrl: v.thumbnail,
        uploadDate: v.published,
        embedUrl: v.embedUrl,
        url: v.url,
      },
    })),
  };
}
