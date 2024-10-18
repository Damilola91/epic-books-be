const express = require("express");
const books = express.Router();
const BooksModel = require("../models/Bookmodel");
const isArrayEmpty = require("../utiles/checkArrayLength");
const manageErrorMessage = require("../utiles/menageErrorMessages");

books.get("/books", async (req, res) => {
  const { page, pageSize = 10 } = req.query;
  try {
    const books = await BooksModel.find()
      .limit(pageSize)
      .skip((page - 1) * pageSize);

    const count = await BooksModel.countDocuments();
    const totalPages = Math.ceil(count / pageSize);
    if (isArrayEmpty(books)) {
      return res.status(404).send({
        statusCode: 404,
        message: "Books not Found",
      });
    }
    res.status(200).send({
      statusCode: 200,
      message: `Books Found: ${books.length}`,
      count,
      totalPages,
      books,
    });
  } catch (error) {
    res.status(500).send({
      statusCode: 500,
      message: manageErrorMessage(error),
    });
  }
});

module.exports = books;
