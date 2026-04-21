import type { IUser } from "@/models/user.js";

declare global {
  namespace Express {
    interface Request {
      user?: Pick<IUser, "name" | "email"> & { id: string };
    }
  }
}

export {};
