var express = require("express");
var router = express.Router();

const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const uniqid = require("uniqid");

const credentials = Buffer.from(
  `${process.env.KEY}:${process.env.SECRET}`
).toString("base64");
// Hello qsd
router.post("/aianalysis", (req, res) => {
  fetch(
    `https://api.cloudinary.com/v2/analysis/${process.env.CLOUDINARY_CLOUD_NAME}/analyze/ai_vision_general`,
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${credentials}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        source: {
          uri: req.body.picture,
        },
        prompts: req.body.prompts,
      }),
    }
  )
    .then((response) => response.json())
    .then((data) => res.json({ result: true, data }))
    .catch(error => res.json({result : false,error : error }));
});

router.post("/upload", async (req, res) => {
  const photoPath = `./tmp/${uniqid()}.jpg`;
  const resultMove = await req.files.photoFromFront.mv(photoPath);

  if (!resultMove) {
    const resultCloudinary = await cloudinary.uploader.upload(photoPath);
    fs.unlinkSync(photoPath);
    res.json({ result: true, url: resultCloudinary.secure_url });
  } else {
    res.json({ result: false, error: resultMove });
  }
});

module.exports = router;
