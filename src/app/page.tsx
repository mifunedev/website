import TopNavBar from "@/components/nav/TopNavBar";
import HeroSection from "@/sections/HeroSection";
import PainSection from "@/sections/PainSection";
import PricingSection from "@/sections/PricingSection";
import ProductShowcaseSection from "@/sections/ProductShowcaseSection";
import OpenSourceSection from "@/sections/OpenSourceSection";
import WatchSection from "@/sections/WatchSection";
import AboutSection from "@/sections/AboutSection";
import FAQSection from "@/sections/FAQSection";
import AuditWizard from "@/sections/AuditWizard";
import CTASection from "@/sections/CTASection";
import FooterSection from "@/sections/FooterSection";
import JsonLd from "@/components/seo/JsonLd";
import { faqPageSchema } from "@/lib/schema";
import { faqs } from "@/data/faqs";

export default function Home() {
  return (
    <>
      <JsonLd data={faqPageSchema(faqs)} />
      <header>
        <TopNavBar />
      </header>
      <main>
        <HeroSection />
        <OpenSourceSection />
        <PainSection />
        <PricingSection />
        <ProductShowcaseSection />
        <WatchSection />
        <AboutSection />
        <FAQSection />
        <AuditWizard />
        <CTASection />
        <FooterSection />
      </main>
    </>
  );
}
