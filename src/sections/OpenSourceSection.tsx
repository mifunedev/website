import { getFlagshipRepos, OPEN_HARNESS_FALLBACK_STARS } from "@/lib/github";
import OpenSourceShowcase from "./OpenSourceShowcase";
import PickYourAgentSection from "./PickYourAgentSection";

// Async server component: fetches live star counts at build (hourly ISR) and
// hands them to the client presentational component for the animated cards.
export default async function OpenSourceSection() {
  const repos = await getFlagshipRepos();
  const openHarnessStars =
    repos.find((repo) => repo.fullName === "mifunedev/openharness")?.stars ??
    OPEN_HARNESS_FALLBACK_STARS;

  return (
    <>
      <OpenSourceShowcase repos={repos} />
      <PickYourAgentSection stars={openHarnessStars} />
    </>
  );
}
