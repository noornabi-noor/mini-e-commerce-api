import { prisma } from "../../lib/prisma";

type createProductInput = {
  name: string;
  description?: string;
  price: number;
  stock: number;
};

type UpdateProductInput = {
  name?: string;
  description?: string;
  price?: number;
  stock?: number;
};

const createProduct = async (data: createProductInput) => {
  return await prisma.product.create({
    data,
  });
};

const getAllProducts = async () => {
  return await prisma.product.findMany({
    select: {
      id: true,
      name: true,
      price: true,
      stock: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

const getSingleProduct = async (productId: string) => {
  return await prisma.product.findUniqueOrThrow({
    where: {
      id: productId,
    },
    select: {
      name: true,
      description: true,
      price: true,
      stock: true,
    },
  });
};

const getProductWithDetails = async (productId: string) => {
  return await prisma.product.findUniqueOrThrow({
    where: { id: productId },
    include: {
      orderItems: {
        select: {
          id: true,
          quantity: true,
          price: true,
          order: {
            select: { id: true, userId: true, status: true },
          },
        },
      },
      cartItems: {
        select: {
          id: true,
          quantity: true,
          cart: {
            select: { id: true, userId: true },
          },
        },
      },
    },
  });
};

const updatedProduct = async (productId: string, data: UpdateProductInput) => {
  return await prisma.product.update({
    where: { id: productId },
    data,
  });
};

const deleteProduct = async (productId: string) => {
  return await prisma.product.delete({
    where: {
      id: productId,
    },
  });
};

export const productServices = {
  getAllProducts,
  createProduct,
  updatedProduct,
  deleteProduct,
  getSingleProduct,
  getProductWithDetails,
};
