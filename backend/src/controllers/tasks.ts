import type { Request, Response } from "express";

import { TryCatch } from "@/middlewares/error.js";
import HttpError from "@/utils/errorHandler.js";
import { Task, type TaskOperation, type TaskStatus } from "@/models/task.js";

import { redisClient } from "@/lib/redis.js";

const isValidStatus = (status: string): status is TaskStatus => {
  return ["pending", "running", "success", "failed"].includes(status);
};

export const createTask = TryCatch(async (req: Request, res: Response) => {
  const userId = req.user?.id;

  if (!userId) {
    throw new HttpError(401, "Authentication required");
  }

  const { title, inputText, operation } = req.body as {
    title?: string;
    inputText?: string;
    operation?: TaskOperation;
  };

  if (!title || !inputText || !operation) {
    throw new HttpError(400, "title, inputText, and operation are required");
  }

  if (
    !["uppercase", "lowercase", "reverse", "word_count"].includes(operation)
  ) {
    throw new HttpError(400, "Invalid operation value");
  }

  const task = await Task.create({
    userId,
    title,
    inputText,
    operation,
    status: "pending",
    logs: [
      {
        level: "info",
        message: "Task queued for processing",
        at: new Date(),
      },
    ],
  });

  const queueName = process.env.QUEUE_NAME || "task_queue";
  await redisClient.rPush(
    queueName,
    JSON.stringify({
      taskId: task._id.toString(),
      operation: task.operation,
      input: task.inputText,
    })
  );

  res.status(201).json({
    success: true,
    message: "Task created successfully",
    task,
  });
});

export const getTasks = TryCatch(async (req: Request, res: Response) => {
  const userId = req.user?.id;

  if (!userId) {
    throw new HttpError(401, "Authentication required");
  }

  const status = String(req.query.status || "")
    .trim()
    .toLowerCase();
  const search = String(req.query.search || "").trim();

  const filter: {
    userId: string;
    status?: TaskStatus;
    title?: { $regex: string; $options: string };
  } = { userId };

  if (status && isValidStatus(status)) {
    filter.status = status;
  }

  if (search) {
    filter.title = { $regex: search, $options: "i" };
  }

  const tasks = await Task.find(filter).sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: tasks.length,
    tasks,
  });
});

export const getTaskById = TryCatch(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const { id } = req.params;

  if (!userId) {
    throw new HttpError(401, "Authentication required");
  }

  const task = await Task.findOne({ _id: id, userId });

  if (!task) {
    throw new HttpError(404, "Task not found");
  }

  res.status(200).json({
    success: true,
    task,
  });
});

export const updateTask = TryCatch(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const { id } = req.params;

  if (!userId) {
    throw new HttpError(401, "Authentication required");
  }

  const task = await Task.findOne({ _id: id, userId });

  if (!task) {
    throw new HttpError(404, "Task not found");
  }

  const { title, inputText, operation, status } = req.body as {
    title?: string;
    inputText?: string;
    operation?: TaskOperation;
    status?: TaskStatus;
  };

  if (title !== undefined) {
    task.title = title;
  }

  if (inputText !== undefined) {
    task.inputText = inputText;
  }

  if (operation !== undefined) {
    if (
      !["uppercase", "lowercase", "reverse", "word_count"].includes(operation)
    ) {
      throw new HttpError(400, "Invalid operation value");
    }

    task.operation = operation;
  }

  if (status !== undefined) {
    if (!isValidStatus(status)) {
      throw new HttpError(400, "Invalid status value");
    }

    task.status = status;
  }

  let requeue = false;
  if (inputText !== undefined || operation !== undefined) {
    task.status = "pending";
    requeue = true;
  }

  task.logs.push({
    level: "info",
    message: requeue ? "Task updated and re-queued for processing" : "Task updated",
    at: new Date(),
  });

  await task.save();

  if (requeue) {
    const queueName = process.env.QUEUE_NAME || "task_queue";
    await redisClient.rPush(
      queueName,
      JSON.stringify({
        taskId: task._id.toString(),
        operation: task.operation,
        input: task.inputText,
      })
    );
  }

  res.status(200).json({
    success: true,
    message: "Task updated successfully",
    task,
  });
});
