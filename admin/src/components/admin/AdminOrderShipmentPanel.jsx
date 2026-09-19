import { useEffect, useState } from "react";
import {
  clearAdminOrderShipment,
  linkAdminOrderShipment,
  uploadImageFile,
} from "../../api/api";
import { getOrderNumber } from "../../utils/orderNumber";
import { UPLOAD_FOLDERS } from "../../utils/uploadFolders";
import { adminFilterInputClass, cardClass } from "./adminStyles";
import { formatDateTime } from "./sections/adminOrderUtils";

const compactInputClass =
  "w-full min-w-0 rounded-md border border-neutral-200 bg-white px-2 py-1.5 text-xs text-text-primary focus:border-primary focus:outline-none";

const compactFieldLabelClass = "mb-0.5 block text-[11px] font-semibold text-neutral-500";

export default function AdminOrderShipmentPanel({
  order,
  onOrderUpdated,
  onError,
  onSuccess,
}) {
  const [trackingInput, setTrackingInput] = useState("");
  const [carrierInput, setCarrierInput] = useState("");
  const [trackUrlInput, setTrackUrlInput] = useState("");
  const [metadataForm, setMetadataForm] = useState({
    shipmentNote: "",
    evidenceUrl: "",
    evidenceName: "",
  });
  const [uploadingEvidence, setUploadingEvidence] = useState(false);
  const [linkingTracking, setLinkingTracking] = useState(false);
  const [clearingTracking, setClearingTracking] = useState(false);

  const hasTracking = Boolean(order?.shipment?.trackingNumber);
  const orderId = getOrderNumber(order);

  useEffect(() => {
    setTrackingInput("");
    setCarrierInput("");
    setTrackUrlInput("");
    setMetadataForm({ shipmentNote: "", evidenceUrl: "", evidenceName: "" });
  }, [order?._id]);

  const updateMetadataField = (field, value) => {
    setMetadataForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleEvidenceUpload = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      onError("Please upload an image file (JPG, PNG, WEBP).");
      return;
    }

    setUploadingEvidence(true);
    onError("");
    try {
      const { data } = await uploadImageFile(file, UPLOAD_FOLDERS.SHIPMENT_EVIDENCE);
      const uploadedUrl = data?.data?.url ?? data?.url ?? "";
      if (!uploadedUrl) {
        throw new Error("Upload succeeded but no image URL was returned.");
      }
      setMetadataForm((prev) => ({
        ...prev,
        evidenceUrl: uploadedUrl,
        evidenceName: file.name,
      }));
      onSuccess("Shipment evidence uploaded.");
    } catch (err) {
      onError(err.response?.data?.message || err.message || "Failed to upload evidence");
    } finally {
      setUploadingEvidence(false);
    }
  };

  const handleLinkTracking = async (event) => {
    event.preventDefault();
    if (!order || linkingTracking || !trackingInput.trim()) return;

    setLinkingTracking(true);
    onError("");
    onSuccess("");
    try {
      const note = String(metadataForm.shipmentNote || "").trim();
      const evidenceUrl = String(metadataForm.evidenceUrl || "").trim();
      const evidenceName = String(metadataForm.evidenceName || "").trim();

      const { data } = await linkAdminOrderShipment(order._id, {
        trackingNumber: trackingInput.trim(),
        carrier: carrierInput.trim(),
        trackUrl: trackUrlInput.trim(),
        ...(note ? { shipmentNote: note } : {}),
        ...(evidenceUrl ? { evidenceUrl, evidenceName } : {}),
      });
      onOrderUpdated(data.data);
      setTrackingInput("");
      setCarrierInput("");
      setTrackUrlInput("");
      setMetadataForm({ shipmentNote: "", evidenceUrl: "", evidenceName: "" });
      onSuccess("Tracking linked to this order.");
    } catch (err) {
      onError(err.response?.data?.message || "Failed to link tracking");
    } finally {
      setLinkingTracking(false);
    }
  };

  const handleClearTracking = async () => {
    if (!order || clearingTracking || !order.shipment?.trackingNumber) return;
    if (!window.confirm("Remove shipment tracking from this order?")) return;

    setClearingTracking(true);
    onError("");
    onSuccess("");
    try {
      const { data } = await clearAdminOrderShipment(order._id);
      onOrderUpdated(data.data);
      onSuccess(data.message || "Shipment tracking cleared.");
    } catch (err) {
      onError(err.response?.data?.message || "Failed to clear tracking");
    } finally {
      setClearingTracking(false);
    }
  };

  return (
    <div className={cardClass}>
      <div className="mb-3">
        <h3 className="text-sm font-bold text-neutral-900">Shipment</h3>
        <p className="mt-1 text-xs text-neutral-500">
          Add tracking manually after you ship with your courier.
        </p>
      </div>

      {hasTracking ? (
        <div className="space-y-2 text-xs text-neutral-700">
          <div className="grid gap-1 sm:grid-cols-2">
            <p>
              Tracking:{" "}
              <span className="font-semibold text-neutral-900">{order.shipment.trackingNumber}</span>
            </p>
            <p>
              Carrier:{" "}
              <span className="font-medium">
                {[order.shipment.carrier, order.shipment.service].filter(Boolean).join(" / ") || "—"}
              </span>
            </p>
            <p>
              Status:{" "}
              <span className="font-medium">
                {order.shipment.status || order.shipment.statusMessage || "Linked"}
              </span>
            </p>
            {order.shipment.syncedAt ? (
              <p className="text-neutral-500">Updated {formatDateTime(order.shipment.syncedAt)}</p>
            ) : null}
          </div>

          {order.shipment.note ? (
            <p className="text-sm text-neutral-700">
              Shipment note:{" "}
              <span className="font-medium text-neutral-900">{order.shipment.note}</span>
            </p>
          ) : null}

          {order.shipment.evidenceUrl ? (
            <div className="text-sm text-neutral-700">
              <span className="font-medium text-neutral-900">Shipment evidence:</span>{" "}
              <a
                href={order.shipment.evidenceUrl}
                target="_blank"
                rel="noreferrer"
                className="text-sky-700 underline"
              >
                {order.shipment.evidenceName || "View image"}
              </a>
            </div>
          ) : null}

          <div className="flex flex-wrap gap-2">
            {order.shipment.trackUrl ? (
              <a
                href={order.shipment.trackUrl}
                target="_blank"
                rel="noreferrer"
                className="rounded-md border border-neutral-300 px-3 py-1.5 text-xs font-semibold text-neutral-800 hover:bg-neutral-50"
              >
                Open tracking
              </a>
            ) : null}
            <button
              type="button"
              onClick={handleClearTracking}
              disabled={clearingTracking || order.status === "delivered"}
              className="rounded-md border border-red-300 bg-white px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-50 disabled:opacity-50"
            >
              {clearingTracking ? "Clearing…" : "Clear tracking"}
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleLinkTracking} className="space-y-3 text-sm text-neutral-700">
          <p className="text-xs text-neutral-600">
            Paste the tracking number for order #{orderId}.
          </p>

          <div className="grid gap-2 sm:grid-cols-2">
            <label className="block sm:col-span-2">
              <span className={compactFieldLabelClass}>
                Tracking number <span className="text-red-600">*</span>
              </span>
              <input
                type="text"
                value={trackingInput}
                onChange={(e) => setTrackingInput(e.target.value)}
                placeholder="Tracking number"
                className={adminFilterInputClass}
                required
              />
            </label>

            <label className="block">
              <span className={compactFieldLabelClass}>Carrier (optional)</span>
              <input
                type="text"
                value={carrierInput}
                onChange={(e) => setCarrierInput(e.target.value)}
                placeholder="Royal Mail, DPD, etc."
                className={compactInputClass}
              />
            </label>

            <label className="block">
              <span className={compactFieldLabelClass}>Tracking URL (optional)</span>
              <input
                type="url"
                value={trackUrlInput}
                onChange={(e) => setTrackUrlInput(e.target.value)}
                placeholder="https://..."
                className={compactInputClass}
              />
            </label>
          </div>

          <div className="rounded-md border border-neutral-200 p-2.5">
            <div className="grid gap-2 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
              <label className="block min-w-0">
                <span className={compactFieldLabelClass}>Note (optional)</span>
                <textarea
                  rows={2}
                  value={metadataForm.shipmentNote}
                  onChange={(e) => updateMetadataField("shipmentNote", e.target.value)}
                  className={`${compactInputClass} min-h-[2.5rem] resize-y`}
                  placeholder="Carrier instructions or internal note"
                  maxLength={500}
                />
              </label>
              <div className="shrink-0">
                <span className={compactFieldLabelClass}>Evidence (optional)</span>
                <div className="flex flex-wrap items-center gap-1.5">
                  <label className="inline-flex cursor-pointer items-center rounded-md border border-neutral-300 bg-white px-2.5 py-1.5 text-[11px] font-semibold text-neutral-800 hover:bg-neutral-50">
                    {uploadingEvidence ? "Uploading…" : "Upload"}
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/gif"
                      className="hidden"
                      disabled={uploadingEvidence || linkingTracking}
                      onChange={handleEvidenceUpload}
                    />
                  </label>
                  {metadataForm.evidenceUrl ? (
                    <>
                      <a
                        href={metadataForm.evidenceUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="max-w-[8rem] truncate text-[11px] font-medium text-sky-700 underline"
                      >
                        {metadataForm.evidenceName || "View"}
                      </a>
                      <button
                        type="button"
                        onClick={() =>
                          setMetadataForm((prev) => ({
                            ...prev,
                            evidenceUrl: "",
                            evidenceName: "",
                          }))
                        }
                        className="text-[11px] font-medium text-red-600 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </>
                  ) : null}
                </div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={linkingTracking || !trackingInput.trim()}
            className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
          >
            {linkingTracking ? "Saving…" : "Save tracking"}
          </button>
        </form>
      )}
    </div>
  );
}
