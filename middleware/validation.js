const { body, validationResult } = require("express-validator");
const logger = require("../utils/logger");
const { captureRejectionSymbol } = require("winston-daily-rotate-file");

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

  body("currency")
    .notEmpty()
    .withMessage("Currency selection is mandatory")
];

function validateInputs(req, res, next) {
  const errors = validationResult(req);
  const { email, phoneno, amount ,currency} = req.body;

  if (!errors.isEmpty()) {
    logger.warn(
      `[CREATE CHECKOUT] Validation failed | Email: ${email}, Phone: ${phoneno}, Amount: ${amount} ,Currency: ${currency}`
    );
    console.log(errors)
    // Send standardized response with proper status code
    return res.status(400).json({
      success: false,
      status: 400,
      message: "Validation failed. Please check your input fields.",
      errors: errors.array(),
      data: {
        email,
        phoneno,
        amount,
        currency
      },
    });
  }

  next();
}

module.exports = {
  validateInputs,
  Inputs,
};
