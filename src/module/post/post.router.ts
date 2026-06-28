import { Router } from "express";
import { postController } from "./post.controller";
import { auth } from "../../middleware/auth";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

router.get('/',postController.getAllPosts);
router.get('/stats',auth(Role.ADMIN,Role.USER),postController.statistics)
router.get('/my-posts', auth(Role.ADMIN,Role.USER),postController.getMypost)
router.get('/:postId',postController.getPostById)
router.post('/',auth(Role.ADMIN,Role.USER),postController.createPost);
router.patch('/:postId',auth(Role.ADMIN,Role.USER),postController.updatedPost);
 router.delete('/:postId',auth(Role.ADMIN,Role.USER),postController.deletePost);

export const postRoute = router;