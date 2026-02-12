import { Request, Response } from "express";
import { productServices } from "./products.services";

// CREATE PRODUCT (ADMIN)
const createProduct = async (req: Request, res: Response) => {
  try {
    const product = await productServices.createProduct(req.body);

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || "Failed to create product",
    });
  }
};

// GET ALL PRODUCTS (PUBLIC)
const getAllProducts = async (_req: Request, res: Response) => {
  try {
    const products = await productServices.getAllProducts();

    res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch products",
    });
  }
};

// GET SINGLE PRODUCT (PUBLIC)
const getSingleProduct = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;

    const product = await productServices.getSingleProduct(productId as string);

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error: any) {
    res.status(404).json({
      success: false,
      message: error.message || "Product not found",
    });
  }
};

// GET PRODUCT WITH DETAILS (ADMIN)
const getProductWithDetails = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;

    const product = await productServices.getProductWithDetails(productId as string);

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error: any) {
    res.status(404).json({
      success: false,
      message: error.message || "Product not found",
    });
  }
};

// UPDATE PRODUCT (ADMIN)
const updateProduct = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;

    const updated = await productServices.updatedProduct(productId as string, req.body);

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: updated,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || "Failed to update product",
    });
  }
};

// DELETE PRODUCT (ADMIN)
const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;

    await productServices.deleteProduct(productId as string);

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || "Failed to delete product",
    });
  }
};

export const productController = {
  createProduct,
  getAllProducts,
  getSingleProduct,
  getProductWithDetails,
  updateProduct,
  deleteProduct,
};
