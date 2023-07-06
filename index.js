const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const colors = require("colors");
const cors = require("cors");
const mongoose = require("mongoose");
const userRoute = require("./routes/user");
//rest objects

const app = express();
dotenv.config();
//middleware

app.use(express.json());
app.use(morgan("dev"));
app.use(cors());

app.use("/api/v1/user", userRoute);

//connect with database
const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGODB);
    console.log("Connected".bgYellow);
  } catch (error) {
    throw error;
  }
};

mongoose.connection.on("disconnected", () => {
  console.log("disconnected");
});
mongoose.connection.on("connected", () => {
  console.log("connected".bgGreen);
});

//routes

app.get("/", (req, res) => {
  res.send("Hello world");
});

//port
const port = process.env.PORT || 8000;

app.listen(port, () => {
  connect();
  console.log(`server running on ${port}`.bgBlue);
});
