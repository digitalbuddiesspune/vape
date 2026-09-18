import WhatsRightForYouCard from "./WhatsRightForYouCard";

function WhatsRightForYouSlider({ items }) {
  return (
    <div className="relative left-1/2 grid w-screen max-w-[100vw] -translate-x-1/2 grid-cols-1 lg:grid-cols-3">
      {items.map((item, index) => (
        <WhatsRightForYouCard key={item._id} item={item} index={index} />
      ))}
    </div>
  );
}

export default WhatsRightForYouSlider;
