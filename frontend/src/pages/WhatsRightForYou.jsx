import { useMemo } from "react";
import { withFindTheBestOneCard } from "../config/whatsRightForYou";
import { useWhatsRightForYouQuery } from "../hooks/queries/useWhatsRightForYouQuery";
import WhatsRightForYouSlider from "../components/whatsRightForYou/WhatsRightForYouSlider";

function WhatsRightForYou() {
  const { data: items = [], isLoading, isError } = useWhatsRightForYouQuery();
  const displayItems = useMemo(() => withFindTheBestOneCard(items), [items]);

  return (
    <div className="bg-mobile-bg">
      <section className="page-hero-section">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="page-title">What&apos;s Right for You?</h1>
        </div>
      </section>

      <section className="pb-16 pt-2 sm:pb-20">
        {isLoading ? (
          <p className="px-4 text-center text-text-secondary sm:px-6 lg:px-8">
            Loading guides...
          </p>
        ) : isError ? (
          <p className="px-4 text-center text-text-secondary sm:px-6 lg:px-8">
            Unable to load guides right now. Please try again later.
          </p>
        ) : displayItems.length === 0 ? (
          <p className="px-4 text-center text-text-secondary sm:px-6 lg:px-8">
            Guides are coming soon. Check back shortly.
          </p>
        ) : (
          <WhatsRightForYouSlider items={displayItems} />
        )}
      </section>
    </div>
  );
}

export default WhatsRightForYou;
