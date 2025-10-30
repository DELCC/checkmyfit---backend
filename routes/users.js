var express = require("express");
var router = express.Router();

require("../models/connection");
const User = require("../models/users");
const { checkBody } = require("../modules/checkBody");

const uid2 = require("uid2");
const bcrypt = require("bcrypt");

const uniqid = require("uniqid");
const fs = require("fs");
const cloudinary = require("cloudinary").v2;

// POST ----- SIGN UP

router.post("/signup", (req, res) => {
  console.log("Incoming body:", req.body);
  if (!checkBody(req.body, ["username", "email", "password"])) {
    res.json({ result: false, error: "Missing or empty fields" });
    return;
  }

  // Check if the user has not already been registered
  User.findOne({ username: req.body.username }).then((data) => {
    if (data === null) {
      const hash = bcrypt.hashSync(req.body.password, 10);
      const token = uid2(32);

      const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: hash,
        token: token,
      });

      newUser.save().then((data) => {
        res.json({ result: true, token });
      });
    } else {
      // User already exists in database
      res.json({ result: false, error: "User already exists" });
    }
  });
});

// POST ----- SIGN IN

router.post("/signin", (req, res) => {
  if (!checkBody(req.body, ["username", "password"])) {
    res.json({ result: false, error: "Missing or empty fields" });
    return;
  }

  User.findOne({
    username: req.body.username,
  }).then((data) => {
    if (data && bcrypt.compareSync(req.body.password, data.password)) {
      res.json({ result: true, token: data.token });
    } else {
      res.json({ result: false, error: "User not found" });
    }
  });
});

// PUT ----- Edit profile

router.put("/:token", (req, res) => {
  User.findOne({ token: req.params.token })
    .then((user) => {
      if (!user) {
        res.status(403).json({ message: "User not found" });
        return;
      }

      const updatableFields = [
        "aiAssistant",
        "profilePic",
        "bio",
        "height",
        "weight",
        "skinTone",
        "bodyType",
        "stylePreferences",
      ];

      const updateData = {};
      updatableFields.forEach((field) => {
        if (req.body[field] !== undefined && req.body[field] !== null) {
          updateData[field] = req.body[field];
        }
      });

      return User.findByIdAndUpdate(
        user._id,
        { $set: updateData },
        { new: true }
      );
    })
    .then((updatedUser) => {
      if (!updatedUser) {
        res.status(404).json({ message: "User not found by ID" });
        return;
      }
      res.status(200).json({
        message: "User updated successfully",
        user: updatedUser,
      });
    })
    .catch((err) => {
      console.error("PUT /:id/:token error:", err);
      res.status(500).json({
        message: "Server error",
      });
    });
});

//GET ----- profile infos
router.get("/:token", (req, res) => {
  User.findOne({ token: req.params.token })
    .populate("aiAssistant")
    .then((user) => {
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      } else {
        return res.status(200).json({ user });
      }
    })
    .catch((err) => {
      res
        .status(500)
        .json({ message: "Not able to GET profile info", error: err });
    });
});

// POST CLOUDINARY UPLOAD
router.post("/upload", async (req, res) => {
  const photoPath = `./tmp/${uniqid()}.jpg`;

  // Move the uploaded file temporarily
  await req.files.photoFromFront.mv(photoPath);

  // Upload to Cloudinary
  const resultCloudinary = await cloudinary.uploader.upload(photoPath);

  // Delete the local temp file
  fs.unlinkSync(photoPath);

  // Respond with Cloudinary URL
  res.json({ result: true, url: resultCloudinary.secure_url });
});

module.exports = router;
