import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../../utils/utils";
import { postService } from "./post.service";
import { sendResponse } from "../../utils/sendResponse";
import httpstatus from 'http-status'
import { Role } from "../../../generated/prisma/enums";

const getAllPosts = asyncHandler(async(req:Request,res:Response,next:NextFunction)=>{
     
    const allPost = await postService.getAllPostsFromDb();
    
     return sendResponse(res,{
        success:true,
        statuscode:httpstatus.CREATED,
        message:"all posts fetched Succesfully",
        data:allPost

      })

})

const createPost = asyncHandler(async(req:Request,res:Response,next:NextFunction)=>{
      const payload = req.body;
      const authorId = req.user?.id;
      const post = await postService.createPostIntoDb(payload,authorId as string);
      
      return sendResponse(res,{
        success:true,
        statuscode:httpstatus.CREATED,
        message:"post created Succesfully",
        data:post

      })

})

const getMypost = asyncHandler(async(req:Request,res:Response,next:NextFunction)=>{
     
     const userId = req.user?.id
     const post = await postService.getMypostFromDb(userId as string);
     if(!post){
        return sendResponse(res,{
        success:true,
        statuscode:httpstatus.OK,
        message:"Not create post Yet",
        data:[]
      })
     }

     return sendResponse(res,{
        success:true,
        statuscode:httpstatus.OK,
        message:"own post fetced Succesfully",
        data:post

      })
})


const getPostById = asyncHandler(async(req:Request,res:Response,next:NextFunction)=>{
    const postId = req.params.postId;
    const post = await postService.getPostByid(postId as string);
    console.log({post})

     return sendResponse(res,{
        success:true,
        statuscode:httpstatus.OK,
        message:" post fetced Succesfully and view increase by 1",
        data:post

      })
})

const deletePost = asyncHandler(async(req:Request,res:Response,next:NextFunction)=>{
    const authorId = req.user?.id;
     const postId = req.params.postId;
     const isAdmin = req.user?.role === Role.ADMIN
     await postService.deletePost(postId as string,authorId as string,isAdmin);

      return sendResponse(res,{
        success:true,
        statuscode:httpstatus.OK,
        message:" post deleted succesfully",
        data:[]

      })
})

const updatedPost = asyncHandler(async(req:Request,res:Response,next:NextFunction)=>{
     const authorId = req.user?.id;
     const postId = req.params.postId;
     const payload = req.body;
     const isAdmin = req.user?.role === Role.ADMIN

     const updatePost = await postService.updatePost(postId as string,payload,authorId as string,isAdmin);
     
       return sendResponse(res,{
        success:true,
        statuscode:httpstatus.OK,
        message:" post updated succesfully",
        data:updatePost

      })

})

const statistics = asyncHandler(async(req:Request,res:Response,next:NextFunction)=>{
     const stats = await postService.getPostStats();

      return sendResponse(res,{
        success:true,
        statuscode:httpstatus.OK,
        message:" post statics retrieved succesfully",
        data:stats

      })
})
export const postController ={
    getAllPosts,
    createPost,
    getMypost,
    getPostById,
    deletePost,
    updatedPost,
    statistics

}