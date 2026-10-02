import TopNavBar from "@/components/nav/TopNavBar";
import JsonLd from "@/components/seo/JsonLd";
import { faqs } from "@/data/faqs";
import {
  cloudServiceSchema,
  faqPageSchema,
  agroSoftwareSchema,
} from "@/lib/schema";
import AgentPickerSection from "@/sections/AgentPickerSection";
import CTASection from "@/sections/CTASection";
import FAQSection from "@/sections/FAQSection";
import FooterSection from "@/sections/FooterSection";
import HeroSection from "@/sections/HeroSection";
import AgroValueSection from "@/sections/AgroValueSection";
import OpenSourceSection from "@/sections/OpenSourceSection";
import PricingSection from "@/sections/PricingSection";

export default function Home() {
  return (
    <>
      <JsonLd data={cloudServiceSchema()} />
      <JsonLd data={agroSoftwareSchema()} />
      <JsonLd data={faqPageSchema(faqs)} />
      <header>
        <TopNavBar />
      </header>
      <main id="main-content" tabIndex={-1} className="scroll-mt-20">
        <HeroSection />
        <OpenSourceSection />
        <AgentPickerSection />
        <AgroValueSection />
        <PricingSection />
        <FAQSection
          faqs={faqs}
          eyebrow="Common questions"
          heading="AGRO, clearly explained."
          subheading="What the workspace does, who operates it, and how Mifune can help."
          idPrefix="homepage-faq"
        />
        <CTASection />
      </main>
      <FooterSection />
    </>
  );
}
