const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const { router: authRoutes } = require("./routes/authUserRoutes.js");
const cartRoutes = require("./routes/cartUserRoutes.js");
const adminAuthRoutes = require("./routes/authAdminRoutes.js");
const userRoutes = require("./routes/userRoutes");
const cartAdminRoutes = require("./routes/cartAdminRoutes.js");

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

app.use("/api/books", require("./routes/bookRoutes"));
app.use("/api", authRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/auth/admin", adminAuthRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin/carts", cartAdminRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
