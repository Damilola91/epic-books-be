const express = require("express");
const cors = require("cors");
const path = require("path");
const init = require("./db");
require("dotenv").config();
const usersRoute = require("./routes/users");
const loginRoute = require("./routes/login");
const booksRoute = require("./routes/books");
const commentsRoute = require("./routes/comments");
const routeNotFoundMiddleWare = require("./middleware/routeNotFoundHandler");
const requestedTimeMiddleware = require("./middleware/requestedTimeMiddleware");
const blockIpMiddleware = require("./middleware/blockIpMiddleware");
const badRequestHandler = require("./middleware/badRequestHandler");
const genericErrorHandler = require("./middleware/genericErrorHandler");

const notAllowedIP = process.env.BANNEDIPS
  ? process.env.BANNEDIPS.split(",")
  : [];
const PORT = 3061;

const server = express();

server.use("/uploads", express.static(path.join(__dirname, "./uploads")));

server.use(express.json());
server.use(cors());
//server.use(blockIpMiddleware(notAllowedIP))
server.use(requestedTimeMiddleware);
server.use("/", usersRoute);
server.use("/", loginRoute);
server.use("/", booksRoute);
server.use("/", commentsRoute);

server.use(badRequestHandler);
server.use(routeNotFoundMiddleWare);
server.use(genericErrorHandler);

init();

server.listen(PORT, () => console.log(`Server is runnin' on PORT ${PORT}`));
