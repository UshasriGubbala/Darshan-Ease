import mongoose from "mongoose";

const darshanSlotSchema = new mongoose.Schema(
  {
    temple: { type: mongoose.Schema.Types.ObjectId, ref: "Temple", required: true },
    date: { type: String, required: true }, // YYYY-MM-DD
    startTime: { type: String, required: true }, // HH:mm
    endTime: { type: String, required: true },
    capacity: { type: Number, required: true, default: 50 },
    bookedCount: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

darshanSlotSchema.virtual("available").get(function () {
  return Math.max(this.capacity - this.bookedCount, 0);
});
darshanSlotSchema.set("toJSON", { virtuals: true });

export default mongoose.model("DarshanSlot", darshanSlotSchema);
