import { parse } from "rss-to-json";
import Parser from 'rss-parser';
import * as htmlparser2 from "htmlparser2";


export async function rssParser(url: string) {
    const parser = new Parser();
    const feed = await parser.parseURL(url);
    return feed;
}

export async function rssToJson(
  url: string,
  excerptLength: number = 350,
): Promise<any> {
    try {
        const data = await parse(url);

        if (data && data.items) {
            data.items.forEach((item: any) => {
                const content = item.content;

                const imgRegex = /<img[^>]+src="([^">]+)"/g;
                let match;
                const imageUrls = [];

                while ((match = imgRegex.exec(content)) !== null) {
                    imageUrls.push(match[1]);
                }

                item.images = imageUrls;

                const pRegex = /<p>(.*?)<\/p>/;
                const pMatch = pRegex.exec(content);

                if (pMatch && pMatch[1]) {
                    item.excerpt = pMatch[1].substr(0, excerptLength);
                } else {
                    item.excerpt = "";
                }

                item.excerpt = item.excerpt.replace(/<[^>]*>?/gm, "");

                item.slug = item.title
                .toLowerCase()
                .replace(/[\s]+/g, "-")
                .replace(/[^\w\-]+/g, "")
                .replace(/\-\-+/g, "-")
                .replace(/^-+/, "")
                .replace(/-+$/, "");
            });

            return data.items.length > 0 ? data.items : [];
        }
    } catch (error) {
        console.error("Error fetching or processing data:", error);
    }
}

export function extractImagesToJson(htmlString: string) {
  const images: any[] = [];
  const parser = new htmlparser2.Parser({
    onopentag(name, attribs) {
      if (name === "img") {
        images.push({
          src: attribs.src || null,
          alt: attribs.alt || null,
          title: attribs.title || null
        });
      }
    }
  }, { decodeEntities: true });

  parser.write(htmlString);
  parser.end();

  return images;
}