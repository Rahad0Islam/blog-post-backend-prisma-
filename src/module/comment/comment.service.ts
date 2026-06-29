import { commentStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { ImoderateComment, Ipayload } from "./comment.interface";

const getCommentsByAuthor = async (authorId: string) => {
  const comments = await prisma.comment.findMany({
    where: {
      authorId
    },
    include: {
      post: {
        select: {
          title: true,
          id: true
        }
      }
    }
  });
  return comments;
};

const createCommentIntoDb = async (payload: Ipayload, authorId: string) => {
  const { content, postId } = payload;
  const post = await prisma.post.findUnique({
    where: {
      id: postId
    }
  });

  if (!post) {
    throw new Error("Post not found");
  }
  const comment = await prisma.comment.create({
    data: {
      content,
      postId,
      authorId
    }
  });
  return comment;
};

const updateComment = async (commentId: string, content: string, authorId: string) => {
  const comment = await prisma.comment.findUniqueOrThrow({
    where: {
      id: commentId
    }
  });

  if (comment.authorId !== authorId) {
    throw new Error("You cannot update this comment");
  }

  const updatedComment = await prisma.comment.update({
    where: {
      id: commentId
    },
    data: {
      content
    }
  });

  return updatedComment;
};

const deleteComment = async (commentId: string, authorId: string) => {
  const comment = await prisma.comment.findUniqueOrThrow({
    where: {
      id: commentId
    }
  });   

  if (comment.authorId !== authorId) {
    throw new Error("You cannot delete this comment");
  }

  const deletedComment = await prisma.comment.delete({
    where: {
      id: commentId
    }
  });

  return deletedComment;
};

const moderateComment = async (commentId: string,data:ImoderateComment) => {

  const comment = await prisma.comment.findUniqueOrThrow({
    where: {
      id: commentId
    }
  });
   
   if(comment.status === data.status){
    throw new Error("This comment has already been moderated");
   }
  const moderatedComment = await prisma.comment.update({
    where: {
      id: commentId
    },
    data: {
      status: data.status as commentStatus
    }
  });

  return moderatedComment;
};

const getCommentById = async (commentId: string) => {
  const comment = await prisma.comment.findUniqueOrThrow({
    where: {
      id: commentId
    },
    include: {
      post: {
        select: {
          title: true,
          id: true,
          views:true
        }
      }
    }
  });

  return comment;
}

const getCommentBypostId = async (postId: string) => {
  const comments = await prisma.comment.findMany({
    where: {
      postId,
      status: commentStatus.APPROVED
    },
    include: {
      post: {
        select: {
          title: true,
          id: true,
          views:true
        }
      }
    }
  });

  return comments;
}

export const commentService = {
  getCommentsByAuthor,
  createCommentIntoDb,
  updateComment,
  deleteComment,
  moderateComment,
  getCommentById,
  getCommentBypostId
};