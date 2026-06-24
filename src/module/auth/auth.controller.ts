import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../../utils/utils";
import { authService } from "./auth.service";
import { sendResponse } from "../../utils/sendResponse";
import httpstatus from "http-status"


const loginUser = asyncHandler(async(req:Request,res:Response,next:NextFunction)=>{
       const payload = req.body;

       const {accessToken , refressToken} =await authService.loginUserDb(payload);
       
       res.cookie("accesstoken",accessToken,{
         httpOnly:true,
         secure:false,
         sameSite:"none",
         maxAge:1000* 60 * 60 * 24 
       })

        res.cookie("refresstoken",refressToken,{
         httpOnly:true,
         secure:false,
         sameSite:"none",
         maxAge:1000* 60 * 60 * 24 
       })


       return sendResponse(res,{
        success:true,
         statuscode:httpstatus.OK,
         message:"Log in successfully",
         data:{accessToken , refressToken}
       })
})

export const authController = {
    loginUser
}