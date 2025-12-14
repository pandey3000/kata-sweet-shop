import Sweet from "../models/Sweet.js";

// @desc    Create a new sweet
// @route   POST /api/sweets
// @access  Private
export const createSweet = async (req, res) => {
  const { name, category, price, quantity } = req.body;

  try {
    const sweet = new Sweet({
      name,
      category,
      price,
      quantity,
    });

    const createdSweet = await sweet.save();
    res.status(201).json(createdSweet);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get all sweets
// @route   GET /api/sweets
// @access  Private
export const getSweets = async (req, res) => {
  try {
    const sweets = await Sweet.find({});
    res.json(sweets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Search sweets by name or category
// @route   GET /api/sweets/search?query=...
// @access  Private
export const searchSweets = async (req, res) => {
  const { query } = req.query;
  try {
    const keyword = query
      ? {
          $or: [
            { name: { $regex: query, $options: "i" } },
            { category: { $regex: query, $options: "i" } },
          ],
        }
      : {};

    const sweets = await Sweet.find({ ...keyword });
    res.json(sweets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a sweet
// @route   PUT /api/sweets/:id
// @access  Private
export const updateSweet = async (req, res) => {
  try {
    const sweet = await Sweet.findById(req.params.id);

    if (sweet) {
      sweet.name = req.body.name || sweet.name;
      sweet.category = req.body.category || sweet.category;
      sweet.price = req.body.price || sweet.price;
      sweet.quantity = req.body.quantity || sweet.quantity;

      const updatedSweet = await sweet.save();
      res.json(updatedSweet);
    } else {
      res.status(404).json({ message: "Sweet not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a sweet
// @route   DELETE /api/sweets/:id
// @access  Private/Admin
export const deleteSweet = async (req, res) => {
  try {
    const sweet = await Sweet.findById(req.params.id);

    if (sweet) {
      await sweet.deleteOne();
      res.json({ message: "Sweet removed" });
    } else {
      res.status(404).json({ message: "Sweet not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ... existing functions ...

// @desc    Purchase a sweet
// @route   POST /api/sweets/:id/purchase
// @access  Private
export const purchaseSweet = async (req, res) => {
  try {
    const sweet = await Sweet.findById(req.params.id);
    const qtyToBuy = req.body.quantity || 1;

    if (!sweet) {
      return res.status(404).json({ message: "Sweet not found" });
    }

    if (sweet.quantity >= qtyToBuy) {
      sweet.quantity -= qtyToBuy;
      const updatedSweet = await sweet.save();
      res.json(updatedSweet);
    } else {
      res.status(400).json({ message: "Sweet is out of stock" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Restock a sweet
// @route   POST /api/sweets/:id/restock
// @access  Private/Admin
export const restockSweet = async (req, res) => {
  try {
    const sweet = await Sweet.findById(req.params.id);
    const qtyToAdd = req.body.quantity || 1;

    if (sweet) {
      sweet.quantity += qtyToAdd;
      const updatedSweet = await sweet.save();
      res.json(updatedSweet);
    } else {
      res.status(404).json({ message: "Sweet not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
