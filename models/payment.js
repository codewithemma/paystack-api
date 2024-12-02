const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema({
  accessCode: String,
  reference: string,
});

module.exports = mongoose.model("Payment", PaymentSchema);
