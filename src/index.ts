import express from "express";
import { Request, Response } from "express";
const app = express();

import { serverConfig } from "./config";
import cors from "cors";
const PORT = serverConfig.serverPort || 5001;
console.log(`Server port: ${PORT}`);

import { UserModel } from "./db";

// Middleware to parse JSON request bodies
app.use(express.json());
// Middleware to parse URL-encoded request bodies
app.use(express.urlencoded({ extended: true }));

// Enable CORS middleware
app.use(
  cors({
    origin: "*", // Allow all origins (use specific origins in production)
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.post("/api/v1/user/signup", async (req: Request, res: Response) => {
  //zod validation
  const { username, password } = req.body;

  try {
    await UserModel.create({
      username,
      password,
    });
    
    res.status(201).json({
      message: "User created successfully",
      statusCode: 201,
      status: "success",
      body: { username },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error",
      statusCode: 500,
      status: "error",
      body: [],
    });
  }
});

app.get("/", (req: Request, res: Response) => {
  console.log("Request received at root endpoint");
  res.status(200).json({
    message: "Welcome to the Express server!",
    statusCode: 200,
    status: "success",
    body: [],
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
