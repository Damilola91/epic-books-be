const express = require("express");
const login = express.Router();
const UserModel = require("../models/Usersmodel");
const TOKEN = require("../Tokens/token");

const isPasswordValid = (userPassword, requestPassword) => {
  if (userPassword === requestPassword) {
    return true;
  } else {
    return false;
  }
};

login.post("/login", async (request, response) => {
  try {
    const user = await UserModel.findOne({ email: request.body.email });
    if (!user) {
      return response.status(404).send({
        statusCode: 404,
        message: "Utente non trovato con l'email fornita",
      });
    }
    // se user esiste confronto la password del body con quella presente nello user
    const checkPassword = isPasswordValid(user.password, request.body.password);
    console.log(checkPassword);
    if (!checkPassword) {
      return response.status(403).send({
        statusCode: 403,
        message: "La password non è valida",
      });
    }

    response.header("Authorized", TOKEN).status(200).send({
      statusCode: 200,
      message: "Ok sei loggato correttamente",
      token: TOKEN,
    });
  } catch (error) {
    response.status(500).send({
      statusCode: 500,
      message: "Ops something went wrong",
    });
  }
});

module.exports = login;
