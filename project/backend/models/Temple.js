import mongoose from "mongoose";

const templeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    location: { type: String, default: "", trim: true },
    description: { type: String, default: "" },
    deity: { type: String, default: "" },
    image: { type: String, default: "" },
    openingTime: { type: String, default: "06:00" },
    closingTime: { type: String, default: "20:00" },
    featured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("Temple", templeSchema);
