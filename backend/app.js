var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var bodyParser = require("body-parser");
const { Server } = require("socket.io");

const port = process.env.PORT || 3001;

const db = require("./db");
const dbHelpers = require("./db/helpers/dbHelpers")(db);
const authHelpers = require("./db/helpers/authHelpers")(db);
const customizeHelpers = require("./db/helpers/customizeHelpers")(db);
const matchHelper = require("./db/helpers/matchHelpers")(db);
const avatarHelpers = require("./db/helpers/avatarHelpers")(db);
const powerUpsHelper = require("./db/helpers/powerUpsHelper")(db);

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
const sessionAuth = require("./routes/sessionAuth");
const customize = require("./routes/customize");
const matches = require("./routes/matches");
const lobbies = require("./routes/lobbies");
const avatar = require("./routes/avatar");
const powerup = require("./routes/powerup");
var app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/api", sessionAuth(authHelpers)); //Login-Logout post routes
app.use("/api", customize(customizeHelpers)); //Customize - stats routes
app.use("/api", matches(matchHelper)); // match history - routes
app.use("/api/lobbies", lobbies()); // match history - routes
app.use("/api/users", usersRouter(dbHelpers));
app.use("/api/setAvatar", avatar(avatarHelpers));
app.use("/api", powerup(powerUpsHelper));

const http = app.listen(port, () => {
  console.log(`Server listening on PORT: ${port}`);
});

const io = new Server(http);

// const io = new Server(http, {
//   cors: {
//     origin: '*', // React app URL
//     // methods: ["GET", "POST"]
//   }
// });

io.on("connection", (client) => {
  console.log("a user connected:", client.id);

  // Handle signaling data sent from clients
  client.on("signal", (data) => {
    io.to(data.to).emit("signal", data);
  });

  // Listen for incoming messages
  client.on("chatMessage", (msg) => {
    io.emit("chatMessage", msg);
  });

  client.on("disconnect", () => {
    console.log("user disconnected:", client.id);
  });
});

// module.exports = app;
