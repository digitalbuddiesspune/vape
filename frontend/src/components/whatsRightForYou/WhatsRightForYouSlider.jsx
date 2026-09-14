import HorizontalScrollRow from "../home/HorizontalScrollRow";
import WhatsRightForYouCard from "./WhatsRightForYouCard";

function WhatsRightForYouSlider({ items, autoScroll = true }) {
  return (
    <>
      <div className="lg:hidden">
        <HorizontalScrollRow autoScroll={autoScroll} gapClassName="gap-2">
          {items.map((item, index) => (
            <div
              key={item._id}
              className="min-w-full shrink-0 grow-0 basis-full snap-start"
            >
              <WhatsRightForYouCard item={item} index={index} />
            </div>
          ))}
        </HorizontalScrollRow>
      </div>

      <div className="hidden grid-cols-3 gap-2 lg:grid">
        {items.map((item, index) => (
          <WhatsRightForYouCard key={item._id} item={item} index={index} />
        ))}
      </div>
    </>
  );
}

export default WhatsRightForYouSlider;
