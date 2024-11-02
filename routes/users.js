const express = require("express");
const users = express.Router();
const UserModel = require("../models/Usersmodel");
const validateUserMiddleware = require("../middleware/validateUserMiddleware");

users.get("/users", async (req, res, next) => {
  try {
    const users = await UserModel.find();
    if (users.length === 0) {
      return res.status(404).send({
        statusCode: 404,
        message: "User not found",
      });
    }
    res.status(200).send({
      statusCode: 200,
      users,
    });
  } catch (error) {
    next(error);
  }
});

users.get("/users/:userId", async (req, res, next) => {
  const { userId } = req.params;
  if (!userId) {
    return res.status(400).send({
      statusCode: 400,
      message: "User ID is required",
    });
  }
  try {
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).send({
        statusCode: 404,
        message: "User ID not Found",
      });
    }
    res.status(200).send(user);
  } catch (error) {
    next(error);
  }
});

users.post(
  "/users/create",
  [validateUserMiddleware],
  async (req, res, next) => {
    console.log(req.body);
    const { name, surname, dob, email, password, username, gender, address } =
      req.body;

    const newUser = new UserModel({
      name,
      surname,
      dob: new Date(dob),
      email,
      password,
      username,
      gender,
      address,
    });

    try {
      const user = await newUser.save();
      res.status(201).send({
        statusCode: 201,
        message: "User saved successfulluy",
        user,
      });
    } catch (error) {
      next(error);
    }
  }
);

users.patch("/users/update/:userId", async (req, res, next) => {
  console.log(req.body);
  const { userId } = req.params;
  if (!userId) {
    return res.status(400).send({
      statusCode: 400,
      message: "User ID is required",
    });
  }
  const userExist = await UserModel.findById(userId);
  if (!userExist) {
    return res.status(400).send({
      statusCode: 400,
      message: "User not found with the given userId",
    });
  }
  try {
    const updateUserData = req.body;
    const options = { new: true };
    const result = await UserModel.findByIdAndUpdate(
      userId,
      updateUserData,
      options
    );

    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
});

users.delete("/users/delete/:userId", async (req, res, next) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).send({
      statusCode: 400,
      message: "User ID is required",
    });
  }

  try {
    const user = await UserModel.findByIdAndDelete(userId);

    if (!user) {
      return res.status(404).send({
        statusCode: 404,
        message: "User not found with the given userId",
      });
    }

    res.status(200).send({
      statusCode: 200,
      message: "User deleted successfully",
    });
  } catch (error) {
    next(error);
  }
});

module.exports = users;
