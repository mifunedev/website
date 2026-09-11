import { getFlagshipRepos } from "@/lib/github";
import OpenSourceShowcase from "./OpenSourceShowcase";

// Async server component: fetches resilient GitHub metadata at build (hourly
// ISR) and hands it to the client presentational component.
export default async function OpenSourceSection() {
  const repos = await getFlagshipRepos();
  return <OpenSourceShowcase repos={repos} />;
}
