import config from "../../config/config"
import { prisma } from "../../lib/prisma"
import { jwtUtils } from "../../utils/jwtutils"
import { loginPayload } from "./auth.interface"
import bcrypt from 'bcrypt'
import jwt, { JsonWebTokenError, JwtPayload, SignOptions } from "jsonwebtoken"

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
        role : user.role,
        email : user.email

    }

   
    const accessToken = jwtUtils.token(jwtPayload,config.jwt_access_secret,config.jwt_access_expires_in as SignOptions);
    const refreshToken = jwtUtils.token(jwtPayload,config.jwt_refresh_secret,config.jwt_refresh_expires_in as SignOptions);
  

    return {
        accessToken,
        refreshToken
    }
  
}

const refreshToken = async(payload:string)=>{
      
    
     const verifiedToken = jwtUtils.verifyToken(payload,config.jwt_refresh_secret);

     if(!verifiedToken.success){
        throw new Error(verifiedToken.error);
     }

     const {id} = verifiedToken.data as JwtPayload;

     const user = await prisma.user.findUniqueOrThrow({
        where:{id}
     });

     if(user.activeStatus === 'BLOCKED'){
        throw new Error("user is blocked");
     }

     const jwtPayload = {
         id,
         name:user.name,
         role:user.role,
         email:user.name
     }

     const accessToken = jwtUtils.token(jwtPayload,config.jwt_access_secret,config.jwt_access_expires_in as SignOptions);
     return accessToken

}
export const authService = {
    loginUserDb,
    refreshToken
}