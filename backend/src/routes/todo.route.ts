import { Router } from "express";
import { Request, Response } from "express";
import { createTodoSchema } from "../schemas/todo.schema";
import { updateTodoSchema,deleteTodoSchema } from "../schemas/todo.schema";
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
    return res.status(201).json(todo.title);
  } catch (error) {
    return res.status(500).json({ message: error });
  }
});

todoRouter.get("/:id", async(req:Request , res:Response)=>{
  const todoId = req.params.id;
  try{
    const todo = await prisma.todo.findUnique({
      where :{
        id: todoId as string,
      },
    });
    if(!todo){
      return res.status(404).json({mesage:"Todo not found"});
    }
    res.status(200).json(todo);
  }catch(error){
    res.status(500).json({message: error});
  }
});

todoRouter.get("/",async(req:Request,res:Response)=>{
  try{
  const userId = req.userId as string;
  const todos = await prisma.todo.findMany({
    where:{
      userId: userId,
    },
  });
  res.status(200).json(todos);
  }catch(error){
    res.status(500).json({message:error});
  }
});

todoRouter.put("/:id",async(req:Request,res:Response)=>{
  const todoId =req.params.id;
  const decoded: any = updateTodoSchema.safeParse(req.body);
  const {title,description} = decoded.data;
  if(!decoded.success){
    return res.status(400).json({error:"invalid request body"});
  }try{
    const todo = await prisma.todo.update({
      where:{
        id : todoId as string,
      },
      data : {
        title: title,
        description : description,
      },
    });
    res.status(200).json(todo);
  }catch(error){
    res.status(500).json({message:error});
  }
});

todoRouter.delete("/:id",async(req:Request, res:Response)=>{
  const todoId = req.params.id;
  const decoded: any = deleteTodoSchema.safeParse(req.body);
   if(!decoded.success){
    return res.status(400).json({error:"invalid request body"});
   }try{
    const todo = await prisma.todo.delete({
      where:{
        id : todoId as string,
      },
    });
    res.status(200).json({message:"Todo Deleted"});
  }catch(error){
    res.status(500).json({message:error});
  }
});