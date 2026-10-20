export const GITHUB_ORG_URL = "https://github.com/mifunedev";

export interface FlagshipRepo {
  name: string;
  owner: string;
  fullName: string;
  url: string;
  tagline: string;
  stars: number;
  starsVerified: boolean;
  language: string | null;
}

interface CuratedRepo {
  owner: string;
  name: string;
  tagline: string;
  fallbackStars: number;
  fallbackLanguage: string | null;
}

const FLAGSHIP: CuratedRepo[] = [
  {
    owner: "mifunedev",
    name: "agro",
    tagline:
      "An open, isolated workspace for running coding agents with your preferred harness.",
    fallbackStars: 21,
    fallbackLanguage: "TypeScript",
  },
  {
    owner: "mifunedev",
    name: "skills",
    tagline:
      "A portable, cross-agent skill library for Claude Code and compatible AI agents.",
    fallbackStars: 0,
    fallbackLanguage: "Shell",
  },
  {
    owner: "mifunedev",
    name: "orchestra",
    tagline: "Steerable harnesses for DeepAgents and multi-agent automation.",
    fallbackStars: 13,
    fallbackLanguage: "Python",
  },
  {
    owner: "mifunedev",
    name: "a2a-langgraph",
    tagline:
      "Agent-to-agent protocol experiments built on LangGraph for interoperable, conversational AI workers.",
    fallbackStars: 29,
    fallbackLanguage: "Python",
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
    starsVerified: false,
    language: repo.fallbackLanguage,
  };

  try {
    const res = await fetch(
      `https://api.github.com/repos/${repo.owner}/${repo.name}`,
      {
        headers: { Accept: "application/vnd.github+json" },
        next: { revalidate: 3600 },
      },
    );
    if (!res.ok) return base;
    const data = (await res.json()) as {
      stargazers_count?: number;
      language?: string | null;
    };
    const starsVerified =
      typeof data.stargazers_count === "number" &&
      Number.isFinite(data.stargazers_count) &&
      data.stargazers_count >= 0;

    return {
      ...base,
      stars: starsVerified ? data.stargazers_count! : base.stars,
      starsVerified,
      language: data.language ?? base.language,
    };
  } catch {
    return base;
  }
}

export async function getFlagshipRepos(): Promise<FlagshipRepo[]> {
  return Promise.all(FLAGSHIP.map(fetchRepo));
}
