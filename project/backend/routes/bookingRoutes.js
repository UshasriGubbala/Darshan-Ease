import express from "express";
import { v4 as uuidv4 } from "uuid";
import QRCode from "qrcode";
import Booking from "../models/Booking.js";
import DarshanSlot from "../models/DarshanSlot.js";
import Pooja from "../models/Pooja.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// @route POST /api/bookings  (create a booking)
router.post("/", protect, async (req, res) => {
  try {
    const { templeId, slotId, poojaId, devotees, contactEmail, contactPhone } = req.body;

    if (!templeId || !slotId || !devotees?.length || !contactEmail || !contactPhone) {
      return res.status(400).json({ message: "Missing required booking details" });
    }

    const slot = await DarshanSlot.findById(slotId);
    if (!slot || !slot.isActive) return res.status(404).json({ message: "Slot not found" });

    const requested = devotees.length;
    if (slot.bookedCount + requested > slot.capacity) {
      return res.status(400).json({ message: "Not enough seats available in this slot" });
    }

    let amount = 0;
    let pooja = null;
    if (poojaId) {
      pooja = await Pooja.findById(poojaId);
      if (pooja) amount = pooja.price * requested;
    }

    const bookingCode = `TB-${uuidv4().split("-")[0].toUpperCase()}`;
    const qrPayload = JSON.stringify({ code: bookingCode, temple: templeId, date: slot.date });
    const qrCode = await QRCode.toDataURL(qrPayload);

    const booking = await Booking.create({
      bookingCode,
      user: req.user._id,
      temple: templeId,
      slot: slotId,
      pooja: poojaId || null,
      devotees,
      contactEmail,
      contactPhone,
      date: slot.date,
      amount,
      qrCode,
    });

    slot.bookedCount += requested;
    await slot.save();

    res.status(201).json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route GET /api/bookings/my
router.get("/my", protect, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate("temple", "name location image")
      .populate("pooja", "name price")
      .populate("slot", "date startTime endTime")
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route GET /api/bookings/:id
router.get("/:id", protect, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("temple", "name location image")
      .populate("pooja", "name price")
      .populate("slot", "date startTime endTime");
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    if (String(booking.user) !== String(req.user._id) && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to view this booking" });
    }
    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route PUT /api/bookings/:id/cancel
router.put("/:id/cancel", protect, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    if (String(booking.user) !== String(req.user._id) && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to cancel this booking" });
    }
    if (booking.status === "cancelled") {
      return res.status(400).json({ message: "Booking is already cancelled" });
    }

    booking.status = "cancelled";
    await booking.save();

    const slot = await DarshanSlot.findById(booking.slot);
    if (slot) {
      slot.bookedCount = Math.max(slot.bookedCount - booking.devotees.length, 0);
      await slot.save();
    }

    res.json({ message: "Booking cancelled", booking });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
