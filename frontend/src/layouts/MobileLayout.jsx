import BottomNav from "../components/mobile/BottomNav";
import TopNav from "../components/mobile/TopNav";
import MobileHeader from "../components/mobile/MobileHeader";
import Footer from "../components/layout/Footer";

function MobileLayout({ children }) {
  return (
    <div className="flex min-h-screen flex-col bg-mobile-bg text-text-primary">
      <TopNav />
      <MobileHeader />
      <main className="mx-auto w-full max-w-7xl flex-1 bg-mobile-bg pb-20 pt-0 lg:pb-8 lg:pt-[104px]">
        {children}
      </main>
      <Footer />
      <BottomNav />
    </div>
  );
}

export default MobileLayout;
