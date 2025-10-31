var express = require("express");
var router = express.Router();

require("../models/connection");
const User = require("../models/users");
const Outfit = require("../models/outfits");

router.post("/:token", (req, res) => {
  User.findOne({ token: req.params.token }).then((data) => {
    if (data) {
      const newOutfit = new Outfit({
        user: data._id,
        outfitPic: req.body.outfitPic,
        rating: req.body.rating,
        comment: req.body.comment,
        suggestion: req.body.suggestion,
      });

      newOutfit
        .save()
        .then((data) => res.json({ result: true, outfit: data }))
        .catch((error) => console.log(error));
    } else {
      res.json({ result: false, message: "User doesn't exist" });
    }
  });
});

router.get("/:token", (req, res) => {
  User.findOne({ token: req.params.token }).then((data) => {
    if (data) {
      Outfit.find({ user: data._id })
        .then((data) => res.json({ result: true, outfits: data }))
        .catch((error) => console.log(error));
    } else {
      res.json({ result: false, message: "User doesn't exist" });
    }
  });
});

router.delete("/:id", (req, res) => {
  Outfit.findByIdAndDelete({ _id: req.params.id })
    .then(() =>
      res.json({ result: true, message: `Outfit ${req.params.id} deleted` })
    )
    .catch((error) => console.log(error));
});

module.exports = router;
