import { Request, Response } from "express";
import { prisma } from "../../lib/prisma";
import bcrypt from 'bcrypt'
import config from "../../config/config";
import httpstatus from "http-status";
import { userService } from "./user.service";


const userCreate = async (req: Request, res: Response) => {
  const payload = req.body;
  // console.log(payload);
try {
      const user = await userService.registerIntoDb(payload);
    
     
      res.status(httpstatus.CREATED).json({
        sucess:true,
        statusCode:httpstatus.CREATED, 
        message: "register succesfully " ,
        data:user
      
      });
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


export const userController ={
    userCreate
}