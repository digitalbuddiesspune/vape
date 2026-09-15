import { useWhatsRightForYouQuery } from "../../hooks/queries/useWhatsRightForYouQuery";
import WhatsRightForYouSlider from "../whatsRightForYou/WhatsRightForYouSlider";

function WhatsRightForYouSection() {
  const { data: items = [], isLoading, isError } = useWhatsRightForYouQuery();

  return (
    <section className="bg-mobile-bg px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
      <div className="mx-auto max-w-[1600px]">
        <div className="mb-5 text-center sm:mb-6">
          <h2 className="text-2xl font-bold text-text-primary sm:text-3xl lg:text-4xl">
            What&apos;s Right for You?
          </h2>
          <p className="mx-auto mt-2 max-w-2xl text-sm leading-relaxed text-text-secondary sm:text-base">
            Not sure where to start? We&apos;ll help you find your match.
          </p>
        </div>

        {isLoading ? (
          <p className="text-center text-text-secondary">Loading guides...</p>
        ) : isError ? (
          <p className="text-center text-text-secondary">
            Guides are coming soon. Check back shortly.
          </p>
        ) : items.length === 0 ? (
          <p className="text-center text-text-secondary">
            Guides are coming soon. Check back shortly.
          </p>
        ) : (
          <WhatsRightForYouSlider items={items} />
        )}
      </div>
    </section>
  );
}

export default WhatsRightForYouSection;
