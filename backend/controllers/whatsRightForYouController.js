import WhatsRightForYou from "../models/WhatsRightForYou.js";
import { buildPaginatedResponse, getPaginationParams } from "../utils/pagination.js";

export const getWhatsRightForYouItems = async (req, res) => {
  try {
    const items = await WhatsRightForYou.find({ isActive: true }).sort({
      order: 1,
      createdAt: -1,
    });
    res.status(200).json({ success: true, data: items });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllWhatsRightForYouItems = async (req, res) => {
  try {
    const { page, limit, skip } = getPaginationParams(req.query);
    const filter = {};
    const [total, items] = await Promise.all([
      WhatsRightForYou.countDocuments(filter),
      WhatsRightForYou.find(filter).sort({ order: 1, createdAt: -1 }).skip(skip).limit(limit),
    ]);

    res.status(200).json(buildPaginatedResponse(items, total, page, limit));
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getWhatsRightForYouItemById = async (req, res) => {
  try {
    const item = await WhatsRightForYou.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: "Item not found" });
    }
    res.status(200).json({ success: true, data: item });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const addWhatsRightForYouItem = async (req, res) => {
  try {
    const { title, description, imageUrl, order, isActive } = req.body;

    if (!title?.trim()) {
      return res.status(400).json({ success: false, message: "Title is required" });
    }
    if (!description?.trim()) {
      return res.status(400).json({ success: false, message: "Description is required" });
    }
    if (!imageUrl?.trim()) {
      return res.status(400).json({ success: false, message: "Image URL is required" });
    }

    const item = await WhatsRightForYou.create({
      title: title.trim(),
      description: description.trim(),
      imageUrl: imageUrl.trim(),
      order: order ?? 0,
      isActive: isActive ?? true,
    });

    res.status(201).json({ success: true, data: item });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateWhatsRightForYouItem = async (req, res) => {
  try {
    const { title, description, imageUrl, order, isActive } = req.body;
    const updates = {};

    if (title !== undefined) updates.title = title.trim();
    if (description !== undefined) updates.description = description.trim();
    if (imageUrl !== undefined) updates.imageUrl = imageUrl.trim();
    if (order !== undefined) updates.order = order;
    if (isActive !== undefined) updates.isActive = isActive;

    const item = await WhatsRightForYou.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    if (!item) {
      return res.status(404).json({ success: false, message: "Item not found" });
    }

    res.status(200).json({ success: true, data: item });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteWhatsRightForYouItem = async (req, res) => {
  try {
    const item = await WhatsRightForYou.findByIdAndDelete(req.params.id);

    if (!item) {
      return res.status(404).json({ success: false, message: "Item not found" });
    }

    res.status(200).json({ success: true, message: "Item deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
