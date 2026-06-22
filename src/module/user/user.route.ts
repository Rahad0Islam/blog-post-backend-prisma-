import { Request, Response, Router } from "express";
import { userController } from "./user.controller";


const router = Router();

router.post("/register",userController.userCreate );


export const userRoutes = router;