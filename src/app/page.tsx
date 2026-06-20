import TopNavBar from "@/components/nav/TopNavBar";
import HeroSection from "@/sections/HeroSection";
import PainSection from "@/sections/PainSection";
import PricingSection from "@/sections/PricingSection";
import ProductShowcaseSection from "@/sections/ProductShowcaseSection";
import AboutSection from "@/sections/AboutSection";
import FAQSection from "@/sections/FAQSection";
import EnterpriseSection from "@/sections/EnterpriseSection";
import CTASection from "@/sections/CTASection";
import FooterSection from "@/sections/FooterSection";

export default function Home() {
  return (
    <>
      <header>
        <TopNavBar />
      </header>
      <main>
        <HeroSection />
        <PainSection />
        <PricingSection />
        <ProductShowcaseSection />
        <AboutSection />
        <FAQSection />
        <EnterpriseSection />
        <CTASection />
        <FooterSection />
      </main>
    </>
  );
}
