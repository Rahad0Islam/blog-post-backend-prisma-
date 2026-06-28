import { NextFunction, Request, RequestHandler, Response } from "express";
import { prisma } from "../../lib/prisma";
import bcrypt from 'bcrypt'
import config from "../../config/config";
import httpstatus from "http-status";
import { userService } from "./user.service";
import { asyncHandler } from "../../utils/utils";
import { sendResponse } from "../../utils/sendResponse";
import jwt from 'jsonwebtoken'
import { jwtUtils } from "../../utils/jwtutils";




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
     const {accessToken} = req.cookies;

     const verified = jwtUtils.verifyToken(accessToken, config.jwt_access_secret);

     if (!verified || (verified as any).success === false) {
       const err = (verified as any)?.error ?? 'Invalid token';
       throw new Error(err);
     }

     const payload = verified.data as jwt.JwtPayload | string;
     if (typeof payload === 'string') {
       throw new Error('Invalid token payload');
     }

     const user = await userService.getProfileFromDb(payload.id as string);
     console.log(user)
     
     return sendResponse(res,{
       success:true,
       statuscode:httpstatus.OK,
       message:"profile fetch successfully ",
       data:{
        user
       }
     })
})


export const userController ={
    userCreate,
    getMyProfile
}