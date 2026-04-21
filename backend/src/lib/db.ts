import mongoose from "mongoose";

export const connectDB = () => {
  const mongoURL = process.env.MONGO_URI || process.env.MONGO_URL;
  const dbName = process.env.DB_NAME || "ai-task-platform";

  if (!mongoURL) {
    throw new Error("MONGO_URI (or MONGO_URL) is required.");
  }

  mongoose
    .connect(mongoURL, { dbName })
    .then((c) => {
      console.log(`Connected with ${c.connection.name}`);
    })
    .catch((e) => {
      console.error("Mongo connection failed:", e);
      process.exit(1);
    });
};
