const express = require("express");
const comments = express.Router();
const CommentsModel = require("../models/CommentsModel");
const BooksModel = require("../models/Bookmodel");
const UserModel = require("../models/Usersmodel");

comments.get("/comments", async (req, res, next) => {
  try {
    const allComments = await CommentsModel.find().populate("user book");

    if (allComments.length === 0) {
      return res.status(404).send({
        statusCode: 404,
        message: "Comment not found",
      });
    }

    res.status(200).send({
      statusCode: 200,
      message: "Comments found successfully",
      comments: allComments,
    });
  } catch (error) {
    next(error);
  }
});

comments.get("/comments/book/:bookId", async (req, res, next) => {
  const { bookId } = req.params;

  try {
    const commentsForBook = await CommentsModel.find({ book: bookId }).populate(
      "user"
    );

    if (commentsForBook.length === 0) {
      return res.status(404).send({
        statusCode: 404,
        message: "No comments found for this book",
      });
    }

    res.status(200).send({
      statusCode: 200,
      message: "Comments retrieved successfully",
      comments: commentsForBook,
    });
  } catch (error) {
    next(error);
  }
});

comments.post("/comments/create", async (req, res, next) => {
  const { rate, comment, user: userId, book: bookId } = req.body;

  try {
    const user = await UserModel.findOne({ _id: userId });
    const book = await BooksModel.findOne({ _id: bookId });

    if (!user || !book) {
      return res.status(404).send({
        statusCode: 404,
        message: "User or Book not found",
      });
    }

    const newComment = new CommentsModel({
      comment,
      rate,
      user: user._id,
      book: book._id,
    });

    const savedComment = await newComment.save();

    await BooksModel.updateOne(
      { _id: book._id },
      { $push: { comments: savedComment._id } }
    );

    res.status(201).send({
      statusCode: 201,
      message: "Comment successfully created",
      savedComment,
    });
  } catch (error) {
    next(error);
  }
});

comments.patch("/comments/update/:commentId", async (req, res, next) => {
  const { commentId } = req.params;

  if (!commentId) {
    return res.status(400).send({
      statusCode: 400,
      message: "Comment ID is required",
    });
  }

  try {
    const commentExist = await CommentsModel.findById(commentId);

    if (!commentExist) {
      return res.status(404).send({
        statusCode: 404,
        message: "Comment not found with the given commentId",
      });
    }

    const updateCommentData = req.body;
    const options = { new: true };
    const result = await CommentsModel.findByIdAndUpdate(
      commentId,
      updateCommentData,
      options
    );

    res.status(200).send({
      statusCode: 200,
      message: "Comment updated successfully",
      comment: result,
    });
  } catch (error) {
    next(error);
  }
});

comments.delete("/comments/delete/:commentId", async (req, res, next) => {
  const { commentId } = req.params;

  try {
    const deletedComment = await CommentsModel.findByIdAndDelete(commentId);

    if (!deletedComment) {
      return res.status(404).send({
        statusCode: 404,
        message: "Comment not found",
      });
    }

    res.status(200).send({
      statusCode: 200,
      message: "Comment deleted successfully",
      comment: deletedComment,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = comments;
