import { postStatus } from "../../../generated/prisma/enums"
import { PostWhereInput } from "../../../generated/prisma/models"

export interface createPostPayload  {
    title :string
    content: string
    thumbnail?: string
    isFeatured?:Boolean
    status?:postStatus
    tags:string[]
    
}

export interface IupdatedPost{
    title? :string
    content?: string
    thumbnail?: string
    isFeatured?:boolean
    status?:postStatus
    tags?:string[]
}


export interface IpostSearchQuery extends PostWhereInput {
    page?: string;
    limit?: string;
    sortBy?: string;
    searchTerm?: string;
    sortOrder?: 'asc' | 'desc';
}