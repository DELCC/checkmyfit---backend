var express = require("express");
var router = express.Router();

require("../models/connection");
const aiAssistant = require("../models/aiassistants");

router.get("/", (req, res) => {
  aiAssistant
    .find()
    .then((allAssistants) => {
      res.json({ allAssistants });
    })
    .catch((err) => {
      res.status(500).json({ message: "Not able to GET info", error: err });
    });
});

module.exports = router;
