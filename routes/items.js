var express = require("express");
var router = express.Router();

const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const uniqid = require("uniqid");

const Item = require("../models/items");
const User = require("../models/users");

router.post("/upload", async (req, res) => {
  try {
    // check files
    if (!req.files || !req.files.photoFromFront) {
      return res
        .status(400)
        .json({ result: false, error: "Aucun fichier reçu" });
    }
    // save file in temp
    const photoPath = `./tmp/${uniqid()}.jpg`;
    await req.files.photoFromFront.mv(photoPath);

    // Upload to Cloudinary & delete file from temp
    const resultCloudinary = await cloudinary.uploader.upload(photoPath);
    fs.unlinkSync(photoPath);

    return res.json({
      result: true,
      original_url: resultCloudinary.secure_url,
      public_id: resultCloudinary.public_id,
    });
  } catch (error) {
    console.error("Erreur upload:", error);
    return res.status(500).json({ result: false, error: error.message });
  }
});

router.post("/removeBackground", async (req, res) => {
  try {
    const { cloudinaryPublicId } = req.body;
    if (!cloudinaryPublicId) {
      return res.status(400).json({ result: false, error: "Aucun ID reçu" });
    }
    // create new url with no background based on cloudinary url and ID
    const transformedUrl = cloudinary.url(cloudinaryPublicId, {
      transformation: [
        { effect: "background_removal" },
        { background: "white" },
      ],
      secure: true,
    });

    return res.status(200).json({
      result: true,
      message: "success with background removal",
      transformedUrl,
    });
  } catch (error) {
    return res.status(500).json({ result: false, error });
  }
});

router.post("/:token", async (req, res) => {
  try {
    const { itemPic, type, color, season, occasion, fabric } = req.body;

    // Find user by token (from URL param)
    const token = req.params.token;
    if (!token) {
      return res
        .status(400)
        .json({ result: false, error: "No token provided" });
    }

    const foundUser = await User.findOne({ token });
    if (!foundUser) {
      return res.status(404).json({ result: false, error: "User not found" });
    }

    // Basic validation
    if (!type && !itemPic) {
      return res.status(400).json({
        result: false,
        error: "Missing required field: type and itemPic",
      });
    }

    const newItem = new Item({
      user: foundUser._id,
      itemPic,
      type,
      color,
      season,
      occasion,
      fabric,
    });

    const savedItem = await newItem.save();

    return res.status(201).json({ result: true, item: savedItem });
  } catch (error) {
    console.error("Error creating item:", error);
    return res.status(500).json({ result: false, error: error.message });
  }
});

// get all items for a user by their token
router.get("/:token", async (req, res) => {
  try {
    const { token } = req.params;
    if (!token) {
      return res
        .status(400)
        .json({ result: false, error: "No token provided" });
    }
    const foundUser = await User.findOne({ token });
    if (!foundUser) {
      return res.status(404).json({ result: false, error: "User not found" });
    }
    const items = await Item.find({ user: foundUser._id });
    return res.status(200).json({ result: true, items });
  } catch (error) {
    console.error("Error fetching items:", error);
    return res.status(500).json({ result: false, error: error.message });
  }
});

router.delete("/:itemId", async (req, res) => {
  try {
    const { itemId } = req.params;
    const { token } = req.body;

    // token validation
    if (!token) {
      return res
        .status(400)
        .json({ result: false, error: "No token provided" });
    }

    // item validation
    const item = await Item.findById(itemId);
    if (!item) {
      return res.status(404).json({ result: false, error: "Item not found" });
    }

    // user validation
    const foundUser = await User.findOne({ token });
    if (!foundUser) {
      return res.status(404).json({ result: false, error: "User not found" });
    }

    // authorization check
    if (item.user && item.user.toString() !== foundUser._id.toString()) {
      return res.status(403).json({
        result: false,
        error: "Not authorized to delete this item",
      });
    }

    // delete item
    const deletedItem = await Item.findByIdAndDelete(itemId);
    if (!deletedItem) {
      return res.status(500).json({
        result: false,
        error: "Error deleting item",
      });
    }

    // success
    return res.status(200).json({
      result: true,
      message: "Item successfully deleted",
      item: deletedItem,
    });
  } catch (error) {
    console.error("Error deleting item:", error);
    return res.status(500).json({ result: false, error: error.message });
  }
});

module.exports = router;
