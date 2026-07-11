import dotenv from "dotenv";
import connectDB from "./config/db.js";
import User from "./models/User.js";
import Temple from "./models/Temple.js";
import Pooja from "./models/Pooja.js";
import DarshanSlot from "./models/DarshanSlot.js";

dotenv.config();
await connectDB();

const run = async () => {
  console.log("Clearing existing data...");
  await Promise.all([
    User.deleteMany({}),
    Temple.deleteMany({}),
    Pooja.deleteMany({}),
    DarshanSlot.deleteMany({}),
  ]);

  console.log("Creating admin user...");
  await User.create({
    name: "Admin",
    email: "admin@temple.com",
    password: "admin123",
    role: "admin",
  });

  console.log("Creating temples...");
  const temples = await Temple.insertMany([
    {
      name: "Sri Venkateswara Temple",
      location: "Tirupati, Andhra Pradesh",
      description: "One of the most visited pilgrimage sites, dedicated to Lord Venkateswara.",
      deity: "Lord Venkateswara",
      image: "https://images.unsplash.com/photo-1600100397608-f43f5a2f5d6b?w=800",
      openingTime: "05:00",
      closingTime: "21:30",
      featured: true,
    },
    {
      name: "Kashi Vishwanath Temple",
      location: "Varanasi, Uttar Pradesh",
      description: "An ancient temple dedicated to Lord Shiva on the banks of the Ganges.",
      deity: "Lord Shiva",
      image: "https://images.unsplash.com/photo-1561361058-c24cecae35ca?w=800",
      openingTime: "04:00",
      closingTime: "23:00",
      featured: true,
    },
    {
      name: "Meenakshi Amman Temple",
      location: "Madurai, Tamil Nadu",
      description: "A historic temple dedicated to Goddess Meenakshi and Lord Sundareswarar.",
      deity: "Goddess Meenakshi",
      image: "https://images.unsplash.com/photo-1590766940554-153fac2b7b95?w=800",
      openingTime: "05:00",
      closingTime: "21:00",
      featured: true,
    },
  ]);

  console.log("Creating poojas...");
  for (const temple of temples) {
    await Pooja.insertMany([
      { temple: temple._id, name: "Archana", description: "Basic ritual worship", price: 100, durationMinutes: 15 },
      { temple: temple._id, name: "Abhishekam", description: "Sacred bathing ritual", price: 500, durationMinutes: 45 },
      { temple: temple._id, name: "Special Darshan", description: "Priority queue darshan", price: 300, durationMinutes: 20 },
    ]);
  }

  console.log("Creating darshan slots for the next 7 days...");
  const today = new Date();
  const slotTimes = [
    ["06:00", "07:00"],
    ["08:00", "09:00"],
    ["10:00", "11:00"],
    ["16:00", "17:00"],
    ["18:00", "19:00"],
  ];

  for (const temple of temples) {
    for (let d = 0; d < 7; d++) {
      const date = new Date(today);
      date.setDate(today.getDate() + d);
      const dateStr = date.toISOString().split("T")[0];
      const slotDocs = slotTimes.map(([startTime, endTime]) => ({
        temple: temple._id,
        date: dateStr,
        startTime,
        endTime,
        capacity: 50,
      }));
      await DarshanSlot.insertMany(slotDocs);
    }
  }

  console.log("Seed complete.");
  console.log("Admin login -> email: admin@temple.com | password: admin123");
  process.exit(0);
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
