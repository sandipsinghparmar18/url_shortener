const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const { connectToMongoDB } = require("./Database");
const URL = require("./models/url");

const restrictToLoginUserOnly = require("./middleware/auth");

const urlRoute = require("./routes/url");
const staticRoute = require("./routes/staticRouter");
const userRoute = require("./routes/user");

const app = express();
app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/url", restrictToLoginUserOnly, urlRoute);
app.use("/", staticRoute);
app.use("/user", userRoute);
app.get("/url/:shortId", async (req, res) => {
  const shortId = req.params.shortId;
  const entry = await URL.findOneAndUpdate(
    {
      shortId,
    },
    {
      $push: {
        visitHistory: {
          timestamp: Date.now(),
        },
      },
    }
  );
  res.redirect(entry.redirectURL);
});

connectToMongoDB(`mongodb://127.0.0.1:27017/short-url`).then(() =>
  console.log("Connect Db")
);
app.listen(8000, () => {
  console.log("Server started");
});
