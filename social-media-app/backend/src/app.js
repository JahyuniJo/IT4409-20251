// src/app.js
const express = require("express");
const cors = require("cors");
const authRoutes = require("./api/routes/auth");
const usersRoutes = require("./api/routes/users");



const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoutes);
module.exports = app;
