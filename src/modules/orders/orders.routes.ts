import { Router } from "express";
import { auth, userRoles } from "../../middleware/auth";
import { orderController } from "./orders.controller";

const router = Router();

router.post("/", auth(userRoles.CUSTOMER), orderController.createOrder);

export const orderRoutes = router;
