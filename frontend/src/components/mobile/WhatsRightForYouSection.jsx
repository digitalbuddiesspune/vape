import { Link } from "react-router-dom";
import { useWhatsRightForYouQuery } from "../../hooks/queries/useWhatsRightForYouQuery";
import WhatsRightForYouSlider from "../whatsRightForYou/WhatsRightForYouSlider";

function WhatsRightForYouSection() {
  const { data: items = [], isLoading, isError } = useWhatsRightForYouQuery();

  return (
    <section className="bg-mobile-bg px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
      <div className="mx-auto max-w-[1600px]">
        <div className="relative mb-5 sm:mb-6">
          <Link
            to="/whats-right-for-you"
            className="absolute right-0 top-1 shrink-0 text-sm font-semibold text-primary transition hover:underline"
          >
            View All
          </Link>
          <div className="px-14 text-center sm:px-16">
            <h2 className="text-2xl font-bold text-text-primary sm:text-3xl lg:text-4xl">
              What&apos;s Right for You?
            </h2>
            <p className="mx-auto mt-2 max-w-2xl text-sm leading-relaxed text-text-secondary sm:text-base">
              Not sure where to start? We&apos;ll help you find your match.
            </p>
          </div>
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
