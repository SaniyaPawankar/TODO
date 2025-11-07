import dotenv from "dotenv";
dotenv.config({ path: "./config.env" }); // ✅ Must come before any imports using env

import express from "express";
import "./database/connect.js";
import { userRouter } from "./routes/userRouter.js";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/user", userRouter);

app.use((req, res) => {
  res.status(404).json({ message: "content/page not found!" });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
