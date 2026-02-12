import { OrderStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";

type PlaceOrderInput = {
  productIds?: string[]
};

const placeOrder = async (userId: string, data: PlaceOrderInput) => {
  const { productIds = [] } = data;

  // get the user cart with items and product details
  const cart = await prisma.cart.findUnique({
    where: { userId },
    include: {
      items: {
        include: { product: true },
      },
    },
  });

  if (!cart || cart.items.length === 0) {
    throw new Error("Cart is empty");
  }

  // filter items if productIds provided
  const itemsToOrder =
    productIds.length > 0
      ? cart.items.filter((item) => productIds.includes(item.productId))
      : cart.items; 

  if (itemsToOrder.length === 0) {
    throw new Error("No selected products found in cart");
  }

  // check stock and calculate total price
  let total = 0;
  for (const item of itemsToOrder) {
    if (item.quantity > item.product.stock) {
      throw new Error(`Product "${item.product.name}" is out of stock`);
    }
    total += item.quantity * item.product.price;
  }

  // Perform all operations in a transaction
  const order = await prisma.$transaction(async (tx) => {
    // create order
    const newOrder = await tx.order.create({
      data: {
        userId,
        total,
        status: "PENDING",
      },
    });

    // create order items
    const orderItemsData = itemsToOrder.map((item) => ({
      orderId: newOrder.id,
      productId: item.productId,
      quantity: item.quantity,
      price: item.product.price,
    }));

    await tx.orderItem.createMany({
      data: orderItemsData,
    });

    // deduct stock for each product
    for (const item of itemsToOrder) {
      await tx.product.update({
        where: { id: item.productId },
        data: { stock: item.product.stock - item.quantity },
      });
    }

    // remove only ordered items from cart
    const orderedProductIds = itemsToOrder.map((item) => item.productId);
    await tx.cartItem.deleteMany({
      where: {
        cartId: cart.id,
        productId: { in: orderedProductIds },
      },
    });

    return newOrder;
  });

  return order;
};

const payOrder = async (orderId: string, userId: string) => {
  const order = await prisma.order.findUniqueOrThrow({
    where: { id: orderId },
  });

  if (order.userId !== userId) throw new Error("Not allowed to pay for this order");

  if (order.paymentStatus === "PAID") throw new Error("Order already paid");

  // payment success
  return await prisma.order.update({
    where: { id: orderId },
    data: { paymentStatus: "PAID" },
  });
};

const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
  if (!["SHIPPED", "DELIVERED", "CANCELLED"].includes(status)) {
    throw new Error("Invalid status");
  }

  return await prisma.order.update({
    where: { id: orderId },
    data: { status },
  });
};

const cancelOrder = async (orderId: string, userId: string) => {
  const order = await prisma.order.findUniqueOrThrow({ where: { id: orderId } });

  if (order.userId !== userId) throw new Error("Cannot cancel another user's order");
  if (order.status !== "PENDING") throw new Error("Only pending orders can be cancelled");

  if (order.cancellationCount >= 3) {
    throw new Error("Order cancellation limit reached");
  }

  // increment cancellation count
  await prisma.order.update({
    where: { id: orderId },
    data: { status: "CANCELLED", cancellationCount: order.cancellationCount + 1 },
  });

  // restore stock of products
  const items = await prisma.orderItem.findMany({ where: { orderId } });
  for (const item of items) {
    await prisma.product.update({
      where: { id: item.productId },
      data: { stock: { increment: item.quantity } },
    });
  }

  return { message: "Order cancelled" };
};


export const ordersServices = {
  placeOrder,
  payOrder,
  updateOrderStatus,
  cancelOrder
};