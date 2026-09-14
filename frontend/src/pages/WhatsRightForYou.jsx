import { useWhatsRightForYouQuery } from "../hooks/queries/useWhatsRightForYouQuery";
import WhatsRightForYouSlider from "../components/whatsRightForYou/WhatsRightForYouSlider";

function WhatsRightForYou() {
  const { data: items = [], isLoading, isError } = useWhatsRightForYouQuery();

  return (
    <div className="bg-mobile-bg">
      <section className="page-hero-section px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="page-title">What&apos;s Right for You?</h1>
          <p className="mx-auto mt-3 max-w-2xl text-base leading-relaxed text-text-secondary sm:text-lg">
            Not sure where to start? We&apos;ll help you find your match.
          </p>
        </div>
      </section>

      <section className="px-4 pb-16 pt-2 sm:px-6 sm:pb-20 lg:px-8">
        <div className="mx-auto max-w-6xl">
          {isLoading ? (
            <p className="text-center text-text-secondary">Loading guides...</p>
          ) : isError ? (
            <p className="text-center text-text-secondary">
              Unable to load guides right now. Please try again later.
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
    </div>
  );
}

export default WhatsRightForYou;
