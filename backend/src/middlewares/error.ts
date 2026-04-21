import { NextFunction, Request, Response } from "express";
import HttpError from "@/utils/errorHandler.js";

export const errorMiddleware = (
  err: HttpError | Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction,
) => {
  const statusCode = err instanceof HttpError ? err.statusCode : 500;
  const message = err.message || "Internal Server Error";
  const envMode = process.env.NODE_ENV?.trim() || "DEVELOPMENT";

  const response: {
    success: boolean;
    message: string;
    error?: string;
  } = {
    success: false,
    message,
  };

  if (envMode === "DEVELOPMENT") {
    response.error = err.stack;
  }

  return res.status(statusCode).json(response);
};

type ControllerType = (
  req: Request,
  res: Response,
  next: NextFunction,
) => Promise<void | Response<unknown, Record<string, unknown>>>;

export const TryCatch =
  (passedFunc: ControllerType) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await passedFunc(req, res, next);
    } catch (error) {
      next(error);
    }
  };
