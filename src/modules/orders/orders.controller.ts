import { Request, Response } from "express";
import { ordersServices } from "./orders.services";

const createOrder = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id; // from auth middleware
    const productIds: string[] = req.body.productIds || []; 

    const order = await ordersServices.placeOrder(userId, { productIds });

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

const payOrder = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const { orderId } = req.params;

    const order = await ordersServices.payOrder(orderId as string, userId);

    res.status(200).json({ success: true, message: "Payment successful", data: order });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const order = await ordersServices.updateOrderStatus(orderId as string, status);

    res.status(200).json({ success: true, message: "Order status updated", data: order });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const cancelOrder = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const { orderId } = req.params;

    const result = await ordersServices.cancelOrder(orderId as string, userId);

    res.status(200).json({ success: true, message: result.message });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};


export const orderController = {
  createOrder,
  payOrder,
  updateOrderStatus,
  cancelOrder,
};
