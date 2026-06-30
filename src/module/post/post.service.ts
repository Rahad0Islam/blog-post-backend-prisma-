import { commentStatus, postStatus } from "../../../generated/prisma/enums";
import { PostWhereInput } from "../../../generated/prisma/models";
import { prisma } from "../../lib/prisma";
import { createPostPayload, IpostSearchQuery, IupdatedPost } from "./post.interface";

const getAllPostsFromDb = async(query: IpostSearchQuery)=>{
    // console.log(query.searchTerm)
    const limit = query.limit ? Number(query.limit) : 10;
    const page = query.page ? Number(query.page) : 1;
    const skip = (page - 1) * limit;
    const sortBy = query.sortBy ? query.sortBy : "createdAt";
    const sortOrder = query.sortOrder ? query.sortOrder : "desc";

    const tags = query.tags ? JSON.parse(query.tags as string) : null;
    const tagsArray =  Array.isArray(tags) ? tags : [];

    const andCondition : PostWhereInput[] = [];
    
    if(query.searchTerm){
    andCondition.push({
        OR:[
            {
                title:{
                    contains:query.searchTerm,
                    mode:"insensitive"
                }
            },
            {
                content:{
                    contains:query.searchTerm,
                    mode:"insensitive"
                }
            }
        ]
    })
    }

    if(query.title){
        andCondition.push({
            title:query.title
        })
    }

    if(query.content){
        andCondition.push({
            content:query.content
        })
    }

  
    if(query.authorId){
        andCondition.push({
            authorId:query.authorId
        })
    }

    if(query.isFeatured){
        andCondition.push({
            isFeatured:Boolean(query.isFeatured)
        })
    }

    if(query.tags){
        andCondition.push({
            tags:{
                hasSome:tagsArray
            }
        })
    }
    

    if(query.status){
        andCondition.push({
            status:query.status as postStatus
        })
    }
    const allPosts = await prisma.post.findMany({
       
        // where:{
        //     AND:[

        //         //searching
        //         query.searchTerm?{
        //             OR:[
        //                 {
        //                 title:{
        //                     contains:query.searchTerm,
        //                     mode:"insensitive"
        //                 }
        //             },
        //             {
        //                 content:{
        //                     contains:query.searchTerm,
        //                     mode:"insensitive"
        //                 }  
                        
        //             }
        //             ]
        //         }:{},
        //         //title filter
        //         query.title?{
        //             title:query.title
        //         }:{},
        //         //content filter
        //         query.content?{
        //             content:query.content
        //         }:{}

        //     ]
        // },
        where:{
            AND:andCondition
        },
        take:limit,
        skip:skip,
        orderBy:{
            [sortBy]:sortOrder
        },

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

const getPostStats = async()=>{
    const transactionRes = prisma.$transaction(async(tx)=>{
       

        const [totalPosts,totalPublicPost,totalDraftPost,totalArchivedPost,
            totalComments,totalApprovedComments,totalRejectComments,totalPostView
        ] = await Promise.all(
            [
                await tx.post.count(),
                await tx.post.count({where:{status:postStatus.PUBLISHED}}),
                await tx.post.count({where:{status:postStatus.DRAFT}}),
                await tx.post.count({where:{status:postStatus.ARCHIVED}}),
                await tx.comment.count(),
                await tx.comment.count({where:{status:commentStatus.APPROVED}}),
                await tx.comment.count({where:{status:commentStatus.REJECT}}),
                await tx.post.aggregate({_sum : {views:true}})
            ]
        )

        return {totalPosts,totalPublicPost,totalDraftPost,totalArchivedPost,
            totalComments,totalApprovedComments,totalRejectComments,totalPostView:totalPostView._sum.views};


    })
    return transactionRes;
} 

export const postService = {
    getAllPostsFromDb,
    createPostIntoDb,
    getMypostFromDb,
    getPostByid,
    updatePost,
    deletePost,
    getPostStats


}