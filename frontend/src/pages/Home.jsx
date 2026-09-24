import HeroBanner from "../components/mobile/HeroBanner";
import CategoryNav from "../components/mobile/CategoryNav";
import WhatsRightForYouSection from "../components/mobile/WhatsRightForYouSection";
import JustArrived from "../components/home/JustArrived";
import HotSelling from "../components/home/HotSelling";
import RecentlyViewed from "../components/home/RecentlyViewed";
import TopBrands from "../components/mobile/TopBrands";
import BestDeals from "../components/mobile/BestDeals";
import PromoBanner from "../components/mobile/PromoBanner";
import TestimonialsImpact from "../components/home/TestimonialsImpact";

function Home() {
  return (
    <div className="bg-mobile-bg store-page-stack">
      <HeroBanner />
      <CategoryNav />
      <WhatsRightForYouSection />
      <TopBrands />
      <BestDeals />
      <div className="flex flex-col gap-3 sm:gap-4 lg:gap-5">
        <JustArrived />
        <HotSelling />
        <RecentlyViewed />
      </div>
      <PromoBanner />
      <TestimonialsImpact />
    </div>
  );
}

export default Home;
