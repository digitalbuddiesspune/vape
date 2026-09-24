export default function ShipmentTrackingBanner({ shipment, className = "" }) {
  if (!shipment?.trackUrl) {
    return null;
  }

  return (
    <a
      href={shipment.trackUrl}
      target="_blank"
      rel="noreferrer"
      className={`inline-flex items-center justify-center rounded-lg bg-primary px-5 py-2.5 text-sm font-bold text-white transition hover:bg-primary-dark ${className}`}
    >
      Open live tracking
    </a>
  );
}
