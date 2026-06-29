import { Request, Response } from "express";
import { asyncHandler } from "../../utils/utils";
import { commentService } from "./comment.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";
const getCommentsByAuthor = asyncHandler(async (req: Request, res: Response) => {
    const { authorId } = req.params;

    const comments = await commentService.getCommentsByAuthor(authorId as string);
    
    return sendResponse(res,{
        success:true,
        statuscode:httpStatus.OK,
        message:"comments fetched Succesfully",
        data:comments

      })
  });   

const getCommentById = asyncHandler(async (req: Request, res: Response) => {
    const { commentId } = req.params;

    const comment = await commentService.getCommentById(commentId as string);
    
    return sendResponse(res,{
        success:true,
        statuscode:httpStatus.OK,
        message:"comment fetched Succesfully",
        data:comment

      })
  });

const createComment = asyncHandler(async (req: Request, res: Response) => {
    const payload = req.body;
    const authorId = req.user?.id;

    const comment = await commentService.createCommentIntoDb(payload,authorId as string);
    
    return sendResponse(res,{
        success:true,
        statuscode:httpStatus.CREATED,
        message:"comment created Succesfully",
        data:comment

      })
  });

const updateComment = asyncHandler(async (req: Request, res: Response) => {
    const { commentId } = req.params;
    const { content } = req.body;
    const authorId = req.user?.id;

    const updatedComment = await commentService.updateComment(commentId as string, content, authorId as string);
    
    return sendResponse(res,{
        success:true,
        statuscode:httpStatus.OK,
        message:"comment updated Succesfully",
        data:updatedComment

      })
  });

const deleteComment = asyncHandler(async (req: Request, res: Response) => {
    const { commentId } = req.params;
    const authorId = req.user?.id;

    const deletedComment = await commentService.deleteComment(commentId as string, authorId as string);
    
    return sendResponse(res,{
        success:true,
        statuscode:httpStatus.OK,
        message:"comment deleted Succesfully",
        data:deletedComment

      })
  });


const commentmoderate = asyncHandler(async (req: Request, res: Response) => {
    const { commentId } = req.params;
    const data = req.body;
    const isAdmin = req.user?.role === "admin" as string;
    
    if(!isAdmin) {
        return sendResponse(res,{
            success:false,
            statuscode:httpStatus.FORBIDDEN,
            message:"you are not authorized to moderate comment",
            data:null

          })
    };

    const moderatedComment = await commentService.moderateComment(commentId as string,data);
    
    return sendResponse(res,{
        success:true,
        statuscode:httpStatus.OK,
        message:"comment moderated Succesfully",
        data:moderatedComment

      })
  });

const getCommentBypostId = asyncHandler(async (req: Request, res: Response) => {
    const { postId } = req.params;

    const comments = await commentService.getCommentBypostId(postId as string);
    
    return sendResponse(res,{
        success:true,
        statuscode:httpStatus.OK,
        message:"comments fetched Succesfully",
        data:comments

      })
  });
  export const commentController = {
    getCommentsByAuthor,
    createComment,
    updateComment,
    deleteComment,
    getCommentBypostId,
    commentmoderate,
    getCommentById
  }