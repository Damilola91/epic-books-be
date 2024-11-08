require("dotenv").config();
const express = require("express");
const stripe = require("stripe")(process.env.VITE_STRIPE_SECRET_KEY);
const orders = express.Router();
const OrderSchema = require("../models/OrderSchema");

orders.post("/orders", async (req, res, next) => {
  const { userId, items } = req.body;

  try {
    const totalAmount = items.reduce(
      (acc, item) => acc + parseFloat(item.price) * item.quantity,
      0
    );

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(totalAmount * 100),
      currency: "eur",
      payment_method_types: ["card"],
    });

    const newOrder = new OrderSchema({
      user: userId || null,
      items,
      totalAmount,
      paymentId: paymentIntent.id,
    });

    const savedOrder = await newOrder.save();

    res.status(201).send({
      statusCode: 201,
      message: "Ordine creato con successo",
      order: savedOrder,
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    next(error);
  }
});

orders.post("/orders/:userId/:bookId", async (req, res, next) => {
  const { userId, bookId } = req.params;
  const { items } = req.body;

  try {
    const totalAmount = items.reduce(
      (acc, item) => acc + parseFloat(item.price) * item.quantity,
      0
    );

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(totalAmount * 100),
      currency: "eur",
      payment_method_types: ["card"],
    });

    const newOrder = new OrderSchema({
      user: userId || null,
      book: bookId,
      items,
      totalAmount,
      paymentId: paymentIntent.id,
    });

    const savedOrder = await newOrder.save();

    res.status(201).send({
      statusCode: 201,
      message: "Ordine creato con successo",
      order: savedOrder,
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    next(error);
  }
});

orders.get("/orders/:orderId/status", async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const order = await OrderSchema.findById(orderId);

    if (!order) {
      return res.status(404).send({
        statusCode: 404,
        message: "Ordine non trovato",
      });
    }

    let message;
    switch (order.status) {
      case "Pending":
        message = "Il tuo ordine è in attesa di elaborazione.";
        break;
      case "Shipped":
        message = "Il tuo ordine è stato spedito e arriverà a breve.";
        break;
      case "Delivered":
        message = "Il tuo ordine è stato consegnato con successo.";
        break;
      case "Canceled":
        message = "Il tuo ordine è stato annullato.";
        break;
      default:
        message = "Stato dell'ordine non riconosciuto.";
    }

    res.status(200).send({
      statusCode: 200,
      orderStatus: order.status,
      message,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = orders;
