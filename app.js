require("dotenv").config();

var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

require("./models/connection");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var aiassistantsRouter = require("./routes/aiassistants");
var itemsRouter = require("./routes/items");
var outfitsRouter = require("./routes/outfits");

var app = express();
const cors = require("cors");
app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/aiassistants", aiassistantsRouter)
app.use("/items", itemsRouter)
app.use("/outfits", outfitsRouter)

module.exports = app;
