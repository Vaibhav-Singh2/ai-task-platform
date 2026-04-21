import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { TryCatch } from "@/middlewares/error.js";
import HttpError from "@/utils/errorHandler.js";
import { User } from "@/models/user.js";

const signToken = (id: string): string => {
  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    throw new HttpError(500, "JWT_SECRET is not configured");
  }

  return jwt.sign({ id }, jwtSecret, { expiresIn: "7d" });
};

export const register = TryCatch(async (req: Request, res: Response) => {
  const { name, email, password } = req.body as {
    name?: string;
    email?: string;
    password?: string;
  };

  if (!name || !email || !password) {
    throw new HttpError(400, "Name, email, and password are required");
  }

  if (password.length < 8) {
    throw new HttpError(400, "Password must be at least 8 characters");
  }

  const existingUser = await User.findOne({ email: email.toLowerCase() });

  if (existingUser) {
    throw new HttpError(409, "Email is already registered");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email: email.toLowerCase(),
    password: hashedPassword,
  });

  const token = signToken(user.id);

  res.status(201).json({
    success: true,
    message: "User registered successfully",
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  });
});

export const login = TryCatch(async (req: Request, res: Response) => {
  const { email, password } = req.body as {
    email?: string;
    password?: string;
  };

  if (!email || !password) {
    throw new HttpError(400, "Email and password are required");
  }

  const user = await User.findOne({ email: email.toLowerCase() }).select(
    "+password",
  );

  if (!user) {
    throw new HttpError(401, "Invalid email or password");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new HttpError(401, "Invalid email or password");
  }

  const token = signToken(user.id);

  res.status(200).json({
    success: true,
    message: "Login successful",
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  });
});
