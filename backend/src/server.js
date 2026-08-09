require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const { testConnection } = require("./db/database");
const newsletterRoutes = require("./routes/newsletter");
const stayRoutes = require("./routes/stay");
const bookingRoutes = require("./routes/booking");

const app = express();

const PORT = process.env.PORT || 4000;

app.use(helmet());

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
  })
);

app.use(
  express.json({
    limit: "10kb"
  })
);

app.get("/api/health", async (req, res) => {
  res.json({
    success: true,
    message: "SpendSelf API is running."
  });
});

app.use("/api/newsletter", newsletterRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/stays", stayRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found."
  });
});

async function startServer() {
  try {
    await testConnection();

    app.listen(PORT, () => {
      console.log(
        `SpendSelf API running on http://localhost:${PORT}`
      );
    });
  } catch (error) {
    console.error("Failed to connect to MySQL:", error);
    process.exit(1);
  }
}

startServer();