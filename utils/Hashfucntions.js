const crypto = require("crypto");
const logger = require("../utils/logger");

function generateHash(payload, salt) {
  try {
    const hashString = [
      payload.merchantId || "",
      payload.txnId || "",
      payload.totalAmount || "",
      payload.accountNo || "",
      payload.consumerId || "",
      payload.consumerMobileNo || "",
      payload.consumerEmailId || "",
      payload.debitStartDate || "",
      payload.debitEndDate || "",
      payload.maxAmount || "",
      payload.amountType || "",
      payload.frequency || "",
      payload.cardNumber || "",
      payload.expMonth || "",
      payload.expYear || "",
      payload.cvvCode || "",
      salt,
    ].join("|");

    // console.log("Hash String:", hashString);
    const hash = crypto.createHash("sha512").update(hashString).digest("hex");
    logger.info(
      `[HASH GENERATION] Success | txnId: ${payload.txnId} | Hash generated successfully.`
    );

    return hash;
  } catch (error) {
    logger.error(
      `[HASH GENERATION] Failed | txnId: ${payload.txnId} | Error: ${error.message}`
    );
    throw error;
  }
}

function verifyHash(payload, salt) {
  try {
    const hashString = [
      payload.txn_status,
      payload.txn_msg,
      payload.txn_err_msg,
      payload.clnt_txn_ref,
      payload.tpsl_bank_cd,
      payload.tpsl_txn_id,
      payload.txn_amt,
      payload.clnt_rqst_meta,
      payload.tpsl_txn_time,
      payload.bal_amt,
      payload.card_id,
      payload.alias_name,
      payload.BankTransactionID,
      payload.mandate_reg_no,
      payload.token,
      salt,
    ].join("|");

    // console.log("Hash String:", hashString);
    const hash = crypto.createHash("sha512").update(hashString).digest("hex");
    logger.info(
      `[HASH VERIFICATION] Success | txnRef: ${payload.clnt_txn_ref} | Verification hash generated.`
    );

    return hash;
  } catch (error) {
    logger.error(
      `[HASH VERIFICATION] Failed | txnRef: ${payload.clnt_txn_ref} | Error: ${error.message}`
    );
    throw error;
  }
}

module.exports = {
  generateHash,
  verifyHash,
};
