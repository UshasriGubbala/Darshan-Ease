import express from "express";
import Temple from "../models/Temple.js";
import Pooja from "../models/Pooja.js";
import DarshanSlot from "../models/DarshanSlot.js";

const router = express.Router();

// @route GET /api/temples  (list, ?featured=true)
router.get("/", async (req, res) => {
  try {
    const filter = { isActive: true };
    if (req.query.featured === "true") filter.featured = true;
    const temples = await Temple.find(filter).sort({ createdAt: -1 });
    res.json(temples);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route GET /api/temples/:id
router.get("/:id", async (req, res) => {
  try {
    const temple = await Temple.findById(req.params.id);
    if (!temple) return res.status(404).json({ message: "Temple not found" });
    res.json(temple);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route GET /api/temples/:id/poojas
router.get("/:id/poojas", async (req, res) => {
  try {
    const poojas = await Pooja.find({ temple: req.params.id, isActive: true });
    res.json(poojas);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route GET /api/temples/:id/slots?date=YYYY-MM-DD
router.get("/:id/slots", async (req, res) => {
  try {
    const filter = { temple: req.params.id, isActive: true };
    if (req.query.date) filter.date = req.query.date;
    const slots = await DarshanSlot.find(filter).sort({ startTime: 1 });
    res.json(slots);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
