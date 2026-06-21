import cookieParser from "cookie-parser";
import express,{ Application } from "express";
import cors from 'cors';
import config from "./config/config";

const app:Application = express();
app.use(cors({
    origin:config.app_url,
    credentials:true
}))

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended:true }))

app.get('/', (req, res) => {
  res.send('Hello World!');
});
export default app; 