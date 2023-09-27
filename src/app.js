import express from "express";
import authRouter from "./auth.js";
import dotenv from "dotenv";
import mongoose from "mongoose";

// configure dotenv to access environment variables
dotenv.config();

const PORT = process.env.PORT || 3000;

// mongodb connection uri
const MONGO_URI =
  process.env.MONGO_URI ||
  "mongodb://127.0.0.1:27017/passport-jwt-express-auth";

// connect to mongodb
mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("successfully connected to mongodb");
  })
  .catch((err) => {
    console.log(err);
  });

// setup express server
const server = express();

server.use(express.json());
server.use("/api/v1/auth", authRouter);

// listen for connections
server.listen(PORT, () => {
  console.log(`server is listening on port ${PORT}`);
});
