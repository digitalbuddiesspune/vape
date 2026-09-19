import { useCallback, useEffect, useState } from "react";
import {
  getMetaAdsSummary,
  getStoreSettings,
  updateStoreSettings,
} from "../../../api/api";
import AdminAlert from "../AdminAlert";
import {
  btnPrimary,
  cardClass,
  formHeaderClass,
  inputClass,
  labelClass,
} from "../adminStyles";

const EMPTY_SLAB = { orderAmount: "", shippingCharge: "" };

function serializeOrderSection(form) {
  return JSON.stringify({
    minimumOrderValue: String(form.minimumOrderValue ?? ""),
    minimumShippingCharge: String(form.minimumShippingCharge ?? ""),
  });
}

function serializeSlabsSection(form) {
  return JSON.stringify(
    (form.shippingSlabs || []).map((slab) => ({
      orderAmount: String(slab.orderAmount ?? ""),
      shippingCharge: String(slab.shippingCharge ?? ""),
    }))
  );
}

function serializeCartSection(form) {
  return JSON.stringify({
    cartNoticeEn: String(form.cartNoticeEn ?? ""),
    cartNoticeHi: String(form.cartNoticeHi ?? ""),
  });
}

function buildSectionSnapshots(form) {
  return {
    order: serializeOrderSection(form),
    slabs: serializeSlabsSection(form),
    cart: serializeCartSection(form),
  };
}

function StoreSettingsSection() {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(true);
  const [savingSection, setSavingSection] = useState("");
  const [savedSnapshots, setSavedSnapshots] = useState(() => buildSectionSnapshots({}));
  const [metaAdsSummary, setMetaAdsSummary] = useState(null);
  const [metaAdsLoading, setMetaAdsLoading] = useState(false);
  const [copiedFormat, setCopiedFormat] = useState("");
  const [form, setForm] = useState({
    minimumOrderValue: "3000",
    minimumShippingCharge: "280",
    shippingSlabs: [{ orderAmount: "3000", shippingCharge: "280" }],
    cartNoticeEn: "",
    cartNoticeHi: "",
  });

  const loadSettings = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await getStoreSettings();
      const settings = data.data;
      const nextForm = {
        minimumOrderValue: String(settings.minimumOrderValue ?? 3000),
        minimumShippingCharge: String(settings.minimumShippingCharge ?? 280),
        shippingSlabs: (settings.shippingSlabs || []).map((slab) => ({
          orderAmount: String(slab.orderAmount),
          shippingCharge: String(slab.shippingCharge),
        })),
        cartNoticeEn: (settings.cartNoticeEn || []).join("\n"),
        cartNoticeHi: (settings.cartNoticeHi || []).join("\n"),
      };
      setForm(nextForm);
      setSavedSnapshots(buildSectionSnapshots(nextForm));
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "Failed to load store settings"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  const loadMetaAdsSummary = useCallback(async () => {
    setMetaAdsLoading(true);
    try {
      const { data } = await getMetaAdsSummary();
      setMetaAdsSummary(data?.meta_ads_feed || null);
    } catch {
      setMetaAdsSummary(null);
    } finally {
      setMetaAdsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMetaAdsSummary();
  }, [loadMetaAdsSummary]);

  const copyToClipboard = (text, format) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedFormat(format);
    setTimeout(() => setCopiedFormat(""), 2500);
  };

  const updateSlab = (index, field, value) => {
    setForm((prev) => {
      const next = [...prev.shippingSlabs];
      next[index] = { ...next[index], [field]: value };
      return { ...prev, shippingSlabs: next };
    });
  };

  const addSlab = () => {
    setForm((prev) => ({
      ...prev,
      shippingSlabs: [...prev.shippingSlabs, { ...EMPTY_SLAB }],
    }));
  };

  const removeSlab = (index) => {
    setForm((prev) => ({
      ...prev,
      shippingSlabs: prev.shippingSlabs.filter((_, i) => i !== index),
    }));
  };

  const sectionSaveLabels = {
    order: "Order & shipping rules",
    slabs: "Shipping slabs",
    cart: "Cart messages",
  };

  const sectionSerializers = {
    order: serializeOrderSection,
    slabs: serializeSlabsSection,
    cart: serializeCartSection,
  };

  const isSectionDirty = (section) =>
    sectionSerializers[section](form) !== savedSnapshots[section];

  const dirtySections = {
    order: isSectionDirty("order"),
    slabs: isSectionDirty("slabs"),
    cart: isSectionDirty("cart"),
  };

  const saveSection = async (section) => {
    setSavingSection(section);
    setError("");
    setSuccess("");

    try {
      let payload = {};

      if (section === "order") {
        payload = {
          minimumOrderValue: Number(form.minimumOrderValue),
          minimumShippingCharge: Number(form.minimumShippingCharge),
        };
      } else if (section === "slabs") {
        payload = {
          shippingSlabs: form.shippingSlabs.map((slab) => ({
            orderAmount: Number(slab.orderAmount),
            shippingCharge: Number(slab.shippingCharge),
          })),
        };
      } else if (section === "cart") {
        payload = {
          cartNoticeEn: form.cartNoticeEn
            .split("\n")
            .map((line) => line.trim())
            .filter(Boolean),
          cartNoticeHi: form.cartNoticeHi
            .split("\n")
            .map((line) => line.trim())
            .filter(Boolean),
        };
      }

      await updateStoreSettings(payload);
      setSuccess(`${sectionSaveLabels[section]} saved successfully`);
      setSavedSnapshots((prev) => ({
        ...prev,
        [section]: sectionSerializers[section](form),
      }));
      await loadSettings();
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "Failed to save store settings"
      );
    } finally {
      setSavingSection("");
    }
  };

  const SectionSaveButton = ({ section }) => {
    const dirty = dirtySections[section];
    const isSaving = savingSection === section;

    return (
      <div
        className={`flex flex-wrap items-center justify-between gap-3 border-t pt-4 ${
          dirty ? "border-amber-200 bg-amber-50/60 -mx-1 rounded-b-xl px-1" : "border-neutral-200"
        }`}
      >
        <div className="flex items-center gap-2">
          {dirty ? (
            <>
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-amber-500" />
              </span>
              <span className="text-sm font-semibold text-amber-800">
                Unsaved changes — tap Save
              </span>
            </>
          ) : (
            <span className="text-sm text-neutral-500">All changes saved</span>
          )}
        </div>

        <button
          type="button"
          onClick={() => saveSection(section)}
          disabled={!dirty || isSaving}
          className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
            dirty
              ? "bg-amber-600 text-white shadow-md ring-2 ring-amber-300 hover:bg-amber-700"
              : "cursor-default bg-neutral-100 text-neutral-400"
          } disabled:cursor-not-allowed disabled:opacity-60`}
        >
          {isSaving ? "Saving..." : dirty ? "Save changes" : "Saved"}
        </button>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-w-0">
        <div className={`${cardClass} animate-pulse space-y-4`}>
          <div className="h-6 w-48 rounded bg-neutral-200" />
          <div className="h-10 rounded bg-neutral-200" />
          <div className="h-10 rounded bg-neutral-200" />
          <div className="h-32 rounded bg-neutral-200" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-w-0 space-y-6">
      <AdminAlert
        error={error}
        success={success}
        onClear={() => {
          setError("");
          setSuccess("");
        }}
      />

      <div className="space-y-6">
        <div
          className={`${cardClass} space-y-5 ${
            dirtySections.order ? "ring-2 ring-amber-200" : ""
          }`}
        >
          <div className={formHeaderClass}>
            <div>
              <h3 className="font-semibold text-neutral-900">Order & Shipping Rules</h3>
              <p className="mt-1 text-sm text-neutral-500">
                Control minimum order value and shipping charges shown on cart and checkout.
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass}>Minimum Order Value (£)</label>
              <input
                type="number"
                min="0"
                required
                className={inputClass}
                value={form.minimumOrderValue}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, minimumOrderValue: e.target.value }))
                }
              />
              <p className="mt-1 text-xs text-neutral-500">
                Users cannot checkout below this cart subtotal.
              </p>
            </div>

            <div>
              <label className={labelClass}>Minimum Shipping Charge (£)</label>
              <input
                type="number"
                min="0"
                required
                className={inputClass}
                value={form.minimumShippingCharge}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    minimumShippingCharge: e.target.value,
                  }))
                }
              />
              <p className="mt-1 text-xs text-neutral-500">
                Used when order value is below the first slab.
              </p>
            </div>
          </div>

          <SectionSaveButton section="order" />
        </div>

        <div
          className={`${cardClass} space-y-4 ${
            dirtySections.slabs ? "ring-2 ring-amber-200" : ""
          }`}
        >
          <div className={formHeaderClass}>
            <div>
              <h3 className="font-semibold text-neutral-900">Shipping Charge Slabs</h3>
              <p className="mt-1 text-sm text-neutral-500">
                Higher order values use the matching slab. Slabs are sorted by order amount.
              </p>
            </div>
            <button type="button" onClick={addSlab} className={btnPrimary}>
              Add Slab
            </button>
          </div>

          <div className="space-y-3">
            {form.shippingSlabs.map((slab, index) => (
              <div
                key={`slab-${index}`}
                className="grid gap-3 rounded-lg border border-neutral-200 p-4 sm:grid-cols-[1fr_1fr_auto]"
              >
                <div>
                  <label className={labelClass}>Order Amount (£)</label>
                  <input
                    type="number"
                    min="0"
                    required
                    className={inputClass}
                    value={slab.orderAmount}
                    onChange={(e) => updateSlab(index, "orderAmount", e.target.value)}
                  />
                </div>
                <div>
                  <label className={labelClass}>Shipping Charge (£)</label>
                  <input
                    type="number"
                    min="0"
                    required
                    className={inputClass}
                    value={slab.shippingCharge}
                    onChange={(e) => updateSlab(index, "shippingCharge", e.target.value)}
                  />
                </div>
                <div className="flex items-end">
                  <button
                    type="button"
                    onClick={() => removeSlab(index)}
                    disabled={form.shippingSlabs.length <= 1}
                    className="rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <SectionSaveButton section="slabs" />
        </div>

        <div
          className={`${cardClass} space-y-5 ${
            dirtySections.cart ? "ring-2 ring-amber-200" : ""
          }`}
        >
          <div>
            <h3 className="font-semibold text-neutral-900">Cart Important Messages</h3>
            <p className="mt-1 text-sm text-neutral-500">
              One line per bullet. Use placeholders: {"{{minOrder}}"}, {"{{minShipping}}"}.
            </p>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <div>
              <label className={labelClass}>English bullets</label>
              <textarea
                rows={8}
                className={inputClass}
                value={form.cartNoticeEn}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, cartNoticeEn: e.target.value }))
                }
              />
            </div>
            <div>
              <label className={labelClass}>Hindi bullets</label>
              <textarea
                rows={8}
                className={inputClass}
                value={form.cartNoticeHi}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, cartNoticeHi: e.target.value }))
                }
              />
            </div>
          </div>

          <SectionSaveButton section="cart" />
        </div>
      </div>

      {/* Meta Ads Product Catalog Feed Section */}
      <div className={cardClass}>
        <div className={formHeaderClass}>
          <div>
            <h3 className="text-base font-semibold text-neutral-900">
              Meta Ads &amp; Commerce Product Feed
            </h3>
            <p className="text-xs text-neutral-500">
              Use these API feed URLs to sync your active products into Facebook &amp; Instagram Ads Catalog Manager (Advantage+ Catalog).
            </p>
          </div>
        </div>

        <div className="p-4 space-y-4">
          {metaAdsLoading ? (
            <p className="text-sm text-neutral-500">Loading catalog feed status…</p>
          ) : (
            <div className="space-y-4">
              <div className="flex flex-wrap gap-4 items-center justify-between rounded-md bg-blue-50 border border-blue-200 p-3 text-xs text-blue-900">
                <div>
                  <span className="font-semibold">Active Products in Feed:</span>{" "}
                  {metaAdsSummary?.total_active_products ?? "—"} total ({metaAdsSummary?.total_instock_products ?? "—"} in stock)
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                    RSS 2.0 XML / CSV / JSON
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className={labelClass}>Meta Catalog XML Feed URL (Recommended for Meta Commerce Manager)</label>
                    {copiedFormat === "xml" && (
                      <span className="text-xs text-green-600 font-medium">Copied!</span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      readOnly
                      className={`${inputClass} font-mono text-xs bg-neutral-50`}
                      value={metaAdsSummary?.feed_urls?.xml_feed || "https://api.bulkmobilemart.in/api/meta-ads/catalog.xml"}
                    />
                    <button
                      type="button"
                      onClick={() => copyToClipboard(metaAdsSummary?.feed_urls?.xml_feed || "https://api.bulkmobilemart.in/api/meta-ads/catalog.xml", "xml")}
                      className="px-3 py-1.5 bg-neutral-900 text-white rounded text-xs hover:bg-neutral-800 transition"
                    >
                      Copy XML
                    </button>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className={labelClass}>Meta Catalog CSV Feed URL</label>
                    {copiedFormat === "csv" && (
                      <span className="text-xs text-green-600 font-medium">Copied!</span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      readOnly
                      className={`${inputClass} font-mono text-xs bg-neutral-50`}
                      value={metaAdsSummary?.feed_urls?.csv_feed || "https://api.bulkmobilemart.in/api/meta-ads/catalog.csv"}
                    />
                    <button
                      type="button"
                      onClick={() => copyToClipboard(metaAdsSummary?.feed_urls?.csv_feed || "https://api.bulkmobilemart.in/api/meta-ads/catalog.csv", "csv")}
                      className="px-3 py-1.5 bg-neutral-900 text-white rounded text-xs hover:bg-neutral-800 transition"
                    >
                      Copy CSV
                    </button>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className={labelClass}>JSON API Endpoint</label>
                    {copiedFormat === "json" && (
                      <span className="text-xs text-green-600 font-medium">Copied!</span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      readOnly
                      className={`${inputClass} font-mono text-xs bg-neutral-50`}
                      value={metaAdsSummary?.feed_urls?.json_feed || "https://api.bulkmobilemart.in/api/meta-ads/catalog.json"}
                    />
                    <button
                      type="button"
                      onClick={() => copyToClipboard(metaAdsSummary?.feed_urls?.json_feed || "https://api.bulkmobilemart.in/api/meta-ads/catalog.json", "json")}
                      className="px-3 py-1.5 bg-neutral-900 text-white rounded text-xs hover:bg-neutral-800 transition"
                    >
                      Copy JSON
                    </button>
                  </div>
                </div>
              </div>

              <div className="text-xs text-neutral-600 bg-neutral-50 p-3 rounded border border-neutral-200">
                <p className="font-semibold text-neutral-800 mb-1">Setup Instructions for Meta Commerce Manager:</p>
                <ol className="list-decimal list-inside space-y-1">
                  <li>Go to <strong>Meta Commerce Manager</strong> &gt; <strong>Catalogs</strong> &gt; <strong>Data Sources</strong>.</li>
                  <li>Select <strong>Add Items</strong> &gt; <strong>Data Feed</strong> &gt; <strong>Scheduled Feed</strong>.</li>
                  <li>Paste the <strong>XML Feed URL</strong> above into the Data Feed URL field.</li>
                  <li>Set update frequency (e.g., Daily or Hourly) to automatically sync prices and inventory with Meta Ads.</li>
                </ol>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default StoreSettingsSection;
