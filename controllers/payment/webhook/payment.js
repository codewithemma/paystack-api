const ipaddr = require("ipaddr.js");
const crypto = require("crypto");
const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
const PAYSTACK_IPS = ["52.31.139.75", "52.49.173.169", "52.214.14.220"];

const paymentWebhook = async (req, res) => {
  try {
    const clientIp = (
      req.headers["x-forwarded-for"] ||
      req.connection.remoteAddress ||
      ""
    )
      .split(",")[0]
      .trim();

    //! Validate IP Addresses from Paystack
    const isIpAllowed = PAYSTACK_IPS.some((allowedIP) => {
      if (allowedIP.includes("/")) {
        // Handle CIDR notation
        const [subnet, prefixLength] = allowedIP.split("/");
        const parsedSubnet = ipaddr.parse(subnet);
        const parsedClientIp = ipaddr.parse(clientIp);
        return parsedClientIp.match(parsedSubnet, parseInt(prefixLength, 10));
      } else {
        // Handle specific IP
        return (
          ipaddr.parse(clientIp).toString() ===
          ipaddr.parse(allowedIP).toString()
        );
      }
    });

    if (!isIpAllowed) {
      return res.status(403).json({ message: "Forbidden: Invalid IP Address" });
    }

    const hash = crypto
      .createHmac("sha512", PAYSTACK_SECRET_KEY)
      .update(JSON.stringify(req.body))
      .digest("hex");

    if (hash == req.headers["x-paystack-signature"]) {
      const event = req.body;
      //   console.log("Webhook received:", event);
      switch (event.event) {
        case "charge.success":
          console.log("Payment successful:", event.data);
          // Update your database, send a confirmation email, etc.
          break;
        case "charge.failed":
          console.log("Payment failed:", event.data);
          // Handle failed payment: update your database, notify the user, etc.
          break;
        case "charge.cancelled":
          console.log("Payment cancelled:", event.data);
          // Handle cancelled payment: update your database, notify the user, etc.
          break;
        default:
          console.log("Unhandled event:", event.event);
      }
    }
  } catch (error) {
    res.status(500).json({ message: error || "Internal Server Error" });
  }
};
module.exports = paymentWebhook;
