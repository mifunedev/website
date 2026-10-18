import { getFlagshipRepos } from "@/lib/github";
import OpenSourceShowcase from "./OpenSourceShowcase";
import OpenSourceSignalSection from "./OpenSourceSignalSection";

export default async function OpenSourceSection() {
  const repos = await getFlagshipRepos();
  return (
    <>
      <OpenSourceSignalSection />
      <OpenSourceShowcase repos={repos} />
    </>
  );
}
