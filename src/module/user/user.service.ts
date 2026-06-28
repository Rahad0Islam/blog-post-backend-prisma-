import config from "../../config/config";
import { prisma } from "../../lib/prisma";
import bcrypt from "bcrypt";
import { registerPayload } from "./user.interface";

const registerIntoDb = async (payload: registerPayload) => {
  const { email, name, profilePhoto, password } = payload;
  const emailExist = await prisma.user.findUnique({
    where: { email },
  });

  if (emailExist) {
    throw new Error("email already exist");
  }

  const hashPassword = await bcrypt.hash(
    password,
    Number(config.bcrypt_salt_rounds),
  );

  const createdUser = await prisma.user.create({
    data: {
      name,
      email,
      password: hashPassword,
      profile:{
        create:{
          profilePhoto
        }
      }
    },

  });

  // await prisma.profile.create({
  //   data: {
  //     userId: createdUser.id,
  //     profilePhoto,
  //   },
  // });

  const user = await prisma.user.findUnique({
    where: {
      email,
      id: createdUser.id,
    },
    omit: {
      password: true,
    },
    include: {
      profile: true,
    },
  });

  // console.log(user);
  return user;
};


 const getProfileFromDb = async(userId : string)=>{
     const user = await prisma.user.findUniqueOrThrow({
       where:{id:userId},
       include:{
        profile:true
       },
       omit:{
        password:true
       }
     })
     return user;
 }
export const userService = {
  registerIntoDb,
  getProfileFromDb
};
