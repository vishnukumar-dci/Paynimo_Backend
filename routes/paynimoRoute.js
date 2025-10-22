const paynimo = require("../controller/paynimoController");
const validation = require('../middleware/validation')
const express = require("express");
const router = express.Router();

router.post("/create-checkout", validation.Inputs,validation.validateInputs,paynimo.createCheckout);

router.post("/checkout-status", paynimo.checkoutStatus);

module.exports = router;
