import { Request, Response } from "express";
import { cartServices } from "./cart.services";


const addToCart = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id; // from auth middleware

    const item = await cartServices.addToCart(userId as string, req.body);

    res.status(200).json({
      success: true,
      message: "Product added to cart",
      data: item,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const removeFromCart = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const { productId } = req.params;

    await cartServices.removeFromCart(userId as string, productId as string);

    res.status(200).json({
      success: true,
      message: "Product removed from cart",
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const getCart = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    const cart = await cartServices.getCart(userId as string);

    res.status(200).json({
      success: true,
      data: cart,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const cartController = {
  addToCart,
  removeFromCart,
  getCart,
};
