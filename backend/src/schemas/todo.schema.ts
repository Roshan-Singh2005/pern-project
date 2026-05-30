import {z} from "zod";

export const createTodoSchema= z.object({
    title : z.string(),
    description : z.string().optional(),
});

export const updateTodoSchema= z.object({
    title : z.string(),
    description : z.string().optional(),
});