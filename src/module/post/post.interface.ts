import { postStatus } from "../../../generated/prisma/enums"

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