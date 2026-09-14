import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { addWhatsRightForYouItem, updateWhatsRightForYouItem } from "../../../api/api";
import AdminAlert from "../AdminAlert";
import ImagePicker from "../ImagePicker";
import { UPLOAD_FOLDERS } from "../../../utils/uploadFolders";
import {
  btnPrimary,
  btnSecondary,
  cardClass,
  formHeaderClass,
  inputClass,
  labelClass,
} from "../adminStyles";

const EMPTY_FORM = {
  title: "",
  description: "",
  imageUrl: "",
  order: 0,
  isActive: true,
};

function AddWhatsRightForYouSection() {
  const navigate = useNavigate();
  const location = useLocation();
  const editItem = location.state?.editWhatsRightForYouItem;

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    if (editItem) {
      setEditingId(editItem._id);
      setForm({
        title: editItem.title,
        description: editItem.description,
        imageUrl: editItem.imageUrl,
        order: editItem.order ?? 0,
        isActive: editItem.isActive,
      });
    }
  }, [editItem]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError("");
      setSuccess("");
      const payload = {
        title: form.title,
        description: form.description,
        imageUrl: form.imageUrl,
        order: Number(form.order) || 0,
        isActive: form.isActive,
      };

      if (editingId) {
        await updateWhatsRightForYouItem(editingId, payload);
        setSuccess("Item updated");
      } else {
        await addWhatsRightForYouItem(payload);
        setSuccess("Item added");
      }

      setForm(EMPTY_FORM);
      setEditingId(null);
      navigate("/whats-right-for-you/show", { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save item");
    }
  };

  const handleCancel = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
    navigate("/whats-right-for-you/show");
  };

  return (
    <div className="min-w-0">
      <AdminAlert error={error} success={success} onClear={() => setError("")} />

      <form onSubmit={handleSubmit} className={`${cardClass} space-y-4`}>
        <div className={formHeaderClass}>
          <h3 className="font-semibold">
            {editingId ? "Edit What's Right for You Item" : "Add What's Right for You Item"}
          </h3>
          {editingId && (
            <button type="button" onClick={handleCancel} className={btnSecondary}>
              Cancel
            </button>
          )}
        </div>

        <div>
          <label className={labelClass}>Title *</label>
          <input
            type="text"
            required
            placeholder="Beginner-friendly disposables"
            value={form.title}
            onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>Description *</label>
          <textarea
            required
            rows={4}
            placeholder="Short guide text to help customers choose..."
            value={form.description}
            onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
            className={inputClass}
          />
        </div>

        <ImagePicker
          label="Image"
          folder={UPLOAD_FOLDERS.WHATS_RIGHT_FOR_YOU}
          required
          value={form.imageUrl}
          onChange={(url) => setForm((p) => ({ ...p, imageUrl: url }))}
        />

        <div>
          <label className={labelClass}>Display order</label>
          <input
            type="number"
            min={0}
            value={form.order}
            onChange={(e) => setForm((p) => ({ ...p, order: e.target.value }))}
            className={inputClass}
          />
        </div>

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.isActive}
            onChange={(e) => setForm((p) => ({ ...p, isActive: e.target.checked }))}
            className="h-4 w-4 accent-primary"
          />
          Active (visible on the page)
        </label>

        <button type="submit" className={btnPrimary}>
          {editingId ? "Update Item" : "Add Item"}
        </button>
      </form>
    </div>
  );
}

export default AddWhatsRightForYouSection;
