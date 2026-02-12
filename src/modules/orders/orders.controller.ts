import { Request, Response } from "express";
import { ordersServices } from "./orders.services";

const createOrder = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id; // from auth middleware

    const order = await ordersServices.placeOrder(userId);

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      data: order,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const orderController = {
  createOrder,
};
