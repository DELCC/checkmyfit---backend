const mongoose = require("mongoose");

const itemSchema = mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
  itemPic: String,
  type: String,
  color: String,
  season: String,
  occasion: String,
  fabric: String,
});

const Item = mongoose.model("items", itemSchema);

module.exports = Item;
