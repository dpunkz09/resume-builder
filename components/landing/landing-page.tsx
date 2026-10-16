import { HeroSection } from "./hero-section";
import { HowItWorksSection } from "./how-it-works-section";
import { FeaturesSection } from "./features-section";
import { TemplatesGallery } from "./templates-gallery";
import { PricingSection } from "./pricing-section";
import { FAQSection } from "./faq-section";
import { CTASection } from "./cta-section";
import { LandingHeader } from "./landing-header";
import { LandingFooter } from "./landing-footer";

export function LandingPage() {
  return (
    <div className="min-h-screen scroll-smooth bg-white text-zinc-900 antialiased [&_[id]]:scroll-mt-20">
      <LandingHeader />
      <main>
        <HeroSection />
        <HowItWorksSection />
        <FeaturesSection />
        <TemplatesGallery />
        <PricingSection />
        <FAQSection />
        <CTASection />
      </main>
      <LandingFooter />
    </div>
  );
}
