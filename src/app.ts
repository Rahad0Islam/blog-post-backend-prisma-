import cookieParser from "cookie-parser";
import express, { Application, NextFunction, Request, Response} from "express";
import cors from "cors";
import config from "./config/config";
import { prisma } from "./lib/prisma";
import { userRoutes } from "./module/user/user.route";
import { authRouter } from "./module/auth/auth.route";
import { postRoute } from "./module/post/post.router";
import { commentRouter } from "./module/comment/comment.router";
import { notFoundMiddleware } from "./middleware/notfound";
import httpstatus from "http-status";
import { globalerrorhandler } from "./middleware/globalErorHandler";

const app: Application = express();
app.use(
  cors({
    origin: config.app_url,
    credentials: true,
  }),
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", async (req, res) => {
  const user = await prisma.user.findMany();
  console.log(user);
  res.send("Hello World!");
});

app.use("/api/users",userRoutes);
app.use('/api/auth',authRouter);
app.use('/api/posts',postRoute);
app.use('/api/comments',commentRouter)
app.use(notFoundMiddleware);

app.use(globalerrorhandler);

export default app;
