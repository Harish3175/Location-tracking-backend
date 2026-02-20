const express = require("express");
const router = express.Router();

const Block = require("../models/block.cjs");
const Record = require("../models/Record.cjs");

const { authMiddleware, adminOnly } = require("../middleware/authMiddleware.cjs");
const forcePasswordMiddleware = require("../middleware/forcePasswordMiddleware.cjs");


/* ================= SCAN ================= */

router.post("/scan", authMiddleware, async (req, res) => {
  const { blockId, lineId, operatorId, location } = req.body;

  try {
    if (!blockId || !lineId || !operatorId) {
      return res.status(400).json({ message: "Missing scan data" });
    }

    const block = await Block.findOne({ blockId });

    if (!block) {
      return res.status(404).json({ message: "Block not found" });
    }

    const running = await Record.findOne({
      blockId,
      status: "RUNNING",
    });

    /* ================= START ================= */

    if (!running) {
      const record = await Record.create({
        blockId,
        lineId,
        productID: block.productID || "",
        productName: block.blockNames[0] || "",
        operatorIn: operatorId,
        startTime: new Date(),
        lastLocation: location || lineId,
        status: "RUNNING",
      });

      return res.json({ message: "Process started", record });
    }

    /* ================= END ================= */

    running.operatorOut = operatorId;
    running.endTime = new Date();
    running.lastLocation = location || lineId;
    running.productID = block.productID || "";
    running.productName = block.blockNames[0] || "";
    running.status = "COMPLETED";

    await running.save();

    /* ===== AUTO DELETE: KEEP LAST 5 ===== */

    const allRecords = await Record.find({ blockId })
      .sort({ createdAt: -1 });

    if (allRecords.length > 5) {
      const deleteIds = allRecords.slice(5).map(r => r._id);
      await Record.deleteMany({ _id: { $in: deleteIds } });
    }

    res.json({ message: "Process completed", record: running });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});


/* ================= ALL RECORDS ================= */

router.get("/",authMiddleware, async (req, res) => {
  try {

    // Operator → only latest record
    if (req.user.role === "operator") {
      const last = await Record.findOne()
        .sort({ createdAt: -1 });

      return res.json(last ? [last] : []);
    }

    // Admin → latest 200 only (FAST)
    const records = await Record.find()
      .sort({ createdAt: -1 })
      .limit(200);

    res.json(records);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


/* ================= RUNNING ================= */

router.get("/running", async (req, res) => {
  try {
    const running = await Record.find({ status: "RUNNING" })
      .sort({ createdAt: -1 });

    res.json(running);
  } catch (err) {
    res.status(500).json([]);
  }
});


/* ================= DELETE (ADMIN) ================= */

router.delete("/:id", authMiddleware, adminOnly, async (req, res) => {
  try {
    await Record.findByIdAndDelete(req.params.id);
    res.json({ message: "Record deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


/* ================= LATEST BY LINE ================= */

router.get("/line/:line", async (req, res) => {
  try {
    const line = req.params.line.toLowerCase().trim();

    // 1️⃣ get ALL records (latest first)
    const records = await Record.find().sort({ createdAt: -1 }).limit(200);

    // 2️⃣ keep ONLY latest record per blockId
    const latest = {};
    records.forEach(r => {
      if (!latest[r.blockId]) {
        latest[r.blockId] = r;
      }
    });

    // 3️⃣ get ALL blocks (master data)
    const blocks = await Block.find();

    // 4️⃣ merge block + record
    const merged = blocks.map(b => {
      const rec = latest[b.blockId];

      return {
        blockId: b.blockId,
        productName: rec?.productName || b.blockNames?.[0] || "",
        lastLocation: rec?.lastLocation || b.defaultLocation,
        status: rec?.status || "IDLE"
      };
    });

    // 5️⃣ filter by selected line
    const result = merged.filter(b =>
      b.lastLocation?.toLowerCase().includes(line)
    );

    res.json(result);

  } catch (err) {
    console.error(err);
    res.status(500).json([]);
  }
});


module.exports = router;