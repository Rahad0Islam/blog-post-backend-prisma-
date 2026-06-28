import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../../utils/utils";
import { authService } from "./auth.service";
import { sendResponse } from "../../utils/sendResponse";
import httpstatus from "http-status"
import { userService } from "../user/user.service";


const loginUser = asyncHandler(async(req:Request,res:Response,next:NextFunction)=>{
       const payload = req.body;

       const {accessToken , refreshToken} =await authService.loginUserDb(payload);
       
       res.cookie("accessToken",accessToken,{
         httpOnly:true,
         secure:false,
         sameSite:"none",
         maxAge:1000* 60 * 60 * 24 
       })

        res.cookie("refreshToken",refreshToken,{
         httpOnly:true,
         secure:false,
         sameSite:"none",
         maxAge:1000* 60 * 60 * 24 
       })


       return sendResponse(res,{
        success:true,
         statuscode:httpstatus.OK,
         message:"Log in successfully",
         data:{accessToken , refreshToken}
       })
})


const refreshToken = asyncHandler(async(req:Request,res:Response,next:NextFunction)=>{
  
  const refreshToken = req.cookies.refreshToken;
  
  const accessToken =await authService.refreshToken(refreshToken);
  console.log("first")
  
  res.cookie("accessToken",accessToken,{
        httpOnly:true,
        secure:false,
        sameSite:"none",
        maxAge:1000* 60 * 60 * 24 
      })

  return sendResponse(res,{
        success:true,
         statuscode:httpstatus.OK,
         message:"token refresh successfully",
         data: {accessToken}
       })
  

})
export const authController = {
    loginUser,
    refreshToken
}