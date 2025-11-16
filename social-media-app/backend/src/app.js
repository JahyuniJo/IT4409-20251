const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();

app.use(express.json());
app.use(cors());
app.use(cookieParser());

app.use("/auth", require("./routes/auth"));

app.listen(5000, () => console.log("Server chạy port 5000"));
