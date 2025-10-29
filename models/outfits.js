const mongoose = require("mongoose");

const outfitSchema = mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
    outfitPic: String,
    rating: Number,
    comment: String,
    suggestion: Array,
  },
  { timestamps: true }
);

const Outfit = mongoose.model("outfits", outfitSchema);

module.exports = Outfit;
