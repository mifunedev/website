/**
 * Latest YouTube uploads shown as "build in public" social proof on the homepage.
 *
 * Keyless + auto-latest: we read the channel's public Atom feed
 * (https://www.youtube.com/feeds/videos.xml?channel_id=UC…) at build time and
 * refresh hourly (ISR) — no API key, no quota. The feed endpoint is reachable
 * from CI/Netlify build servers (unlike the bot-blocked channel HTML page), so
 * the grid auto-fills the moment a real channel ID is configured.
 *
 * Every fetch is wrapped: a missing channel ID, an empty channel, or any
 * network failure returns [] — the section then renders an on-brand "subscribe"
 * teaser instead of a broken grid, and the build never breaks.
 */

export const YOUTUBE_HANDLE = "@ryaneggz";
export const YOUTUBE_CHANNEL_URL = `https://www.youtube.com/${YOUTUBE_HANDLE}`;

/**
 * The channel's UC… ID. Set `YOUTUBE_CHANNEL_ID` in the environment once the
 * @ryaneggz channel is live. The env value wins; until it's set the section
 * shows the teaser state.
 */
export const YOUTUBE_CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID?.trim() || "";

export interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  url: string;
  embedUrl: string;
  thumbnail: string;
  published: string; // ISO 8601
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

/** Parse the Atom feed into the latest `limit` videos. Regex-based so it needs
 *  no XML parser dependency; the feed shape is stable and simple. */
function parseFeed(xml: string, limit: number): YouTubeVideo[] {
  const videos: YouTubeVideo[] = [];
  // Each upload is one <entry>…</entry>; skip the channel header before the first.
  const entries = xml.split("<entry>").slice(1);

  for (const entry of entries) {
    const id = entry.match(/<yt:videoId>([^<]+)<\/yt:videoId>/)?.[1]?.trim();
    if (!id) continue;

    // The entry's own <title> comes before <media:group>'s <media:title>.
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
        next: { revalidate: 3600 }, // refresh the latest uploads hourly
      },
    );
    if (!res.ok) return [];
    return parseFeed(await res.text(), limit);
  } catch {
    return [];
  }
}

/** ItemList of VideoObject JSON-LD — makes the embedded uploads eligible for
 *  Google video rich results. Only emitted when real videos are present. */
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
