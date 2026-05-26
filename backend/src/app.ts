import express from "express";
import cookieParser from "cookie-parser"
import { authRouter } from "./routes/auth.route";
import { todoRouter } from "./routes/todo.route";
import { authMiddleware } from "./middleware/auth.middleware";

const app = express();


app.use(express.json());
app.use(cookieParser());

app.get("/health",(req,res)=>{
    res.send("Running");
});

app.use("/auth", authRouter);
app.use("/todo", authMiddleware, todoRouter);


app.listen(3000,()=>{
    console.log("server started");
})