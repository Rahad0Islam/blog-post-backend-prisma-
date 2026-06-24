import config from "../../config/config"
import { prisma } from "../../lib/prisma"
import { jwtUtils } from "../../utils/jwtutils"
import { loginPayload } from "./auth.interface"
import bcrypt from 'bcrypt'
import jwt, { SignOptions } from "jsonwebtoken"

const loginUserDb = async(payload:loginPayload)=>{
    const {email,password} = payload;
    const user = await prisma.user.findUniqueOrThrow({
        where:{
            email
        }
    })

    const passwordMatch = await bcrypt.compare(password,user.password);
    if(!passwordMatch){
        throw new Error("password is not matched");
    }
    
    const jwtPayload = {
        id : user.id,
        name : user.name,
        role : user.name,
        email : user.email

    }

   
    const accessToken = jwtUtils.token(jwtPayload,config.jwt_access_secret,config.jwt_access_expires_in as SignOptions);
    const refressToken = jwtUtils.token(jwtPayload,config.jwt_refresh_secret,config.jwt_refresh_expires_in as SignOptions);
  

    return {
        accessToken,
        refressToken
    }
  
}


export const authService = {
    loginUserDb
}