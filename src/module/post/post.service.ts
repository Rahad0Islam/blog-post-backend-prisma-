import { commentStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { createPostPayload, IupdatedPost } from "./post.interface";

const getAllPostsFromDb = async()=>{
    const allPosts = await prisma.post.findMany({
        include:{
            author:{
                omit:{
                    password:true
                }
            },
            comments:true
        }
    });
    return allPosts;
}

const createPostIntoDb = async(payload:createPostPayload,authorId:string)=>{
    const {title,content,thumbnail,status,tags} = payload;
    const post = await prisma.post.create({
        data:{
            title,
            content,
            thumbnail,
            status,
            tags,
            authorId
        }
    })

    return post;
}

const getMypostFromDb = async(authorId:string)=>{
    console.log(authorId)
    const post = await prisma.post.findMany({
        where:{
            authorId
        },
        orderBy:{
            createdAt:"desc"
        },
        include:{
            author:{
                omit:{
                    password:true
                }
            },
            comments:true,
            _count:{
                select:{
                    comments:true 
                }
            }
        }
    })
    
    return post;
}

const getPostByid = async(postId:string)=>{
    // const post = await prisma.post.findUniqueOrThrow({
    //     where:{
    //         id:postId
    //     }
    // })
 

    const transaction = prisma.$transaction(async(tx)=>{

       await tx.post.update({
        where:{
            id:postId
        },
        data:{
            views:{
                increment:1
            }
        }
        
    })

    // throw new Error("fake error")

   const post =  await tx.post.findUniqueOrThrow({
        where:{
            id:postId
        },
        include:{
            author:{
                omit:{
                    password:true
                }
            },
            comments:{
                where:{
                    status:commentStatus.APPROVED
                },
                orderBy:{
                    createdAt:"desc"
                },
                
            },
            _count:{
                select:{
                    comments:true
                }
            }
        }
    })

    return post;

    })


    return transaction;
    
  
}

const updatePost = async(postId:string,payload:IupdatedPost,authorId:string,isAdmin:boolean)=>{
     
    const post = await prisma.post.findUniqueOrThrow({
        where:{
            id:postId
        }
    })
   
    console.log({isAdmin,authorId})
    if(post.authorId !== authorId  && !isAdmin){
        throw new Error("you can not updated this post");
    }

    const updatedpost = await prisma.post.update({
        where:{
            id:postId
        },
        data : payload,
         include:{
            author:{
                omit:{
                    password:true
                }
            },
            comments:true
        },


    })
    return updatedpost;
}

const deletePost = async(postId:string,authorId:string,isAdmin:boolean)=>{
     
    const post = await prisma.post.findUniqueOrThrow({
        where:{
            id:postId
        }
    })
   if(!post){
    throw new Error("post does not found");

   }

  
    if(post.authorId !== authorId  && !isAdmin){
        throw new Error("you can not updated this post");
    }


    await prisma.post.delete({
        where:{
            id:postId
        }
    })

    
    return ;
}

export const postService = {
    getAllPostsFromDb,
    createPostIntoDb,
    getMypostFromDb,
    getPostByid,
    updatePost,
    deletePost


}