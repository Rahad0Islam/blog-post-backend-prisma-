import config from "../../config/config";
import { prisma } from "../../lib/prisma";
import bcrypt from 'bcrypt'
import { registerPayload } from "./user.interface";


const registerIntoDb = async(payload:registerPayload)=>{
    
    const {email,name,profilePhoto,password} = payload
    const emailExist = await prisma.user.findUnique({
    where: { email },
  });

  if(emailExist){
    throw new Error("email already exist");
  }

  const hashPassword = await bcrypt.hash(password,Number(config.bcrypt_salt_rounds));

  const createdUser = await prisma.user.create({
    data:{
       name,
       email,
       password:hashPassword
    }
  })

  await prisma.profile.create({
    data:{
       userId:createdUser.id,
       profilePhoto
    }
  })

  const user = await prisma.user.findUnique({
    where:{
       email,
       id:createdUser.id
    },
    omit:{
       password:true
    },
    include:{
      profile:true
    }
  })
       
// console.log(user);
   return user;
}


export const userService ={
   registerIntoDb
}