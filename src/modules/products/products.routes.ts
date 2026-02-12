import { Router } from "express";
import { productController } from "./products.controller";

const router = Router();

router.get("/", productController.getAllProducts);
router.get("productId", productController.getSingleProduct);
router.post("/", productController.createProduct);
router.patch("/:productId", productController.updateProduct);
router.delete("/:productId", productController.deleteProduct);
router.get("/:productId/admin", productController.getProductWithDetails);

export const productRoutes = router;
