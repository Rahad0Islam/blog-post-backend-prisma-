import { NextFunction, Request, RequestHandler, Response } from "express";
import { prisma } from "../../lib/prisma";
import bcrypt from 'bcrypt'
import config from "../../config/config";
import httpstatus from "http-status";
import { userService } from "./user.service";
import { asyncHandler } from "../../utils/utils";
import { sendResponse } from "../../utils/sendResponse";





const userCreate = asyncHandler(async(req:Request,res:Response,next:NextFunction)=>{
       const payload = req.body;
      //  console.log(payload);
        const user = await userService.registerIntoDb(payload);

      return sendResponse(res,{
        success:true,
        statuscode:httpstatus.CREATED,
        message:"register successfully",
        data:user
      })
})

const getMyProfile = asyncHandler(async(req:Request,res:Response,next:NextFunction)=>{
     res.send("get my profile")
})


export const userController ={
    userCreate,
    getMyProfile
}