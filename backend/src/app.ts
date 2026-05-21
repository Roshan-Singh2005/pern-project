import express from "express";
import { authRouter } from "./routes/auth.route";
const app = express();


app.use(express.json());

app.get("/health",(req,res)=>{
    res.send("Running");
});

app.use("/auth", authRouter);


app.listen(3000,()=>{
    console.log("server started");
})