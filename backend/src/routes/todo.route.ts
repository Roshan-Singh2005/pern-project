import { Router } from "express";
import { Request, Response } from "express";
import { createTodoSchema } from "../schemas/todo.schema";
import { prisma } from "../db/prisma";

export const todoRouter = Router();

todoRouter.post("/create", async (req: Request, res: Response) => {
  console.log("todo");
  const decoded = createTodoSchema.safeParse(req.body);
  if (!decoded.success) {
    return res.status(400).json({ error: "Invalid request body" });
  }
  const userId = req.userId as string;

  const { title, description } = decoded.data;

  try {
    const todo = await prisma.todo.create({
      data: {
        title,
        description,
        userId: userId,
      },
    });
    res.status(201).json({ todo });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
});