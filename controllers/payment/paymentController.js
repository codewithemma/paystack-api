const axios = require("axios");
const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
const PAYSTACK_BASE_URL = "https://api.paystack.co";

const initializePayment = async (req, res) => {
  const { email, amount } = req.body;
  try {
    const response = await axios.post(
      `${PAYSTACK_BASE_URL}/transaction/initialize`,
      {
        email,
        amount: amount * 100,
      },
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
          "content-type": "application/json",
        },
      }
    );
    res.status(200).json({
      status: "success",
      message: "Payment initialized",
      data: response.data,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.response?.data?.message || "An error occurred",
    });
    console.log(error);
  }
};

const verifyPayment = async (req, res) => {
  const { reference } = req.params;
  if (!reference) {
    return res.status(400).json({
      status: "error",
      message: "Transaction reference is required.",
    });
  }
  try {
    const response = await axios.get(
      `${PAYSTACK_BASE_URL}/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        },
      }
    );
    res.status(200).json({
      status: "success",
      message: "Payment verified",
      data: response.data,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.response?.data?.message || "An error occurred",
    });
  }
};

module.exports = { initializePayment, verifyPayment };
