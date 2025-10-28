require("dotenv").config();

var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

require("./models/connection");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var picturesRouter = require("./routes/pictures");
var outfitsRouter = require("./routes/outfits");
var itemsRouter = require("./routes/items");
const fileUpload = require("express-fileupload");

var app = express();
const cors = require("cors");
app.use(fileUpload());
app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/pictures", picturesRouter);
app.use("/outfits", outfitsRouter);
app.use("/items", itemsRouter);

module.exports = app;
