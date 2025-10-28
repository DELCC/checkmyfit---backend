require("dotenv").config();
const mongoose = require("mongoose");
const AiAssistant = require("./models/aiassistants");

// Connect to MongoDB
mongoose
  .connect(process.env.CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Array of AI assistants
const assistants = [
  {
    aiassistantName: "Aurélien",
    aiassistantStyle: ["neutral"],
    aiassistantDescription:
      "Aurélien est ton assistant IA neutre et direct, qui garde les choses simples et efficaces.",
    aiassistantPic: "",
  },
  {
    aiassistantName: "Paul",
    aiassistantStyle: ["fun", "playful", "casual"],
    aiassistantDescription:
      "Paul apporte de l'énergie et de l'humour à tes interactions. Il rend chaque session légère et agréable.",
    aiassistantPic: "",
  },
  {
    aiassistantName: "Clément",
    aiassistantStyle: ["serious", "professional"],
    aiassistantDescription:
      "Clément est précis et concentré, idéal pour ceux qui veulent des conseils structurés et professionnels.",
    aiassistantPic: "",
  },
  {
    aiassistantName: "Yoann",
    aiassistantStyle: ["creative", "friendly"],
    aiassistantDescription:
      "Yoann adore explorer de nouvelles idées et inspirer la créativité tout en restant accessible.",
    aiassistantPic: "",
  },
  {
    aiassistantName: "Ruddy",
    aiassistantStyle: ["encouraging", "motivational"],
    aiassistantDescription:
      "Ruddy est là pour motiver et encourager, en donnant des conseils positifs et pratiques.",
    aiassistantPic: "",
  },
];

// Insert assistants
assistants.forEach((a) => {
  const newAssistant = new AiAssistant(a);
  newAssistant
    .save()
    .then((doc) => console.log("Saved:", doc.name))
    .catch((err) => console.error(err));
});
