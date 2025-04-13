import express from "express";
import { Request, Response } from "express";
const app = express();

import { serverConfig } from "./config";
import cors from "cors";
const PORT = serverConfig.serverPort || 5001;
console.log(`Server port: ${PORT}`);

// Database connection
import mongoose from "mongoose";
import { dbConfig } from "./config";

import { ContentModel, UserModel } from "./db";
import jwt from "jsonwebtoken";
// Middleware to parse JSON request bodies

import { userMiddleware } from "./middlewares";
app.use(express.json()); // Middleware to parse URL-encoded request bodies
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

app.post("/api/v1/user/signin", async (req: Request, res: Response) => {
  //zod validation
  const { username, password } = req.body;

  try {
    const user = await UserModel.findOne({ username, password });
    if (!user) {
      res.status(401).json({
        message: "Invalid credentials",
        statusCode: 401,
        status: "error",
        body: [],
      });
    }

    // Generate JWT token

    const token = jwt.sign(
      {
        id: user?._id,
      },
      serverConfig.JWT_SECRET
    );

    res.status(200).json({
      message: "User logged in successfully",
      statusCode: 200,
      token: token,
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

app.post(
  "/api/v1/content",
  userMiddleware,
  async (req: Request, res: Response) => {
    const { title, link } = req.body;

    await ContentModel.create({
      title,
      link,
      //@ts-ignore
      userId: req.userId,
      tags: [],
    });
    res.status(201).json({
      message: "Content created successfully",
      statusCode: 201,
      status: "success",
      //@ts-ignore
      body: { title, link, userId: req.userId, tags: [] },
    });
  }
);

app.get(
  "/api/v1/content",
  userMiddleware,
  async (req: Request, res: Response) => {
    const contents = await ContentModel.find({
      //@ts-ignore
      userId: req.userId,
    }).populate("userId","username");

    res.status(200).json({
      message: "Content fetched successfully",
      statusCode: 200,
      status: "success",
      body: contents,
    });
  }
);

app.delete("/api/v1/content", userMiddleware, async ( req: Request, res: Response) => {
    const { contentId } = req.body;
    const content = await ContentModel.deleteMany({
        //@ts-ignore
        userId: req.userId,
        id: contentId,
    });

    res.status(200).json({
        message: "Content deleted successfully",
        statusCode: 200,
        status: "success",
        body: content
    });
})
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
  mongoose.connect(
    `mongodb://${dbConfig.dbHost}:${dbConfig.dbPort}/${dbConfig.dbName}`
  );

  console.log(`Server is running on port ${PORT}`);
});
