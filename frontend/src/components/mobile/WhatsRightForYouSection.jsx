import { useMemo } from "react";
import { withFindTheBestOneCard } from "../../config/whatsRightForYou";
import { useWhatsRightForYouQuery } from "../../hooks/queries/useWhatsRightForYouQuery";
import WhatsRightForYouSlider from "../whatsRightForYou/WhatsRightForYouSlider";

function WhatsRightForYouSection() {
  const { data: items = [], isLoading, isError } = useWhatsRightForYouQuery();
  const displayItems = useMemo(() => withFindTheBestOneCard(items), [items]);

  return (
    <section className="bg-mobile-bg py-5 sm:py-6 lg:py-8">
      <div className="mb-5 px-4 text-center sm:mb-6 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-text-primary sm:text-3xl lg:text-4xl">
          What&apos;s Right for You?
        </h2>
        <p className="mx-auto mt-2 max-w-2xl text-sm leading-relaxed text-text-secondary sm:text-base">
          Not sure where to start? We&apos;ll help you find your match.
        </p>
      </div>

      {isLoading ? (
        <p className="px-4 text-center text-text-secondary sm:px-6 lg:px-8">
          Loading guides...
        </p>
      ) : isError ? (
        <p className="px-4 text-center text-text-secondary sm:px-6 lg:px-8">
          Guides are coming soon. Check back shortly.
        </p>
      ) : displayItems.length === 0 ? (
        <p className="px-4 text-center text-text-secondary sm:px-6 lg:px-8">
          Guides are coming soon. Check back shortly.
        </p>
      ) : (
        <WhatsRightForYouSlider items={displayItems} />
      )}
    </section>
  );
}

export default WhatsRightForYouSection;
