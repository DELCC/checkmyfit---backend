var express = require("express");
var router = express.Router();

const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const uniqid = require("uniqid");

const Item = require("../models/items");

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

module.exports = router;
