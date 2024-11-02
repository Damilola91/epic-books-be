const { param, validationResult } = require("express-validator");

const validateBookTitle = [
  param("title").isString().notEmpty().withMessage(),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send({
        stauscode: 400,
        message: "validation failed",
        errors: errors.array(),
      });
    }
    next();
  },
];

module.exports = validateBookTitle;
