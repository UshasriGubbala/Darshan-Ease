import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    bookingCode: { type: String, required: true, unique: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    temple: { type: mongoose.Schema.Types.ObjectId, ref: "Temple", required: true },
    slot: { type: mongoose.Schema.Types.ObjectId, ref: "DarshanSlot", required: true },
    pooja: { type: mongoose.Schema.Types.ObjectId, ref: "Pooja", default: null },
    devotees: [
      {
        name: { type: String, required: true },
        age: { type: Number },
        gender: { type: String },
      },
    ],
    contactEmail: { type: String, required: true },
    contactPhone: { type: String, required: true },
    date: { type: String, required: true },
    amount: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["confirmed", "cancelled", "completed"],
      default: "confirmed",
    },
    qrCode: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model("Booking", bookingSchema);
