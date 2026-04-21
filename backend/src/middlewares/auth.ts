import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

import { User } from "@/models/user.js";
import HttpError from "@/utils/errorHandler.js";
import { TryCatch } from "@/middlewares/error.js";

export const isAuthenticated = TryCatch(
  async (req: Request, _res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return next(new HttpError(401, "Authentication required"));
    }

    const token = authHeader.split(" ")[1];
    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
      return next(new HttpError(500, "JWT_SECRET is not configured"));
    }

    let decoded: { id: string };

    try {
      decoded = jwt.verify(token, jwtSecret) as { id: string };
    } catch {
      return next(new HttpError(401, "Invalid or expired token"));
    }

    const user = await User.findById(decoded.id).select("_id email name");

    if (!user) {
      return next(new HttpError(401, "User no longer exists"));
    }

    req.user = {
      id: user.id,
      email: user.email,
      name: user.name,
    };

    return next();
  },
);
