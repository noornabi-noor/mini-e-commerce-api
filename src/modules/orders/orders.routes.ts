import { Router } from "express";
import { auth, userRoles } from "../../middleware/auth";
import { orderController } from "./orders.controller";

const router = Router();

router.post("/", auth(userRoles.CUSTOMER), orderController.createOrder); 
router.post("/pay/:orderId", auth(userRoles.CUSTOMER), orderController.payOrder); 
router.post("/cancel/:orderId", auth(userRoles.CUSTOMER), orderController.cancelOrder); 
router.patch("/status/:orderId", auth(userRoles.ADMIN), orderController.updateOrderStatus); 

export const orderRoutes = router;