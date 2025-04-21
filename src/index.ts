import express from "express";
import { Request, Response } from "express";
const app = express();

import { serverConfig } from "./config";
import { redisClient } from "./config";

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
import { LinkModel } from "./db";
import { randomHash } from "./utils/intex";
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
    try {
      const { title, link } = req.body;
      //@ts-ignore
      const userId = req.userId;

      await redisClient.connect();

      await redisClient.set(userId, JSON.stringify({ title, link, userId }), {
        EX: 60 * 60, // Set expiration time to 1 hour
        NX: true, // Set the key only if it does not already exist
      });

      await redisClient.quit();

      await ContentModel.create({
        title,
        link,
        userId,
        tags: [],
      });
      res.status(201).json({
        message: "Content created successfully",
        statusCode: 201,
        status: "success",
        body: { title, link, userId, tags: [] }, // Updated to use userid
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "Internal server error",
        statusCode: 500,
        status: "error",
        body: [],
      });
      return;
    }
  }
);

app.get(
  "/api/v1/content",
  userMiddleware,
  async (req: Request, res: Response) => {
    try { 
      // @ts-ignore
      const userId = req.userId;
      await redisClient.connect();
      const cachedContent = await redisClient.get(userId);
      if (cachedContent) {
        const parsedContent = JSON.parse(cachedContent);
        res.status(200).json({
          message: "Content fetched successfully",
          statusCode: 200,
          status: "success",
          body: parsedContent,
        });
        return;
      }

      const contents = await ContentModel.find({
        userId
      }).populate("userId", "username");

      res.status(200).json({
        message: "Content fetched successfully",
        statusCode: 200,
        status: "success",
        body: contents,
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
    finally{ 
      await redisClient.quit(); 
    }
  }
);

app.delete(
  "/api/v1/content",
  userMiddleware,
  async (req: Request, res: Response) => {
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
      body: content,
    });
  }
);

app.post(
  "/api/v1/brain/share",
  userMiddleware,
  async (req: Request, res: Response) => {
    const { share } = req.body;
    if (share) {
      const hash = randomHash(10);
      await LinkModel.create({
        //@ts-ignore
        userId: req.userId,
        hash: hash,
      });
      res.status(200).json({
        message: "/share/" + hash,
        statusCode: 200,
        status: "success",
        body: {},
      });
    } else {
      await LinkModel.deleteOne({
        //@ts-ignore
        userId: req.userId,
      });
      res.status(200).json({
        message: "Link deleted successfully",
        statusCode: 200,
        status: "success",
        body: {},
      });
    }
  }
);

app.get("/api/v1/brain/:sharelink", async (req: Request, res: Response) => {
  try {
    const { sharelink } = req.params;

    const link = await LinkModel.findOne({
      hash: sharelink,
    });

    if (!link) {
      res.status(404).json({
        message: "Link not found",
        statusCode: 404,
        status: "error",
        body: [],
      });
      return;
    }

    const contents = await ContentModel.find({
      //@ts-ignore
      userId: link.userId,
    }).populate("userId", "username");

    res.status(200).json({
      message: "Contents fetched successfully",
      statusCode: 200,
      status: "success",
      body: contents,
    });
  } catch (error) {
    res.status(500).json({
      messsage: "Internal server error",
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
  mongoose.connect(
    `mongodb://${dbConfig.dbHost}:${dbConfig.dbPort}/${dbConfig.dbName}`
  );

  console.log(`Server is running on port ${PORT}`);
});
