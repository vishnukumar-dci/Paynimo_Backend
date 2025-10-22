const { body, validationResult } = require("express-validator");
const logger = require("../utils/logger");

const emailRegex =
  /^[a-zA-Z0-9]+([._%+-]?[a-zA-Z0-9]+)*@[a-zA-Z0-9-]+(\.[a-zA-Z]{2,})+$/;

const Inputs = [
  body("email")
    .notEmpty()
    .withMessage("Email address is required.")
    .bail()
    .matches(emailRegex)
    .withMessage("Please provide a valid email address.")
    .trim(),

  body("amount")
    .notEmpty()
    .withMessage("Transaction amount is required.")
    .bail()
    // .isFloat({ min: 10 })
    .withMessage("Transaction amount must be at least ₹10"),

  body("phoneno").notEmpty().trim().withMessage("Mobile number is required."),
];

function validateInputs(req, res, next) {
  const errors = validationResult(req);
  const { email, phoneno, amount } = req.body;
  if (!errors.isEmpty()) {
    logger.warn(
      `[CREATE CHECKOUT] Missing Required Fields | Email: ${email}, Phone: ${phoneno}, Amount: ${amount}`
    );
    return res.status(400).json({
      success: false,
      message: errors.array(),
    });
  }
  next();
}

module.exports = {
  validateInputs,
  Inputs,
};
