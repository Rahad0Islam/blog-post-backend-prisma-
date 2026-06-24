import { NextFunction, Request, RequestHandler, Response } from "express";
import httpstatus from "http-status";
export const asyncHandler = (fn : RequestHandler)=>{
    return async(req:Request , res:Response , next: NextFunction)=>{
        try {
          await fn(req,res,next);
        } catch (error:any) {

        console.log(error);
        res.status(httpstatus.INTERNAL_SERVER_ERROR).json({
        sucess:false,
        statusCode:httpstatus.INTERNAL_SERVER_ERROR, 
        message: "register failed " ,
        error:error.message
    })
    }
}
}