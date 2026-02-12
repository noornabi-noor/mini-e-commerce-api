import { Router } from "express";
import { cartController } from "./cart.controller";
import { auth, userRoles } from "../../middleware/auth";


const router = Router();

router.get("/", auth(), cartController.getCart);
router.post("/", auth(), cartController.addToCart);
router.delete("/:productId", auth(), cartController.removeFromCart);

export const cartRoutes = router;
