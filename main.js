const express = require("express");
const cors = require("cors");
const path = require("path");
const init = require("./db");
require("dotenv").config();
const usersRoute = require("./routes/users");
const loginRoute = require("./routes/login");
const booksRoute = require("./routes/books");
const commentsRoute = require("./routes/comments");
const emailRoute = require("./routes/email");
const ordersRoute = require("./routes/order");
const googleRoute = require("./routes/google");
const routeNotFoundMiddleWare = require("./middleware/routeNotFoundHandler");
const requestedTimeMiddleware = require("./middleware/requestedTimeMiddleware");
const blockIpMiddleware = require("./middleware/blockIpMiddleware");
const badRequestHandler = require("./middleware/badRequestHandler");
const genericErrorHandler = require("./middleware/genericErrorHandler");

const notAllowedIP = process.env.BANNEDIPS
  ? process.env.BANNEDIPS.split(",")
  : [];

const PORT = process.env.PORT || 3061;

const server = express();

server.use("/uploads", express.static(path.join(__dirname, "./uploads")));

server.use(express.json());
server.use(cors());
//server.use(blockIpMiddleware(notAllowedIP))
server.use(requestedTimeMiddleware);
server.use("/", usersRoute);
server.use("/", loginRoute);
server.use("/", googleRoute);
server.use("/", booksRoute);
server.use("/", emailRoute);
server.use("/", commentsRoute);
server.use("/", ordersRoute);

server.use(badRequestHandler);

server.use(genericErrorHandler);
server.use(routeNotFoundMiddleWare);

init();

server.listen(PORT, () => console.log(`Server is runnin' on PORT ${PORT}`));
