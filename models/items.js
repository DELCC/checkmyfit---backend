const mongoose = require("mongoose");

const itemSchema = mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
  itemPic: { type: String, required: true },
  type: { type: String, required: true },
  color: { type: String, default: null },
  season: { type: String, default: null },
  occasion: { type: String, default: null },
  fabric: { type: String, default: null },
});

const Item = mongoose.model("items", itemSchema);

module.exports = Item;
