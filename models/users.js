const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    token: String,
    aiAssistant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "aiassistants",
      default: null,
    },
    profilePic: String,
    bio: { type: String, default: null },
    height: { type: Number, default: null },
    weight: { type: Number, default: null },
    skinTone: { type: String, default: null },
    bodyType: { type: String, default: null },
    stylePreferences: { type: [String], default: [] },
  },
  { timestamps: true }
);

const User = mongoose.model("users", userSchema);

module.exports = User;
