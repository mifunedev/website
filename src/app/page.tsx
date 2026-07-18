import TopNavBar from "@/components/nav/TopNavBar";
import JsonLd from "@/components/seo/JsonLd";
import { faqs } from "@/data/faqs";
import {
  cloudServiceSchema,
  faqPageSchema,
  openHarnessSoftwareSchema,
} from "@/lib/schema";
import CTASection from "@/sections/CTASection";
import FAQSection from "@/sections/FAQSection";
import FooterSection from "@/sections/FooterSection";
import HeroSection from "@/sections/HeroSection";
import OpenHarnessValueSection from "@/sections/OpenHarnessValueSection";
import PricingSection from "@/sections/PricingSection";

export default function Home() {
  return (
    <>
      <JsonLd data={cloudServiceSchema()} />
      <JsonLd data={openHarnessSoftwareSchema()} />
      <JsonLd data={faqPageSchema(faqs)} />
      <header>
        <TopNavBar />
      </header>
      <main id="main-content" tabIndex={-1} className="scroll-mt-20">
        <HeroSection />
        <OpenHarnessValueSection />
        <PricingSection />
        <FAQSection />
        <CTASection />
      </main>
      <FooterSection />
    </>
  );
}
