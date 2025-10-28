const mongoose = require("mongoose");

const aiassistantsSchema = mongoose.Schema({
  aiassistantName: String,
  aiassistantStyle: { type: [String], default: [] },
  aiassistantDescription: String,
  aiassistantPic: String,
});

const Aiassistant = mongoose.model("aiassistants", aiassistantsSchema);

module.exports = Aiassistant;
