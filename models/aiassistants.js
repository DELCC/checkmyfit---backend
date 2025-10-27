const mongoose = require("mongoose");

const aiassistantsSchema = mongoose.Schema({
  name: String, 
  style: { type: [String], default: [] },
  description: String, 
  image: String,
});

const Aiassistant = mongoose.model("aiassistants", aiassistantsSchema);

module.exports = Aiassistant;
