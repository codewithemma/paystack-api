const express = require("express");
const {
  initializePayment,
  verifyPayment,
} = require("../controllers/payment/paymentController");
const paymentWebhook = require("../controllers/payment/webhook/payment");
const router = express.Router();

router.post("/initialize-payment", initializePayment);

router.get("/verify-payment/:reference", verifyPayment);

router.post("/paystack-webhook", paymentWebhook);

module.exports = router;
