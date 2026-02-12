import { Router } from "express";
import { productController } from "./products.controller";
import { auth, userRoles } from "../../middleware/auth";

const router = Router();

router.get("/", productController.getAllProducts);
router.get("/:productId", productController.getSingleProduct);
router.post("/", auth(userRoles.ADMIN), productController.createProduct);
router.patch("/:productId", auth(userRoles.ADMIN), productController.updateProduct);
router.delete("/:productId", auth(userRoles.ADMIN), productController.deleteProduct);
router.get("/:productId/admin", auth(userRoles.ADMIN), productController.getProductWithDetails);

export const productRoutes = router;
