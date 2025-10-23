require("dotenv").config();
const Hash = require("../utils/Hashfucntions");
const logger = require("../utils/logger");

const MERCHANT_ID = process.env.merchant_code;
const MERCHANT_KEY = process.env.encKey;
const baseURL = process.env.baseURL;

const createCheckout = async (req, res) => {
  const { amount, email, phoneno } = req.body;

  logger.info(
    `[CREATE CHECKOUT] Request received | Email: ${email}, Phone: ${phoneno}, Amount: ${amount}`
  );

  try {
    const txnId = `TXN${Date.now()}`;
    const cusId = `CON${Date.now()}`;

    const consumerData = {
      merchantId: MERCHANT_ID,
      txnId,
      totalAmount: amount,
      accountNo: "",
      consumerId: cusId,
      consumerMobileNo: phoneno,
      consumerEmailId: email,
      debitStartDate: "",
      debitEndDate: "",
      maxAmount: "",
      amountType: "",
      frequency: "",
      cardNumber: "",
      expMonth: "",
      expYear: "",
      cvvCode: "",
    };

    const token = await Hash.generateHash(consumerData, MERCHANT_KEY);

    logger.info(
      `[CREATE CHECKOUT] checkout created successfully | Email: ${email}, Phone: ${phoneno}, Amount: ${amount}`
    );
    // res.status(201).json({
    //   success: true,
    //   merchantId: MERCHANT_ID,
    //   txnId,
    //   amount,
    //   cusId,
    //   token,
    //   currency: "INR",
    //   phoneno,
    //   email,
    // });
    return res.status(201).json({
      success: true,
      status: 201,
      message: "Checkout created successfully",
      data: {
        merchantId: MERCHANT_ID,
        txnId,
        amount,
        cusId,
        token,
        currency: "INR",
        phoneno,
        email,
      },
    });
  } catch (error) {
    console.log(error);
    logger.error(
      `[CREATE CHECKOUT] Failed to create checkout | Email: ${email}, Phone: ${phoneno}, Amount: ${amount}`
    );
    // res.status(500).json({ message: error, success: false });
    return res.status(500).json({
      success: false,
      status: 500,
      message: "Failed to create checkout",
      data: {},
    });
  }
};

const checkoutStatus = async (req, res) => {
  const { msg } = req.body;
  logger.info(`[CHECKOUT STATUS] Callback received from payment gateway.`);
  try {
    if (!msg) {
      logger.warn(`[CHECKOUT STATUS] No 'msg' data received in request body.`);
      // return res.status(400).json({ message: "No message received" });
      return res.redirect(`${baseURL}/status/failure`);
    }

    const msgFields = msg.split("|");

    const responseData = {
      txn_status: msgFields[0],
      txn_msg: msgFields[1],
      txn_err_msg: msgFields[2],
      clnt_txn_ref: msgFields[3],
      tpsl_bank_cd: msgFields[4],
      tpsl_txn_id: msgFields[5],
      txn_amt: msgFields[6],
      clnt_rqst_meta: msgFields[7],
      tpsl_txn_time: msgFields[8],
      bal_amt: msgFields[9],
      card_id: msgFields[10],
      alias_name: msgFields[11],
      BankTransactionID: msgFields[12],
      mandate_reg_no: msgFields[13],
      token: msgFields[14],
    };

    const responseHash = msgFields[15];

    const hash = await Hash.verifyHash(responseData, MERCHANT_KEY);

    console.log("responseData", responseData);
    console.log("hash", hash);
    console.log("responseHash", responseHash);
    console.log("responseHash", hash !== responseHash);

    if (hash !== responseHash) {
      logger.error(
        `[CHECKOUT STATUS] Hash validation failed | txnId: ${responseData.clnt_txn_ref}`
      );
      console.log("${responseData.clnt_txn_ref", responseData.clnt_txn_ref);

      // return res.status(400).json({ message: "Payment Failed" });
      return res.redirect(`${baseURL}/status/failure`);
    }

    // if (responseData.txn_status === "0300") {
    //   logger.log(
    //     "payment",
    //     `[PAYMENT SUCCESS] Transaction successful | txnId: ${responseData.clnt_txn_ref}`
    //   );
    //   return res.redirect(`${baseURL}/status/success`);
    // }
    // else if (
    //   responseData.txn_status === "0398" ||
    //   responseData.txn_status === "0396"
    // ) {
    //   return res.send(
    //     `Payment is ${
    //       responseData.txn_status === "0398" ? "Initiated" : "Awaited"
    //     }`
    //   );
    // }
    // else if (responseData.txn_status === "0392") {
    //   logger.log(
    //     "payment",
    //     `[PAYMENT ABORTED] Transaction aborted by user | txnId: ${responseData.clnt_txn_ref}`
    //   );
    //   return res.redirect(`${baseURL}/status/aborted`);
    // } else {
    //   logger.log(
    //     "payment",
    //     `[PAYMENT FAILED] Transaction failed | txnId: ${responseData.clnt_txn_ref}, Status: ${responseData.txn_status}`
    //   );
    //   return res.redirect(`${baseURL}/status/failure`);
    // }
    if (responseData.txn_status === "0300") {
      logger.log(
        "payment",
        `[PAYMENT SUCCESS] Transaction successful | txnId: ${responseData.clnt_txn_ref}`
      );
      return res.redirect(
        `${baseURL}/status/success?txnId=${responseData.clnt_txn_ref}&amount=${
          responseData.txn_amt
        }&status=success&msg=${encodeURIComponent(responseData.txn_msg)}`
      );
    } else if (responseData.txn_status === "0392") {
      logger.log(
        "payment",
        `[PAYMENT ABORTED] Transaction aborted by user | txnId: ${responseData.clnt_txn_ref}`
      );
      return res.redirect(
        `${baseURL}/status/aborted?txnId=${responseData.clnt_txn_ref}&amount=${
          responseData.txn_amt
        }&status=aborted&msg=${encodeURIComponent(responseData.txn_msg)}`
      );
    } else {
      logger.log(
        "payment",
        `[PAYMENT FAILED] Transaction failed | txnId: ${responseData.clnt_txn_ref}, Status: ${responseData.txn_status}`
      );
      return res.redirect(
        `${baseURL}/status/failure?txnId=${responseData.clnt_txn_ref}&amount=${
          responseData.txn_amt
        }&status=failure&msg=${encodeURIComponent(
          responseData.txn_err_msg || responseData.txn_msg
        )}`
      );
    }
  } catch (error) {
    logger.error(
      `[CHECKOUT STATUS] Unexpected error occurred | Error: ${error.message}`,
      { stack: error.stack }
    );
    return res.redirect(`${baseURL}/status/failure`);
  }
};

module.exports = {
  createCheckout,
  checkoutStatus,
};
