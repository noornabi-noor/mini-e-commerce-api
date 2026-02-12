import { prisma } from "../../lib/prisma";

const placeOrder = async (userId: string) => {
  // get the user's cart with items and product details
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

  // check stock and calculate total price
  let total = 0;
  for (const item of cart.items) {
    if (item.quantity > item.product.stock) {
      throw new Error(`Product ${item.product.name} is out of stock`);
    }
    total += item.quantity * item.product.price;
  }

  // perform everything within transaction
  const order = await prisma.$transaction(async (tx) => {
    // create the order
    const newOrder = await tx.order.create({
      data: {
        userId,
        total,
        status: "PENDING",
      },
    });

    // create order items
    const orderItemsData = cart.items.map((item) => ({
      orderId: newOrder.id,
      productId: item.productId,
      quantity: item.quantity,
      price: item.product.price,
    }));

    await tx.orderItem.createMany({
      data: orderItemsData,
    });

    // deduct stock for each product
    for (const item of cart.items) {
      await tx.product.update({
        where: { id: item.productId },
        data: { stock: item.product.stock - item.quantity },
      });
    }

    // clear cart items
    await tx.cartItem.deleteMany({
      where: { cartId: cart.id },
    });

    return newOrder;
  });

  return order;
};

export const ordersServices = {
    placeOrder
}