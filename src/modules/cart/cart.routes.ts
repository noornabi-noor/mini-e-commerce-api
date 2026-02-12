import { Router } from "express";
import { cartController } from "./cart.controller";
import { auth, userRoles } from "../../middleware/auth";


const router = Router();

router.get("/", auth(userRoles.CUSTOMER), cartController.getCart);
router.post("/", auth(userRoles.CUSTOMER), cartController.addToCart);
router.delete("/:productId", auth(userRoles.CUSTOMER), cartController.removeFromCart);

export const cartRoutes = router;