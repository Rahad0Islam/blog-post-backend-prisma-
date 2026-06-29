import { Router } from "express";
import { commentController } from "./comment.controller";
import { auth } from "../../middleware/auth";
import { Role } from "../../../generated/prisma/client";

const router = Router();


router.get("/author/:authorId",commentController.getCommentsByAuthor);
router.get("/:commentId",commentController.getCommentById);
router.get("/post/:postId",commentController.getCommentBypostId);
router.post("/",auth(Role.USER,Role.ADMIN),commentController.createComment);
router.patch("/:commentId",auth(Role.USER,Role.ADMIN),commentController.updateComment);
router.delete("/:commentId",auth(Role.USER,Role.ADMIN),commentController.deleteComment);
router.patch("/:commentId/moderate",auth(Role.ADMIN),commentController.commentmoderate);

export const commentRouter = router