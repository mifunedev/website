import { getFlagshipRepos } from "@/lib/github";
import OpenSourceShowcase from "./OpenSourceShowcase";

// Async server component: fetches live star counts at build (hourly ISR) and
// hands them to the client presentational component for the animated cards.
export default async function OpenSourceSection() {
  const repos = await getFlagshipRepos();
  return <OpenSourceShowcase repos={repos} />;
}
