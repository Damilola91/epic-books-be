const express = require("express");
const init = require("./db");
require("dotenv").config();
const usersRoute = require("./routes/users");
const PORT = 3061;

const server = express();

server.use(express.json());
server.use("/", usersRoute);

init();

server.listen(PORT, () => console.log(`Server is runnin' on PORT ${PORT}`));
