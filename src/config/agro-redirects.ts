export const AGRO_HOST = "agro.mifune.dev";
export const MIFUNE_ORIGIN = "https://mifune.dev";

const AGRO_DOCS = [
  "agro-directory-layout",
  "configuration",
  "connecting",
  "contributing",
  "deployment-prebuilt-image",
  "harnesses/antigravity-cli",
  "harnesses/claude-code",
  "harnesses/codex",
  "harnesses/fx",
  "harnesses/grok-build",
  "harnesses/hermes",
  "harnesses/muse-code",
  "harnesses/openclaw",
  "harnesses/opencode",
  "harnesses/overview",
  "harnesses/pi",
  "harnesses/prime-agent",
  "harnesses/roder",
  "harnesses/t3code",
  "installation",
  "integrations/agent-browser",
  "integrations/debugmcp",
  "integrations/github",
  "integrations/herdr",
  "integrations/langfuse",
  "integrations/pi-fff",
  "integrations/slack",
  "integrations/sshd",
  "intro",
  "lifecycle-commands",
  "quickstart",
  "runtimes/microsandbox",
  "runtimes/overview",
  "sandbox-python",
  "security-considerations",
].map((slug) => `/docs/agro/${slug}`);

const CONSOLE_DOCS = [
  "api-tokens",
  "billing",
  "connect",
  "free-tier",
  "getting-started",
  "nodes",
  "organizations",
  "snapshots",
].map((slug) => `/docs/console/${slug}`);

const SHARED_DOCS = ["/docs", "/docs/glossary", "/docs/model-selection", "/docs/open-core", "/docs/resources"];

const SAME_SLUG_POSTS = [
  "compound-engineering",
  "containers-microvms-vms",
  "tokenmaxxing-openharness",
  "first-sandbox-agent-auth",
].map((slug) => `/blog/${slug}`);

const BLOG_TAGS = [
  "agents",
  "ai-engineering",
  "architecture",
  "auth",
  "claude-code",
  "compound-engineering",
  "deployment",
  "docker",
  "firecracker",
  "github",
  "mental-models",
  "multi-agent",
  "open-harness",
  "productivity",
  "sandbox",
  "security",
  "self-hosted",
  "tokenmaxxing",
  "worktrees",
].map((tag) => `/blog/tags/${tag}`);

const samePath = (paths: string[]) => Object.fromEntries(paths.map((path) => [path, path]));
const toPath = (paths: string[], destination: string) =>
  Object.fromEntries(paths.map((path) => [path, destination]));

export const SITEMAP_REDIRECTS: Record<string, string> = {
  ...toPath(["/", "/search"], "/docs"),
  ...samePath(SHARED_DOCS),
  ...samePath(CONSOLE_DOCS),
  ...samePath(AGRO_DOCS),
  "/docs/agro/runtimes/openshell": "/docs/agro/runtimes/overview",
  ...samePath(SAME_SLUG_POSTS),
  "/blog/2026/04/28/archive/byoh": "/blog/byoh",
  "/blog/2026/05/19/four-words-multi-agent": "/blog/four-words-multi-agent",
  "/blog/2026/05/19/statusline-context-rot": "/blog/statusline-context-rot",
  "/blog/deploy-open-harness-with-docker": "/blog/agro-getting-started",
  "/blog/open-harness-demo-guide": "/blog/daily-work-with-agro",
  ...toPath(["/blog", "/blog/archive", "/blog/authors", "/blog/tags", ...BLOG_TAGS], "/blog"),
};

export const LEGACY_REDIRECTS: Record<string, string> = {
  "/docs/intro": "/docs/agro/intro",
  "/docs/quickstart": "/docs/agro/quickstart",
  "/docs/installation": "/docs/agro/installation",
  "/docs/configuration": "/docs/agro/configuration",
  "/docs/connecting": "/docs/agro/connecting",
  "/docs/contributing": "/docs/agro/contributing",
  "/docs/lifecycle-commands": "/docs/agro/lifecycle-commands",
  "/docs/agro-directory-layout": "/docs/agro/agro-directory-layout",
  "/docs/deployment-prebuilt-image": "/docs/agro/deployment-prebuilt-image",
  "/docs/security-considerations": "/docs/agro/security-considerations",
  "/docs/harnesses/overview": "/docs/agro/harnesses/overview",
  "/docs/harnesses/antigravity-cli": "/docs/agro/harnesses/antigravity-cli",
  "/docs/harnesses/claude-code": "/docs/agro/harnesses/claude-code",
  "/docs/harnesses/codex": "/docs/agro/harnesses/codex",
  "/docs/harnesses/grok-build": "/docs/agro/harnesses/grok-build",
  "/docs/harnesses/hermes": "/docs/agro/harnesses/hermes",
  "/docs/harnesses/muse-code": "/docs/agro/harnesses/muse-code",
  "/docs/harnesses/openclaw": "/docs/agro/harnesses/openclaw",
  "/docs/harnesses/opencode": "/docs/agro/harnesses/opencode",
  "/docs/harnesses/pi": "/docs/agro/harnesses/pi",
  "/docs/harnesses/t3code": "/docs/agro/harnesses/t3code",
  "/docs/integrations/debugmcp": "/docs/agro/integrations/debugmcp",
  "/docs/integrations/github": "/docs/agro/integrations/github",
  "/docs/integrations/herdr": "/docs/agro/integrations/herdr",
  "/docs/integrations/langfuse": "/docs/agro/integrations/langfuse",
  "/docs/integrations/pi-fff": "/docs/agro/integrations/pi-fff",
  "/docs/integrations/slack": "/docs/agro/integrations/slack",
  "/docs/integrations/sshd": "/docs/agro/integrations/sshd",
  "/docs/runtimes/overview": "/docs/agro/runtimes/overview",
  "/docs/runtimes/microsandbox": "/docs/agro/runtimes/microsandbox",
  "/docs/agents/claude-code": "/docs/agro/harnesses/claude-code",
  "/docs/agents/codex": "/docs/agro/harnesses/codex",
  "/docs/agents/deepagents": "/docs/agro/harnesses/overview",
  "/docs/harnesses/deepagents": "/docs/agro/harnesses/overview",
  "/docs/agents/grok-build": "/docs/agro/harnesses/grok-build",
  "/docs/agents/opencode": "/docs/agro/harnesses/opencode",
  "/docs/agents/pi": "/docs/agro/harnesses/pi",
  "/docs/agents/t3code": "/docs/agro/harnesses/t3code",
  "/docs/oh-directory-layout": "/docs/agro/agro-directory-layout",
  "/docs/agro": "/docs/agro/intro",
  "/docs/property-testing": "/docs/agro/contributing",
  "/docs/agro-compatibility": "/docs/agro/intro",
  "/docs/docker-deployment": "/docs/agro/deployment-prebuilt-image",
  "/docs/runtimes/docker": "/docs/agro/runtimes/overview",
};

export const AGRO_REDIRECTS: Record<string, string> = { ...SITEMAP_REDIRECTS, ...LEGACY_REDIRECTS };

export const AGRO_FALLBACK = "/docs";

const escapeRegExp = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export function passthroughPattern(files: readonly string[]): string {
  return `(?!(?:${files.map(escapeRegExp).join("|")})$).*`;
}

export function agroHostRedirects(passthrough: readonly string[]) {
  const has = [{ type: "host" as const, value: AGRO_HOST }];
  const redirect = (source: string, path: string) => ({
    source,
    destination: `${MIFUNE_ORIGIN}${path}`,
    permanent: true,
    has,
  });
  return [
    ...Object.entries(AGRO_REDIRECTS).map(([source, path]) => redirect(source, path)),
    redirect(`/:path(${passthroughPattern(passthrough)})`, AGRO_FALLBACK),
  ];
}
