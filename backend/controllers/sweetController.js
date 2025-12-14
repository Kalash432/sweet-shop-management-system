const Sweet = require("../models/sweet");

/* ================================
   GET all sweets
================================ */
exports.getSweets = async (req, res) => {
  try {
    const sweets = await Sweet.find();
    res.status(200).json(sweets);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch sweets" });
  }
};

/* ================================
   ADD sweet (image REQUIRED)
================================ */
exports.addSweet = async (req, res) => {
  try {
    const { name, category, price, quantity } = req.body;

    if (!name || !category || !price || !quantity) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Image is required" });
    }

    const sweet = await Sweet.create({
      name,
      category,
      price: Number(price),
      quantity: Number(quantity),
      image: `/uploads/${req.file.filename}`,
    });

    res.status(201).json(sweet);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================================
   SEARCH sweets
================================ */
exports.searchSweets = async (req, res) => {
  try {
    const { name, category, minPrice, maxPrice } = req.query;

    let query = {};

    if (name) query.name = { $regex: name, $options: "i" };
    if (category) query.category = { $regex: category, $options: "i" };

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    const sweets = await Sweet.find(query);
    res.json(sweets);
  } catch (err) {
    res.status(500).json({ message: "Search failed" });
  }
};

/* ================================
   UPDATE sweet (image OPTIONAL)
================================ */
exports.updateSweet = async (req, res) => {
  try {
    const { name, category, price, quantity } = req.body;

    let updateData = {};

    if (name) updateData.name = name;
    if (category) updateData.category = category;
    if (price) updateData.price = Number(price);
    if (quantity) updateData.quantity = Number(quantity);

    // image optional
    if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`;
    }

    const sweet = await Sweet.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!sweet) {
      return res.status(404).json({ message: "Sweet not found" });
    }

    res.json(sweet);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================================
   DELETE sweet
================================ */
exports.deleteSweet = async (req, res) => {
  try {
    const sweet = await Sweet.findById(req.params.id);

    if (!sweet) {
      return res.status(404).json({ message: "Sweet not found" });
    }

    await sweet.deleteOne();
    res.json({ message: "Sweet deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed" });
  }
};

/* ================================
   PURCHASE sweet (quantity -1)
================================ */
exports.purchaseSweet = async (req, res) => {
  try {
    const sweet = await Sweet.findById(req.params.id);

    if (!sweet) {
      return res.status(404).json({ message: "Sweet not found" });
    }

    if (sweet.quantity <= 0) {
      return res.status(400).json({ message: "Out of stock" });
    }

    sweet.quantity -= 1;
    await sweet.save();

    res.json(sweet);
  } catch (err) {
    res.status(500).json({ message: "Purchase failed" });
  }
};

/* ================================
   RESTOCK sweet (quantity +)
================================ */
exports.restockSweet = async (req, res) => {
  try {
    const { quantity } = req.body;

    if (!quantity || quantity <= 0) {
      return res.status(400).json({ message: "Invalid quantity" });
    }

    const sweet = await Sweet.findById(req.params.id);

    if (!sweet) {
      return res.status(404).json({ message: "Sweet not found" });
    }

    sweet.quantity += Number(quantity);
    await sweet.save();

    res.json(sweet);
  } catch (err) {
    res.status(500).json({ message: "Restock failed" });
  }
};
