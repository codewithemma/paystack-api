require("dotenv").config();

// extra security packages
const helmet = require("helmet");
const cors = require("cors");
const xss = require("xss-clean");
const rateLimiter = require("express-rate-limit");

const express = require("express");
const app = express();
const port = 3000;

// routes
const paymentRouter = require("./routes/paymentRoute");

// database connection
const connectDB = require("./db/connect");

// middleware
app.set("trust proxy", 1);
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 100,
  })
);
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(xss());
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
