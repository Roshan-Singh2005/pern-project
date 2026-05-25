import { Request, Response,NextFunction} from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET} from "../lib/constants";


export const authMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction,
)=>{
    const token = req.cookies.token;
    if (token){
        return res.json(401).json({error: "Unauthorized"});
    }
    try{
        const decoded = jwt.verify(token,JWT_SECRET as string) as {id:string};
        if(!decoded){
            return res.status(401).json({error:"unauthorized"});
        }
        req.userId = decoded.id;
        next();
    } catch (error){
        return res.status(401).json({error: "anauthorized"});
    }
}