/**
 * Flagship open-source projects shown as social proof on the homepage.
 * Star counts are fetched live from the GitHub API at build time and refreshed
 * hourly (ISR). Every fetch is wrapped so a network/rate-limit failure falls
 * back to a curated baseline — the section always renders, the build never breaks.
 */

export const GITHUB_ORG_URL = "https://github.com/mifunedev";

export interface FlagshipRepo {
  name: string;
  owner: string;
  fullName: string;
  url: string;
  tagline: string;
  stars: number;
  language: string | null;
}

interface CuratedRepo {
  owner: string;
  name: string;
  tagline: string;
  fallbackStars: number;
  fallbackLanguage: string | null;
}

// Curated taglines (cleaner than the raw GitHub descriptions); stars/language go live.
const FLAGSHIP: CuratedRepo[] = [
  {
    owner: "mifunedev",
    name: "openharness",
    tagline:
      "We provide the sandbox, you choose the harness — the open foundation every managed AI worker runs inside.",
    fallbackStars: 21,
    fallbackLanguage: "TypeScript",
  },
  {
    owner: "mifunedev",
    name: "orchestra",
    tagline:
      "Steerable harnesses for DeepAgents — the orchestration layer behind reliable multi-agent automation.",
    fallbackStars: 13,
    fallbackLanguage: "Python",
  },
  {
    owner: "ryaneggz",
    name: "mifune",
    tagline:
      "The Pi + Mom agent shell that turns OpenHarness into a hands-on, self-improving coding agent.",
    fallbackStars: 1,
    fallbackLanguage: "TypeScript",
  },
];

async function fetchRepo(repo: CuratedRepo): Promise<FlagshipRepo> {
  const base: FlagshipRepo = {
    name: repo.name,
    owner: repo.owner,
    fullName: `${repo.owner}/${repo.name}`,
    url: `https://github.com/${repo.owner}/${repo.name}`,
    tagline: repo.tagline,
    stars: repo.fallbackStars,
    language: repo.fallbackLanguage,
  };

  try {
    const res = await fetch(
      `https://api.github.com/repos/${repo.owner}/${repo.name}`,
      {
        headers: { Accept: "application/vnd.github+json" },
        next: { revalidate: 3600 }, // refresh star counts hourly
      },
    );
    if (!res.ok) return base;
    const data = (await res.json()) as {
      stargazers_count?: number;
      language?: string | null;
    };
    return {
      ...base,
      stars:
        typeof data.stargazers_count === "number"
          ? data.stargazers_count
          : base.stars,
      language: data.language ?? base.language,
    };
  } catch {
    return base;
  }
}

export async function getFlagshipRepos(): Promise<FlagshipRepo[]> {
  return Promise.all(FLAGSHIP.map(fetchRepo));
}
