import { Faq } from "@/components/marketing/faq";
import { Hero } from "@/components/marketing/hero";
import { PricingSection } from "@/components/marketing/pricing-section";
import { RoleSwitcher } from "@/components/marketing/role-switcher";
import {
  CategoryMarquee,
  ClosingCta,
  FeaturedMembers,
  Guarantee,
  HowItWorks,
  ProductStrip,
  StatsBand,
} from "@/components/marketing/sections";
import { Testimonials } from "@/components/marketing/testimonials";
import { getFeatured, getLandingStats } from "@/lib/db/data";

const emptyStats = { members: 0, interviews: 0, views: 0, impressions: 0, messages: 0, hoursSaved: 0 };

export default async function HomePage() {
  const [stats, featured] = await Promise.all([
    getLandingStats().catch(() => emptyStats),
    getFeatured().catch(() => ({ hosts: [], guests: [] })),
  ]);

  return (
    <>
      <Hero stats={stats} />
      <RoleSwitcher />
      <ProductStrip />
      <StatsBand stats={stats} />
      <CategoryMarquee />
      <HowItWorks />
      <FeaturedMembers hosts={featured.hosts} guests={featured.guests} />
      <PricingSection />
      <Guarantee />
      <Testimonials />
      <Faq />
      <ClosingCta />
    </>
  );
}
