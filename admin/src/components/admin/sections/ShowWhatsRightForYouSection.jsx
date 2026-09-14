import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  deleteWhatsRightForYouItem,
  getAllWhatsRightForYouItems,
} from "../../../api/api";
import AdminAlert from "../AdminAlert";
import AdminPagination, { ADMIN_PAGE_SIZE } from "../AdminPagination";
import { IconEdit, IconTrash } from "../AdminIcons";
import {
  adminCompactTableClass,
  adminCompactTdClass,
  adminCompactThClass,
  adminTableHeaderClass,
  adminTableWrapperClass,
  btnPrimary,
  iconBtnClass,
  iconBtnDangerClass,
  pageHeaderActionsClass,
  pageHeaderClass,
} from "../adminStyles";

function ShowWhatsRightForYouSection() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: ADMIN_PAGE_SIZE,
    total: 0,
    totalPages: 1,
  });

  const fetchItems = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const { data } = await getAllWhatsRightForYouItems({ page, limit: ADMIN_PAGE_SIZE });
      setItems(data.data || []);
      setPagination(
        data.pagination || {
          page,
          limit: ADMIN_PAGE_SIZE,
          total: data.data?.length || 0,
          totalPages: 1,
        }
      );
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load items");
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const handleEdit = (item) => {
    navigate("/whats-right-for-you/add", { state: { editWhatsRightForYouItem: item } });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this item?")) return;
    try {
      setError("");
      setSuccess("");
      await deleteWhatsRightForYouItem(id);
      setSuccess("Item deleted");
      const nextPage = items.length === 1 && page > 1 ? page - 1 : page;
      if (nextPage !== page) setPage(nextPage);
      else fetchItems();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete item");
    }
  };

  return (
    <div className="min-w-0">
      <AdminAlert error={error} success={success} onClear={() => setError("")} />

      <div className={pageHeaderClass}>
        <p className="text-sm font-medium text-neutral-700">
          What&apos;s Right for You ({pagination.total})
        </p>
        <div className={pageHeaderActionsClass}>
          <button
            type="button"
            onClick={() => navigate("/whats-right-for-you/add")}
            className={btnPrimary}
          >
            Add Item
          </button>
        </div>
      </div>

      {loading ? (
        <p className="text-text-secondary">Loading...</p>
      ) : items.length === 0 ? (
        <p className="text-text-secondary">No items yet.</p>
      ) : (
        <div className={adminTableWrapperClass}>
          <table className={adminCompactTableClass}>
            <colgroup>
              <col className="w-[12%]" />
              <col className="w-[18%]" />
              <col className="w-[34%]" />
              <col className="w-[10%]" />
              <col className="w-[10%]" />
              <col className="w-[16%]" />
            </colgroup>
            <thead>
              <tr className={adminTableHeaderClass}>
                <th className={adminCompactThClass}>Image</th>
                <th className={adminCompactThClass}>Title</th>
                <th className={adminCompactThClass}>Description</th>
                <th className={adminCompactThClass}>Order</th>
                <th className={adminCompactThClass}>Status</th>
                <th className={adminCompactThClass}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr
                  key={item._id}
                  className="border-b border-neutral-100 last:border-0 hover:bg-neutral-50/50"
                >
                  <td className={adminCompactTdClass}>
                    <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-lg border border-neutral-200 bg-white">
                      {item.imageUrl ? (
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="text-[10px] text-neutral-400">No img</span>
                      )}
                    </div>
                  </td>
                  <td className={adminCompactTdClass}>
                    <span className="font-medium text-neutral-900">{item.title}</span>
                  </td>
                  <td className={adminCompactTdClass}>
                    <span className="line-clamp-2 text-neutral-600">{item.description}</span>
                  </td>
                  <td className={adminCompactTdClass}>{item.order ?? 0}</td>
                  <td className={adminCompactTdClass}>
                    <span
                      className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                        item.isActive
                          ? "bg-green-50 text-green-700"
                          : "bg-neutral-100 text-neutral-500"
                      }`}
                    >
                      {item.isActive ? "Active" : "Hidden"}
                    </span>
                  </td>
                  <td className={adminCompactTdClass}>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleEdit(item)}
                        className={iconBtnClass}
                        aria-label="Edit"
                      >
                        <IconEdit />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(item._id)}
                        className={iconBtnDangerClass}
                        aria-label="Delete"
                      >
                        <IconTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <AdminPagination pagination={pagination} onPageChange={setPage} />
    </div>
  );
}

export default ShowWhatsRightForYouSection;
