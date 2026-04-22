import mongoose from "mongoose";

export type TaskOperation =
  | "uppercase"
  | "lowercase"
  | "reverse"
  | "word_count";
export type TaskStatus = "pending" | "running" | "success" | "failed";

export interface ITaskLog {
  level: "info" | "warn" | "error";
  message: string;
  at: Date;
}

export interface ITask {
  userId: mongoose.Types.ObjectId;
  title: string;
  inputText: string;
  operation: TaskOperation;
  status: TaskStatus;
  result?: string;
  logs: ITaskLog[];
  createdAt: Date;
  updatedAt: Date;
}

const taskLogSchema = new mongoose.Schema<ITaskLog>(
  {
    level: {
      type: String,
      enum: ["info", "warn", "error"],
      required: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    at: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false },
);

const taskSchema = new mongoose.Schema<ITask>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, "Task title is required"],
      trim: true,
      minlength: [2, "Task title must be at least 2 characters"],
      maxlength: [120, "Task title is too long"],
    },
    inputText: {
      type: String,
      required: [true, "Input text is required"],
      maxlength: [10000, "Input text cannot exceed 10,000 characters"],
    },
    operation: {
      type: String,
      enum: ["uppercase", "lowercase", "reverse", "word_count"],
      required: [true, "Operation is required"],
      index: true,
    },
    status: {
      type: String,
      enum: ["pending", "running", "success", "failed"],
      default: "pending",
      index: true,
    },
    result: {
      type: String,
    },
    logs: {
      type: [taskLogSchema],
      default: [],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

taskSchema.index({ userId: 1, createdAt: -1 });
taskSchema.index({ title: "text", inputText: "text" });
taskSchema.index({ createdAt: 1 }, { expireAfterSeconds: 2592000 }); // 30 days

export const Task = mongoose.model<ITask>("Task", taskSchema);
