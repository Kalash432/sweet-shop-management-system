const express = require("express");
const upload = require("../middleware/upload");
const { protect } = require("../middleware/authMiddleware");

const {
  getSweets,
  addSweet,
  searchSweets,
  updateSweet,
  deleteSweet,
  purchaseSweet,
  restockSweet,
} = require("../controllers/sweetController");

const router = express.Router();

/**
 * GET all sweets
 */
router.get("/", protect, getSweets);

/**
 * ADD sweet (with image)
 */
router.post(
  "/",
  protect,
  upload.single("image"),
  addSweet
);

/**
 * SEARCH sweets
 */
router.get("/search", protect, searchSweets);

/**
 * ✅ UPDATE sweet (image OPTIONAL)
 * Supports updating name, price, quantity, category, image
 */
router.put(
  "/:id",
  protect,
  upload.single("image"),
  updateSweet
);

/**
 * DELETE sweet
 */
router.delete("/:id", protect, deleteSweet);

/**
 * PURCHASE sweet (reduce quantity)
 */
router.post("/:id/purchase", protect, purchaseSweet);

/**
 * RESTOCK sweet (increase quantity)
 */
router.post("/:id/restock", protect, restockSweet);

module.exports = router;
