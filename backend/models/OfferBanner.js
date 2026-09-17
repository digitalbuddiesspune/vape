import mongoose from "mongoose";

const offerBannerSchema = new mongoose.Schema(
  {
    imageUrl: {
      type: String,
      required: [true, "Image URL is required"],
      trim: true,
    },
    title: {
      type: String,
      default: "",
      trim: true,
      maxlength: 120,
    },
    titleHighlight: {
      type: String,
      default: "",
      trim: true,
      maxlength: 80,
    },
    subtitle: {
      type: String,
      default: "",
      trim: true,
      maxlength: 200,
    },
    linkUrl: {
      type: String,
      default: "",
      trim: true,
    },
    alt: {
      type: String,
      default: "VapeHub offer banner",
      trim: true,
    },
    order: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    device: {
      type: String,
      enum: ["desktop", "mobile"],
      default: "mobile",
    },
  },
  { timestamps: true }
);

const OfferBanner = mongoose.model("OfferBanner", offerBannerSchema);

export default OfferBanner;
