var express = require("express");
var router = express.Router();

const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const uniqid = require("uniqid");

const Item = require("../models/items");

router.post("/upload", async (req, res) => {
  if (!req.files || !req.files.photoFromFront) {
    return res.status(400).json({ result: false, error: "No file uploaded" });
  }

  const photoPath = `./tmp/${uniqid()}.jpg`;

  try {
    await req.files.photoFromFront.mv(photoPath);

    const resultCloudinary = await cloudinary.uploader.upload(photoPath, {
      background_removal: "cloudinary_ai",
      transformation: [{ background: "white", crop: "fill" }],
    });
    res.json({ result: true, url: resultCloudinary.secure_url });
  } catch (error) {
    res.status(500).json({ result: false, error: error.message });
  } finally {
    if (fs.existsSync(photoPath)) fs.unlinkSync(photoPath);
  }
});

module.exports = router;
