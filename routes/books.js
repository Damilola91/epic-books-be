const express = require("express");
const books = express.Router();
const BooksModel = require("../models/Bookmodel");
const isArrayEmpty = require("../utiles/checkArrayLength");
const manageErrorMessage = require("../utiles/menageErrorMessages");
const validateBookBody = require("../middleware/validateBookBody");
const upload = require("../middleware/uploadsMulter");
const cloud = require("../middleware/uploadsCloudinary");

books.get("/books", async (req, res) => {
  const { page = 1, pageSize = 10 } = req.query;
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

books.get("/books/:bookId", async (req, res, next) => {
  const { bookId } = req.params;

  if (!bookId) {
    return res.status(400).send({
      statusCode: 400,
      message: "Book ID is required",
    });
  }

  try {
    const bookExist = await BooksModel.findById(bookId);
    if (!bookExist) {
      return res.status(404).send({
        statusCode: 404,
        message: "Book not found with the given bookId",
      });
    }

    res.status(200).send(bookExist);
  } catch (error) {
    next(error);
  }
});

books.get("/books/search/:title", async (req, res, next) => {
  const { title } = req.params;
  const { page = 1, pageSize = 10 } = req.query;

  if (!title) {
    return res.status(400).send({
      statusCode: 400,
      message: "Title is required",
    });
  }

  try {
    const books = await BooksModel.find({
      title: {
        $regex: ".*" + title + ".*",
        $options: "i",
      },
    })
      .limit(pageSize)
      .skip((page - 1) * pageSize);

    const count = await BooksModel.countDocuments({
      title: {
        $regex: ".*" + title + ".*",
        $options: "i",
      },
    });

    const totalPages = Math.ceil(count / pageSize);

    if (isArrayEmpty(books)) {
      return res.status(404).send({
        statusCode: 404,
        message: "Title not Found",
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
    next(error);
  }
});

books.post("/books/create", [validateBookBody], async (req, res, next) => {
  const { title, asin, category, price, img } = req.body;

  if (!title || !asin || !category || !price || !img) {
    return res.status(400).send({
      statusCode: 400,
      message: "Missing required fields: title, asin, price, img, asin",
    });
  }

  try {
    const newBook = new BooksModel({
      title,
      category,
      asin,
      price: Number(req.body.price),
      img,
    });

    const book = await newBook.save();

    res.status(201).send({
      statusCode: 201,
      message: "Book created successfully",
      book,
    });
  } catch (error) {
    next(error);
  }
});

books.post("/books/upload", upload.single("img"), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Nessun file caricato" });
    }

    const url = `${req.protocol}://${req.get("host")}`;
    const imgUrl = req.file.filename;
    res.status(200).json({ img: `${url}/uploads/${imgUrl}` });
  } catch (error) {
    next(error);
  }
});

books.post(
  "/books/upload/cloud",
  cloud.single("img"),
  async (req, res, next) => {
    try {
      res.status(200).json({ img: req.file.path });
    } catch (error) {
      next(error);
    }
  }
);

books.patch("/books/update/:bookId", async (req, res, next) => {
  const { bookId } = req.params;

  if (!bookId) {
    return res.status(400).send({
      statusCode: 400,
      message: "Book ID is required",
    });
  }

  try {
    const bookExist = await BooksModel.findById(bookId);

    if (!bookExist) {
      return res.status(404).send({
        statusCode: 404,
        message: "Book not found with the given bookId",
      });
    }

    const updateBookData = req.body;
    const options = { new: true };
    const result = await BooksModel.findByIdAndUpdate(
      bookId,
      updateBookData,
      options
    );

    res.status(200).send({
      statusCode: 200,
      message: "Book updated successfully",
      book: result,
    });
  } catch (error) {
    next(error);
  }
});

books.delete("/books/delete/:bookId", async (req, res, next) => {
  const { bookId } = req.params;

  try {
    const deletedBook = await BooksModel.findByIdAndDelete(bookId);

    if (!deletedBook) {
      return res.status(404).send({
        statusCode: 404,
        message: "Book not found",
      });
    }

    res.status(200).send({
      statusCode: 200,
      message: "Book deleted successfully",
      book: deletedBook,
    });
  } catch (error) {
    next(error);
  }
});

{
  /*Rotta per gli admin (script per aggiornare il modello book con l'aggiunta del commento)*/
}

books.patch("/books/updateModel", async (req, res, next) => {
  try {
    const result = await BooksModel.updateMany(
      { comments: { $exists: false } },
      { $set: { comments: [] } }
    );
    res.status(200).json({
      message: "Model updated successfully",
      matchedCount: result.matchedCount,
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = books;
