require("dotenv").config();
const express = require("express");
const app = express();
const port = 3000;

// routes
const paymentRouter = require("./routes/paymentRoute");

// database connection
const connectDB = require("./db/connect");

// middleware
app.use(express.json());
app.use("/api/v1/payments", paymentRouter);

const start = async () => {
  try {
    await connectDB();
    app.listen(port, () => {
      console.log(`server is listening on port: ${port}`);
    });
  } catch (error) {
    console.log(error, "Something went wrong");
  }
};

start();
