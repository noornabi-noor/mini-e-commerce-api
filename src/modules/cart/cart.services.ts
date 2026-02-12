import { prisma } from "../../lib/prisma";

type AddToCartInput = {
  productId: string;
  quantity: number;
};

// it is function to check cart exist or not
const getOrCreateCart = async (userId: string) => {
  let cart = await prisma.cart.findUnique({
    where: { userId },
  });

  if (!cart) {
    cart = await prisma.cart.create({
      data: { userId },
    });
  }

  return cart;
};

const addToCart = async (userId: string, data: AddToCartInput) => {
  const { productId, quantity } = data;

  // check quantity
  if (quantity <= 0) {
    throw new Error("Quantity must be greater than 0");
  }

  const product = await prisma.product.findUniqueOrThrow({
    where: { id: productId },
  });

  // stock check
  if (product.stock < quantity) {
    throw new Error("Not enough stock available");
  }

  const cart = await getOrCreateCart(userId);

  // check item exist or not
  const existingItem = await prisma.cartItem.findUnique({
    where: {
      cartId_productId: {
        cartId: cart.id,
        productId,
      },
    },
  });

  // if exist
  if (existingItem) {
    const newQuantity = existingItem.quantity + quantity; // if exist quantity increases

    // but not exit the stock
    if (newQuantity > product.stock) {
      throw new Error("Exceeds available stock");
    }

    // if product already exist then increases quantity of the cart
    return await prisma.cartItem.update({
      where: { id: existingItem.id },
      data: { quantity: newQuantity },
    });
  }

  // if not exist then create new cart item
  return await prisma.cartItem.create({
    data: {
      cartId: cart.id,
      productId,
      quantity,
    },
  });
};

const removeFromCart = async (userId: string, productId: string) => {
  // get user's cart
  const cart = await prisma.cart.findUnique({
    where: { userId },
  });

  if (!cart) {
    throw new Error("Cart not found for user");
  }

  // xheck if item exists
  const cartItem = await prisma.cartItem.findUnique({
    where: { cartId_productId: { cartId: cart.id, productId } },
  });

  if (!cartItem) {
    throw new Error("Product not found in cart");
  }

  // delete from cart
  return await prisma.cartItem.delete({
    where: { id: cartItem.id }, 
  });
};


// get own cart item
const getCart = async (userId: string) => {
  return await prisma.cart.findUnique({
    where: { userId },
    include: {
      items: {
        include: {
          product: {
            select: {
              id: true,
              name: true,
              price: true,
              stock: true,
            },
          },
        },
      },
    },
  });
};

export const cartServices = {
  addToCart,
  removeFromCart,
  getCart,
};
