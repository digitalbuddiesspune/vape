import WhatsRightForYouCard from "./WhatsRightForYouCard";

function WhatsRightForYouSlider({ items }) {
  return (
    <div className="grid grid-cols-1 gap-2 lg:grid-cols-3">
      {items.map((item, index) => (
        <WhatsRightForYouCard key={item._id} item={item} index={index} />
      ))}
    </div>
  );
}

export default WhatsRightForYouSlider;
