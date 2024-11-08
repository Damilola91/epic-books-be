const express = require("express");
const email = express.Router();
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SEND_GRID_APIKEY);

email.post("/sendEmail", async (req, res) => {
  const { email: userEmail, message } = req.body;

  const msg = {
    to: userEmail,
    from: "damilola.wiwoloku@gmail.com",
    subject: "New Message from the Contact Form",
    text: `Your message has been received:\n\n${message}\n\nWe will respond as soon as possible.`,
    html: `
      <p>Your message has been received.</p>
      <p>Here's what you wrote:</p>
      <p><strong>${message}</strong></p>
      <p>We will respond as soon as possible.</p>
    `,
  };

  try {
    await sgMail.send(msg);
    res
      .status(200)
      .send({ statusCode: 200, message: "Email inviata con successo" });
  } catch (error) {
    console.error(
      "Errore nell'invio dell'email:",
      error.response ? error.response.body : error
    );
    res
      .status(500)
      .send({ statusCode: 500, message: "Errore nell'invio dell'email" });
  }
});

module.exports = email;
