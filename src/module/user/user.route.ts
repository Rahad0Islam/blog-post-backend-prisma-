import { Request, Response, Router } from "express";
import { userController } from "./user.controller";
import { auth } from "../../middleware/auth";
import { Role } from "../../../generated/prisma/enums";


const router = Router();

router.post("/register",userController.userCreate );
router.get("/me",auth(Role.ADMIN,Role.USER,Role.AUTHOR)  ,userController.getMyProfile );



export const userRoutes = router;