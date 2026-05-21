import jwt from "jsonwebtoken";
import { Router } from "express";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { loginSchema, registerSchema } from "../schemas/auth.schema";
import { JWT_SECRET } from "../lib/constants";
import { prisma } from "../db/prisma";

export const authRouter = Router();

authRouter.post("/register", async (req: Request, res: Response) => {
  const decoded = registerSchema.safeParse(req.body); // check schema = body 
  if (!decoded.success) {
    return res.status(400).json({ error: "Invalid request body" });
  }
  const { email, name, password }: any = decoded.data;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
      },
    });

    const token = jwt.sign({ id: user.id }, JWT_SECRET as string); //id+jwt secret token
    res.status(201).json({ user: user.name, token });
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

authRouter.post("/login", async (req: Request, res: Response) => {
  const decoded = loginSchema.safeParse(req.body);
  if (!decoded.success) {
    return res.status(400).json({ error: "Invalid request body" });
  }
  const { email, password }: any = decoded.data;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(400).json({ error: "Failed to find user" });
    }
    const comparePassword = await bcrypt.compare(password, user.password);
    if (!comparePassword) {
      return res.status(400).json({ error: "Invalid password" });
    }
    const token = jwt.sign({ id: user.id }, JWT_SECRET as string);
    res.status(200).json({ user: user.name, token });
  } catch (error) {
    res.status(500).json({ error: "Failed to login user" });
  }
});