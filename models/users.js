const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  username: { type: String, required: true }, 
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true }, 
  token: String,
  aiassistant: { type: mongoose.Schema.Types.ObjectId, ref: 'aiassistants', default: null } ,
  profilepic: String, 
  bio: { type: String, default: null },
  taille: { type: Number, default: null },
  poids:{ type: Number, default: null }, 
  skintone: { type: String, default: null },
  bodytype:{ type: String, default: null },
  stylepreferences: { type: [String], default: [] }, 
}, { timestamps: true });

const User = mongoose.model("users", userSchema);

module.exports = User;
