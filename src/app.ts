import express, { Request, Response } from "express"
import cors from "cors"

const app = express()
const port = process.env.PORT;

app.use(express.json());

app.use(cors());

app.get("", (req : Request, res: Response)=>{
    res.send("Hello world!");
});


export default app;