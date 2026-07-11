import mongoose from "mongoose";

const poojaSchema = new mongoose.Schema(
  {
    temple: { type: mongoose.Schema.Types.ObjectId, ref: "Temple", required: true },
    name: { type: String, required: true },
    description: { type: String, default: "" },
    price: { type: Number, required: true, default: 0 },
    durationMinutes: { type: Number, default: 30 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("Pooja", poojaSchema);
