import BottomNav from "../components/mobile/BottomNav";
import TopNav from "../components/mobile/TopNav";
import MobileHeader from "../components/mobile/MobileHeader";
import Footer from "../components/layout/Footer";
import NicotineWarningBanner from "../components/layout/NicotineWarningBanner";

function MobileLayout({ children }) {
  return (
    <div className="flex min-h-screen flex-col bg-mobile-bg text-text-primary">
      <TopNav />
      <MobileHeader />
      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col bg-mobile-bg pb-[calc(5.75rem+env(safe-area-inset-bottom))] pt-0 lg:min-h-0 lg:pb-8 lg:pt-[120px]">
        {children}
      </main>
      <NicotineWarningBanner />
      <Footer />
      <BottomNav />
    </div>
  );
}

export default MobileLayout;
