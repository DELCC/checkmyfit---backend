require("dotenv").config();
const mongoose = require("mongoose");
const AiAssistant = require("./models/aiassistants");

// Connect to MongoDB
mongoose.connect(process.env.CONNECTION_STRING, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("MongoDB connection error:", err));

// Array of AI assistants
const assistants = [
  {
    "name": "Aurélien",
    "style": ["neutral"],
    "description": "Aurélien is your straightforward, neutral AI assistant who keeps things simple and efficient.",
    "image": ""
  },
  {
    "name": "Paul",
    "style": ["fun", "playful", "casual"],
    "description": "Paul brings energy and humor to your interactions. He makes every session light and enjoyable.",
    "image": ""
  },
  {
    "name": "Clément",
    "style": ["serious", "professional"],
    "description": "Clément is precise and focused, ideal for users who want structured advice and guidance.",
    "image": ""
  },
  {
    "name": "Yoann",
    "style": ["creative", "friendly"],
    "description": "Yoann loves exploring new ideas and inspiring creativity while staying approachable.",
    "image": ""
  },
  {
    "name": "Ruddy",
    "style": ["encouraging", "motivational"],
    "description": "Ruddy is all about uplifting and motivating users, giving positive reinforcement and practical tips.",
    "image": ""
  }
];

// Insert assistants
assistants.forEach(a => {
  const newAssistant = new AiAssistant(a);
  newAssistant.save()
    .then(doc => console.log("Saved:", doc.name))
    .catch(err => console.error(err));
});