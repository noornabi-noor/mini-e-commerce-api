import express, { Request, Response } from "express"
import cors from "cors"
import { auth } from "./lib/auth";
import { toNodeHandler } from "better-auth/node";
import { orderRoutes } from "./modules/orders/orders.routes";
import { cartRoutes } from "./modules/cart/cart.routes";
import { productRoutes } from "./modules/products/products.routes";

const app = express()
const port = process.env.PORT;

app.use(express.json());

app.use(cors());

// better auth 
app.all("/api/auth/*splat", toNodeHandler(auth));

app.use("/api/orders", orderRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/products", productRoutes);

app.get("", (req : Request, res: Response)=>{
    res.send("Hello world!");
});

export default app;