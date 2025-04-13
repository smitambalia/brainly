import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { serverConfig } from "../config";

export const userMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { authorization } = req.headers;
  console.log("authorisation", req.headers);
  try {
    const { JWT_SECRET } = serverConfig;
    const decoded = jwt.verify(authorization as string, JWT_SECRET);
    if (decoded) {
      // @ts-ignore
      req.userId = decoded.id;
      next();
    } else {
      res.status(401).json({
        message: "Unauthorized",
        statusCode: 401,
        status: "error",
        body: [],
      });
    }
  } catch (error) {
    console.log(error);
    res.status(401).json({
      message: "Unauthorized",
      statusCode: 401,
      status: "error",
      body: [],
    });
  }
};
