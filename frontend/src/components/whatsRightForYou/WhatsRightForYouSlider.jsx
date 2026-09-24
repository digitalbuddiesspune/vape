import WhatsRightForYouCard from "./WhatsRightForYouCard";

function WhatsRightForYouSlider({ items }) {
  return (
    <div className="store-page-x store-page-x-lg-flush mx-auto grid w-full max-w-4xl grid-cols-1 gap-2 sm:gap-3 lg:max-w-none lg:grid-cols-2 lg:gap-5">
      {items.map((item, index) => (
        <WhatsRightForYouCard key={item._id} item={item} index={index} />
      ))}
    </div>
  );
}

export default WhatsRightForYouSlider;
