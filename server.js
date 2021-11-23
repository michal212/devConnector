const express = require("express");
const dbConnetcion = require("./config/db");
const userRoute = require("./api/users");
const authRoute = require("./api/auth");
const profilesRoute = require("./api/profile");
const postsRoute = require("./api/posts");

const app = express();
app.use(express.json({ extended: false }));
dbConnetcion();
// const PORT=env.process.PORT||5000
app.get("/", (req, res) => {
  res.send("you on port 5000");
});
app.use("/api/users", userRoute);
app.use("/api/posts", postsRoute);
app.use("/api/profile", profilesRoute);
app.use("/api/auth", authRoute);

app.listen(5000, () => {
  console.log("server run on port 5000");
});
