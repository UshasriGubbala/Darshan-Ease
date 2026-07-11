import express from "express";
import Temple from "../models/Temple.js";
import Pooja from "../models/Pooja.js";
import DarshanSlot from "../models/DarshanSlot.js";
import Booking from "../models/Booking.js";
import User from "../models/User.js";
import { protect, adminOnly } from "../middleware/auth.js";
import upload from "../middleware/upload.js";

const router = express.Router();

router.use(protect, adminOnly);

/* ---------- Photo upload ---------- */
// @route POST /api/admin/upload  (multipart form field name: "photo")
router.post("/upload", (req, res) => {
  upload.single("photo")(req, res, (err) => {
    if (err) return res.status(400).json({ message: err.message });
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });
    const url = `/uploads/${req.file.filename}`;
    res.status(201).json({ url });
  });
});

/* ---------- Temples ---------- */
router.post("/temples", async (req, res) => {
  try {
    const temple = await Temple.create(req.body);
    res.status(201).json(temple);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/temples", async (req, res) => {
  const temples = await Temple.find().sort({ createdAt: -1 });
  res.json(temples);
});

router.put("/temples/:id", async (req, res) => {
  try {
    const temple = await Temple.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!temple) return res.status(404).json({ message: "Temple not found" });
    res.json(temple);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete("/temples/:id", async (req, res) => {
  await Temple.findByIdAndDelete(req.params.id);
  res.json({ message: "Temple removed" });
});

/* ---------- Poojas ---------- */
router.post("/poojas", async (req, res) => {
  try {
    const pooja = await Pooja.create(req.body);
    res.status(201).json(pooja);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/poojas", async (req, res) => {
  const filter = {};
  if (req.query.temple) filter.temple = req.query.temple;
  const poojas = await Pooja.find(filter).populate("temple", "name");
  res.json(poojas);
});

router.put("/poojas/:id", async (req, res) => {
  const pooja = await Pooja.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!pooja) return res.status(404).json({ message: "Pooja not found" });
  res.json(pooja);
});

router.delete("/poojas/:id", async (req, res) => {
  await Pooja.findByIdAndDelete(req.params.id);
  res.json({ message: "Pooja removed" });
});

/* ---------- Darshan Slots ---------- */
router.post("/slots", async (req, res) => {
  try {
    const slot = await DarshanSlot.create(req.body);
    res.status(201).json(slot);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/slots", async (req, res) => {
  const filter = {};
  if (req.query.temple) filter.temple = req.query.temple;
  const slots = await DarshanSlot.find(filter).populate("temple", "name").sort({ date: 1, startTime: 1 });
  res.json(slots);
});

router.put("/slots/:id", async (req, res) => {
  const slot = await DarshanSlot.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!slot) return res.status(404).json({ message: "Slot not found" });
  res.json(slot);
});

router.delete("/slots/:id", async (req, res) => {
  await DarshanSlot.findByIdAndDelete(req.params.id);
  res.json({ message: "Slot removed" });
});

/* ---------- Bookings ---------- */
router.get("/bookings", async (req, res) => {
  const bookings = await Booking.find()
    .populate("user", "name email")
    .populate("temple", "name")
    .populate("pooja", "name")
    .populate("slot", "date startTime endTime")
    .sort({ createdAt: -1 });
  res.json(bookings);
});

router.put("/bookings/:id/status", async (req, res) => {
  const { status } = req.body;
  const booking = await Booking.findByIdAndUpdate(req.params.id, { status }, { new: true });
  if (!booking) return res.status(404).json({ message: "Booking not found" });
  res.json(booking);
});

/* ---------- Users ---------- */
router.get("/users", async (req, res) => {
  const users = await User.find().select("-password").sort({ createdAt: -1 });
  res.json(users);
});

router.put("/users/:id/role", async (req, res) => {
  const { role } = req.body;
  if (!["user", "admin"].includes(role)) return res.status(400).json({ message: "Invalid role" });
  const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true }).select("-password");
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(user);
});

router.delete("/users/:id", async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: "User removed" });
});

/* ---------- Reports / Analytics ---------- */
router.get("/reports/summary", async (req, res) => {
  const [totalTemples, totalUsers, totalBookings, cancelledBookings] = await Promise.all([
    Temple.countDocuments(),
    User.countDocuments({ role: "user" }),
    Booking.countDocuments(),
    Booking.countDocuments({ status: "cancelled" }),
  ]);

  const revenueAgg = await Booking.aggregate([
    { $match: { status: { $ne: "cancelled" } } },
    { $group: { _id: null, total: { $sum: "$amount" } } },
  ]);

  const bookingsByTemple = await Booking.aggregate([
    { $group: { _id: "$temple", count: { $sum: 1 } } },
    { $lookup: { from: "temples", localField: "_id", foreignField: "_id", as: "temple" } },
    { $unwind: "$temple" },
    { $project: { name: "$temple.name", count: 1 } },
    { $sort: { count: -1 } },
  ]);

  const bookingsByDate = await Booking.aggregate([
    { $group: { _id: "$date", count: { $sum: 1 } } },
    { $sort: { _id: 1 } },
    { $limit: 30 },
  ]);

  res.json({
    totalTemples,
    totalUsers,
    totalBookings,
    cancelledBookings,
    totalRevenue: revenueAgg[0]?.total || 0,
    bookingsByTemple,
    bookingsByDate,
  });
});

export default router;
