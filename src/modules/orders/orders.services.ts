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

export const ordersServices = {
  placeOrder,
};