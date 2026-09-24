import { useMemo } from "react";
import { withFindTheBestOneCard } from "../../config/whatsRightForYou";
import { useWhatsRightForYouQuery } from "../../hooks/queries/useWhatsRightForYouQuery";
import WhatsRightForYouSlider from "../whatsRightForYou/WhatsRightForYouSlider";

function WhatsRightForYouSection() {
  const { data: items = [], isLoading, isError } = useWhatsRightForYouQuery();
  const displayItems = useMemo(() => withFindTheBestOneCard(items), [items]);

  return (
    <section className="store-section-y bg-mobile-bg">
      <div className="store-page-x mb-5 text-center sm:mb-6">
        <h2 className="text-2xl font-bold text-text-primary sm:text-3xl lg:text-4xl">
          What&apos;s Right for You?
        </h2>
        <p className="mx-auto mt-2 max-w-2xl text-sm leading-relaxed text-text-secondary sm:text-base">
          Not sure where to start? We&apos;ll help you find your match.
        </p>
      </div>

      {isLoading ? (
        <p className="store-page-x text-center text-text-secondary">
          Loading guides...
        </p>
      ) : isError ? (
        <p className="store-page-x text-center text-text-secondary">
          Guides are coming soon. Check back shortly.
        </p>
      ) : displayItems.length === 0 ? (
        <p className="store-page-x text-center text-text-secondary">
          Guides are coming soon. Check back shortly.
        </p>
      ) : (
        <WhatsRightForYouSlider items={displayItems} />
      )}
    </section>
  );
}

export default WhatsRightForYouSection;
