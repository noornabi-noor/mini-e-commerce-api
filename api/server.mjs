// src/app.ts
import express from "express";
import cors from "cors";

// src/lib/auth.ts
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";

// src/lib/prisma.ts
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";

// generated/prisma/client.ts
import * as path from "path";
import { fileURLToPath } from "url";

// generated/prisma/internal/class.ts
import * as runtime from "@prisma/client/runtime/client";
var config = {
  "previewFeatures": [],
  "clientVersion": "7.3.0",
  "engineVersion": "9d6ad21cbbceab97458517b147a6a09ff43aa735",
  "activeProvider": "postgresql",
  "inlineSchema": '// This is your Prisma schema file,\n// learn more about it in the docs: https://pris.ly/d/prisma-schema\n\n// Looking for ways to speed up your queries, or scale easily with your serverless or edge functions?\n// Try Prisma Accelerate: https://pris.ly/cli/accelerate-init\n\ngenerator client {\n  provider = "prisma-client"\n  output   = "../generated/prisma"\n}\n\ndatasource db {\n  provider = "postgresql"\n}\n\nenum Role {\n  ADMIN\n  CUSTOMER\n}\n\nenum OrderStatus {\n  PENDING\n  SHIPPED\n  DELIVERED\n  CANCELLED\n}\n\nenum PaymentStatus {\n  PENDING\n  PAID\n  FAILED\n}\n\nmodel Product {\n  id          String   @id @default(uuid())\n  name        String\n  description String?\n  price       Float\n  stock       Int\n  createdAt   DateTime @default(now())\n  updatedAt   DateTime @updatedAt\n\n  orderItems OrderItem[]\n  cartItems  CartItem[]\n\n  @@map("products")\n}\n\nmodel Cart {\n  id        String     @id @default(uuid())\n  userId    String     @unique\n  user      User       @relation(fields: [userId], references: [id], onDelete: Cascade)\n  items     CartItem[]\n  createdAt DateTime   @default(now())\n  updatedAt DateTime   @updatedAt\n\n  @@map("cart")\n}\n\nmodel CartItem {\n  id        String @id @default(uuid())\n  cartId    String\n  productId String\n  quantity  Int\n\n  cart    Cart    @relation(fields: [cartId], references: [id], onDelete: Cascade)\n  product Product @relation(fields: [productId], references: [id], onDelete: Cascade)\n\n  @@unique([cartId, productId])\n  @@map("cartItems")\n}\n\nmodel Order {\n  id                String        @id @default(uuid())\n  userId            String\n  total             Float\n  status            OrderStatus   @default(PENDING)\n  paymentStatus     PaymentStatus @default(PENDING)\n  cancellationCount Int           @default(0)\n  createdAt         DateTime      @default(now())\n  updatedAt         DateTime      @updatedAt\n\n  user  User        @relation(fields: [userId], references: [id], onDelete: Cascade)\n  items OrderItem[]\n\n  @@map("orders")\n}\n\nmodel OrderItem {\n  id        String @id @default(uuid())\n  orderId   String\n  productId String\n  price     Float\n  quantity  Int\n\n  order   Order   @relation(fields: [orderId], references: [id], onDelete: Cascade)\n  product Product @relation(fields: [productId], references: [id], onDelete: Cascade)\n\n  @@map("orderItems")\n}\n\nmodel User {\n  id            String    @id\n  name          String\n  email         String\n  emailVerified Boolean   @default(false)\n  image         String?\n  role          Role      @default(CUSTOMER)\n  createdAt     DateTime  @default(now())\n  updatedAt     DateTime  @updatedAt\n  sessions      Session[]\n  accounts      Account[]\n\n  carts  Cart[]\n  orders Order[]\n\n  @@unique([email])\n  @@map("user")\n}\n\nmodel Session {\n  id        String   @id\n  expiresAt DateTime\n  token     String\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n  ipAddress String?\n  userAgent String?\n  userId    String\n  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  @@unique([token])\n  @@index([userId])\n  @@map("session")\n}\n\nmodel Account {\n  id                    String    @id\n  accountId             String\n  providerId            String\n  userId                String\n  user                  User      @relation(fields: [userId], references: [id], onDelete: Cascade)\n  accessToken           String?\n  refreshToken          String?\n  idToken               String?\n  accessTokenExpiresAt  DateTime?\n  refreshTokenExpiresAt DateTime?\n  scope                 String?\n  password              String?\n  createdAt             DateTime  @default(now())\n  updatedAt             DateTime  @updatedAt\n\n  @@index([userId])\n  @@map("account")\n}\n\nmodel Verification {\n  id         String   @id\n  identifier String\n  value      String\n  expiresAt  DateTime\n  createdAt  DateTime @default(now())\n  updatedAt  DateTime @updatedAt\n\n  @@index([identifier])\n  @@map("verification")\n}\n',
  "runtimeDataModel": {
    "models": {},
    "enums": {},
    "types": {}
  }
};
config.runtimeDataModel = JSON.parse('{"models":{"Product":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"price","kind":"scalar","type":"Float"},{"name":"stock","kind":"scalar","type":"Int"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"orderItems","kind":"object","type":"OrderItem","relationName":"OrderItemToProduct"},{"name":"cartItems","kind":"object","type":"CartItem","relationName":"CartItemToProduct"}],"dbName":"products"},"Cart":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"CartToUser"},{"name":"items","kind":"object","type":"CartItem","relationName":"CartToCartItem"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"cart"},"CartItem":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"cartId","kind":"scalar","type":"String"},{"name":"productId","kind":"scalar","type":"String"},{"name":"quantity","kind":"scalar","type":"Int"},{"name":"cart","kind":"object","type":"Cart","relationName":"CartToCartItem"},{"name":"product","kind":"object","type":"Product","relationName":"CartItemToProduct"}],"dbName":"cartItems"},"Order":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"total","kind":"scalar","type":"Float"},{"name":"status","kind":"enum","type":"OrderStatus"},{"name":"paymentStatus","kind":"enum","type":"PaymentStatus"},{"name":"cancellationCount","kind":"scalar","type":"Int"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"user","kind":"object","type":"User","relationName":"OrderToUser"},{"name":"items","kind":"object","type":"OrderItem","relationName":"OrderToOrderItem"}],"dbName":"orders"},"OrderItem":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"orderId","kind":"scalar","type":"String"},{"name":"productId","kind":"scalar","type":"String"},{"name":"price","kind":"scalar","type":"Float"},{"name":"quantity","kind":"scalar","type":"Int"},{"name":"order","kind":"object","type":"Order","relationName":"OrderToOrderItem"},{"name":"product","kind":"object","type":"Product","relationName":"OrderItemToProduct"}],"dbName":"orderItems"},"User":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"emailVerified","kind":"scalar","type":"Boolean"},{"name":"image","kind":"scalar","type":"String"},{"name":"role","kind":"enum","type":"Role"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"sessions","kind":"object","type":"Session","relationName":"SessionToUser"},{"name":"accounts","kind":"object","type":"Account","relationName":"AccountToUser"},{"name":"carts","kind":"object","type":"Cart","relationName":"CartToUser"},{"name":"orders","kind":"object","type":"Order","relationName":"OrderToUser"}],"dbName":"user"},"Session":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"token","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"ipAddress","kind":"scalar","type":"String"},{"name":"userAgent","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"SessionToUser"}],"dbName":"session"},"Account":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"accountId","kind":"scalar","type":"String"},{"name":"providerId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"AccountToUser"},{"name":"accessToken","kind":"scalar","type":"String"},{"name":"refreshToken","kind":"scalar","type":"String"},{"name":"idToken","kind":"scalar","type":"String"},{"name":"accessTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"refreshTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"scope","kind":"scalar","type":"String"},{"name":"password","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"account"},"Verification":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"identifier","kind":"scalar","type":"String"},{"name":"value","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"verification"}},"enums":{},"types":{}}');
async function decodeBase64AsWasm(wasmBase64) {
  const { Buffer } = await import("buffer");
  const wasmArray = Buffer.from(wasmBase64, "base64");
  return new WebAssembly.Module(wasmArray);
}
config.compilerWasm = {
  getRuntime: async () => await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.mjs"),
  getQueryCompilerWasmModule: async () => {
    const { wasm } = await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.wasm-base64.mjs");
    return await decodeBase64AsWasm(wasm);
  },
  importName: "./query_compiler_fast_bg.js"
};
function getPrismaClientClass() {
  return runtime.getPrismaClient(config);
}

// generated/prisma/internal/prismaNamespace.ts
import * as runtime2 from "@prisma/client/runtime/client";
var getExtensionContext = runtime2.Extensions.getExtensionContext;
var NullTypes2 = {
  DbNull: runtime2.NullTypes.DbNull,
  JsonNull: runtime2.NullTypes.JsonNull,
  AnyNull: runtime2.NullTypes.AnyNull
};
var TransactionIsolationLevel = runtime2.makeStrictEnum({
  ReadUncommitted: "ReadUncommitted",
  ReadCommitted: "ReadCommitted",
  RepeatableRead: "RepeatableRead",
  Serializable: "Serializable"
});
var defineExtension = runtime2.Extensions.defineExtension;

// generated/prisma/client.ts
globalThis["__dirname"] = path.dirname(fileURLToPath(import.meta.url));
var PrismaClient = getPrismaClientClass();

// src/lib/prisma.ts
var connectionString = `${process.env.DATABASE_URL}`;
var adapter = new PrismaPg({ connectionString });
var prisma = new PrismaClient({ adapter });

// src/lib/auth.ts
var auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql"
  }),
  trustedOrigins: [process.env.APP_URL],
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    requireEmailVerification: true
  },
  redirectTo: process.env.APP_URL
});

// src/app.ts
import { toNodeHandler } from "better-auth/node";

// src/modules/orders/orders.routes.ts
import { Router } from "express";

// src/middleware/auth.ts
var auth2 = (...roles) => async (req, res, next) => {
  try {
    const session = await auth.api.getSession({
      headers: {
        cookie: req.headers.cookie || "",
        authorization: req.headers.authorization || ""
      }
    });
    if (!session) {
      return res.status(401).json({
        success: false,
        message: "You are not authorized!"
      });
    }
    if (!session.user.emailVerified) {
      return res.status(403).json({
        success: false,
        message: "Email verification required!"
      });
    }
    const dbUser = await prisma.user.findUnique({
      where: { id: session.user.id }
    });
    if (!dbUser) {
      return res.status(401).json({
        success: false,
        message: "User not found"
      });
    }
    req.user = {
      id: dbUser.id,
      email: dbUser.email,
      name: dbUser.name,
      role: dbUser.role,
      emailVerified: dbUser.emailVerified
    };
    if (roles.length > 0 && !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission!"
      });
    }
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error during authentication"
    });
  }
};

// src/modules/orders/orders.services.ts
var placeOrder = async (userId, data) => {
  const { productIds = [] } = data;
  const cart = await prisma.cart.findUnique({
    where: { userId },
    include: {
      items: {
        include: { product: true }
      }
    }
  });
  if (!cart || cart.items.length === 0) {
    throw new Error("Cart is empty");
  }
  const itemsToOrder = productIds.length > 0 ? cart.items.filter((item) => productIds.includes(item.productId)) : cart.items;
  if (itemsToOrder.length === 0) {
    throw new Error("No selected products found in cart");
  }
  let total = 0;
  for (const item of itemsToOrder) {
    if (item.quantity > item.product.stock) {
      throw new Error(`Product "${item.product.name}" is out of stock`);
    }
    total += item.quantity * item.product.price;
  }
  const order = await prisma.$transaction(async (tx) => {
    const newOrder = await tx.order.create({
      data: {
        userId,
        total,
        status: "PENDING"
      }
    });
    const orderItemsData = itemsToOrder.map((item) => ({
      orderId: newOrder.id,
      productId: item.productId,
      quantity: item.quantity,
      price: item.product.price
    }));
    await tx.orderItem.createMany({
      data: orderItemsData
    });
    for (const item of itemsToOrder) {
      await tx.product.update({
        where: { id: item.productId },
        data: { stock: item.product.stock - item.quantity }
      });
    }
    const orderedProductIds = itemsToOrder.map((item) => item.productId);
    await tx.cartItem.deleteMany({
      where: {
        cartId: cart.id,
        productId: { in: orderedProductIds }
      }
    });
    return newOrder;
  });
  return order;
};
var payOrder = async (orderId, userId) => {
  const order = await prisma.order.findUniqueOrThrow({
    where: { id: orderId }
  });
  if (order.userId !== userId) throw new Error("Not allowed to pay for this order");
  if (order.paymentStatus === "PAID") throw new Error("Order already paid");
  return await prisma.order.update({
    where: { id: orderId },
    data: { paymentStatus: "PAID" }
  });
};
var updateOrderStatus = async (orderId, status) => {
  if (!["SHIPPED", "DELIVERED", "CANCELLED"].includes(status)) {
    throw new Error("Invalid status");
  }
  return await prisma.order.update({
    where: { id: orderId },
    data: { status }
  });
};
var cancelOrder = async (orderId, userId) => {
  const order = await prisma.order.findUniqueOrThrow({ where: { id: orderId } });
  if (order.userId !== userId) throw new Error("Cannot cancel another user's order");
  if (order.status !== "PENDING") throw new Error("Only pending orders can be cancelled");
  if (order.cancellationCount >= 3) {
    throw new Error("Order cancellation limit reached");
  }
  await prisma.order.update({
    where: { id: orderId },
    data: { status: "CANCELLED", cancellationCount: order.cancellationCount + 1 }
  });
  const items = await prisma.orderItem.findMany({ where: { orderId } });
  for (const item of items) {
    await prisma.product.update({
      where: { id: item.productId },
      data: { stock: { increment: item.quantity } }
    });
  }
  return { message: "Order cancelled" };
};
var ordersServices = {
  placeOrder,
  payOrder,
  updateOrderStatus,
  cancelOrder
};

// src/modules/orders/orders.controller.ts
var createOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const productIds = req.body.productIds || [];
    const order = await ordersServices.placeOrder(userId, { productIds });
    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      data: order
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};
var payOrder2 = async (req, res) => {
  try {
    const userId = req.user.id;
    const { orderId } = req.params;
    const order = await ordersServices.payOrder(orderId, userId);
    res.status(200).json({ success: true, message: "Payment successful", data: order });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
var updateOrderStatus2 = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const order = await ordersServices.updateOrderStatus(orderId, status);
    res.status(200).json({ success: true, message: "Order status updated", data: order });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
var cancelOrder2 = async (req, res) => {
  try {
    const userId = req.user.id;
    const { orderId } = req.params;
    const result = await ordersServices.cancelOrder(orderId, userId);
    res.status(200).json({ success: true, message: result.message });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
var orderController = {
  createOrder,
  payOrder: payOrder2,
  updateOrderStatus: updateOrderStatus2,
  cancelOrder: cancelOrder2
};

// src/modules/orders/orders.routes.ts
var router = Router();
router.post("/", auth2("CUSTOMER" /* CUSTOMER */), orderController.createOrder);
router.post("/pay/:orderId", auth2("CUSTOMER" /* CUSTOMER */), orderController.payOrder);
router.post("/cancel/:orderId", auth2("CUSTOMER" /* CUSTOMER */), orderController.cancelOrder);
router.patch("/status/:orderId", auth2("ADMIN" /* ADMIN */), orderController.updateOrderStatus);
var orderRoutes = router;

// src/modules/cart/cart.routes.ts
import { Router as Router2 } from "express";

// src/modules/cart/cart.services.ts
var getOrCreateCart = async (userId) => {
  let cart = await prisma.cart.findUnique({
    where: { userId }
  });
  if (!cart) {
    cart = await prisma.cart.create({
      data: { userId }
    });
  }
  return cart;
};
var addToCart = async (userId, data) => {
  const { productId, quantity } = data;
  if (quantity <= 0) {
    throw new Error("Quantity must be greater than 0");
  }
  const product = await prisma.product.findUniqueOrThrow({
    where: { id: productId }
  });
  if (product.stock < quantity) {
    throw new Error("Not enough stock available");
  }
  const cart = await getOrCreateCart(userId);
  const existingItem = await prisma.cartItem.findUnique({
    where: {
      cartId_productId: {
        cartId: cart.id,
        productId
      }
    }
  });
  if (existingItem) {
    const newQuantity = existingItem.quantity + quantity;
    if (newQuantity > product.stock) {
      throw new Error("Exceeds available stock");
    }
    return await prisma.cartItem.update({
      where: { id: existingItem.id },
      data: { quantity: newQuantity }
    });
  }
  return await prisma.cartItem.create({
    data: {
      cartId: cart.id,
      productId,
      quantity
    }
  });
};
var removeFromCart = async (userId, productId) => {
  const cart = await prisma.cart.findUnique({
    where: { userId }
  });
  if (!cart) {
    throw new Error("Cart not found for user");
  }
  const cartItem = await prisma.cartItem.findUnique({
    where: { cartId_productId: { cartId: cart.id, productId } }
  });
  if (!cartItem) {
    throw new Error("Product not found in cart");
  }
  return await prisma.cartItem.delete({
    where: { id: cartItem.id }
  });
};
var getCart = async (userId) => {
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
              stock: true
            }
          }
        }
      }
    }
  });
};
var cartServices = {
  addToCart,
  removeFromCart,
  getCart
};

// src/modules/cart/cart.controller.ts
var addToCart2 = async (req, res) => {
  try {
    const userId = req.user.id;
    const item = await cartServices.addToCart(userId, req.body);
    res.status(200).json({
      success: true,
      message: "Product added to cart",
      data: item
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};
var removeFromCart2 = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;
    await cartServices.removeFromCart(userId, productId);
    res.status(200).json({
      success: true,
      message: "Product removed from cart"
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};
var getCart2 = async (req, res) => {
  try {
    const userId = req.user.id;
    const cart = await cartServices.getCart(userId);
    res.status(200).json({
      success: true,
      data: cart
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
var cartController = {
  addToCart: addToCart2,
  removeFromCart: removeFromCart2,
  getCart: getCart2
};

// src/modules/cart/cart.routes.ts
var router2 = Router2();
router2.get("/", auth2("CUSTOMER" /* CUSTOMER */), cartController.getCart);
router2.post("/", auth2("CUSTOMER" /* CUSTOMER */), cartController.addToCart);
router2.delete("/:productId", auth2("CUSTOMER" /* CUSTOMER */), cartController.removeFromCart);
var cartRoutes = router2;

// src/modules/products/products.routes.ts
import { Router as Router3 } from "express";

// src/modules/products/products.services.ts
var createProduct = async (data) => {
  return await prisma.product.create({
    data
  });
};
var getAllProducts = async () => {
  return await prisma.product.findMany({
    select: {
      id: true,
      name: true,
      price: true,
      stock: true
    },
    orderBy: {
      createdAt: "desc"
    }
  });
};
var getSingleProduct = async (productId) => {
  return await prisma.product.findUniqueOrThrow({
    where: {
      id: productId
    },
    select: {
      name: true,
      description: true,
      price: true,
      stock: true
    }
  });
};
var getProductWithDetails = async (productId) => {
  return await prisma.product.findUniqueOrThrow({
    where: { id: productId },
    include: {
      orderItems: {
        select: {
          id: true,
          quantity: true,
          price: true,
          order: {
            select: { id: true, userId: true, status: true }
          }
        }
      },
      cartItems: {
        select: {
          id: true,
          quantity: true,
          cart: {
            select: { id: true, userId: true }
          }
        }
      }
    }
  });
};
var updatedProduct = async (productId, data) => {
  return await prisma.product.update({
    where: { id: productId },
    data
  });
};
var deleteProduct = async (productId) => {
  return await prisma.product.delete({
    where: {
      id: productId
    }
  });
};
var productServices = {
  getAllProducts,
  createProduct,
  updatedProduct,
  deleteProduct,
  getSingleProduct,
  getProductWithDetails
};

// src/modules/products/products.controller.ts
var createProduct2 = async (req, res) => {
  try {
    const product = await productServices.createProduct(req.body);
    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || "Failed to create product"
    });
  }
};
var getAllProducts2 = async (_req, res) => {
  try {
    const products = await productServices.getAllProducts();
    res.status(200).json({
      success: true,
      data: products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch products"
    });
  }
};
var getSingleProduct2 = async (req, res) => {
  try {
    const { productId } = req.params;
    const product = await productServices.getSingleProduct(productId);
    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message || "Product not found"
    });
  }
};
var getProductWithDetails2 = async (req, res) => {
  try {
    const { productId } = req.params;
    const product = await productServices.getProductWithDetails(productId);
    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message || "Product not found"
    });
  }
};
var updateProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const updated = await productServices.updatedProduct(productId, req.body);
    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: updated
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || "Failed to update product"
    });
  }
};
var deleteProduct2 = async (req, res) => {
  try {
    const { productId } = req.params;
    await productServices.deleteProduct(productId);
    res.status(200).json({
      success: true,
      message: "Product deleted successfully"
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || "Failed to delete product"
    });
  }
};
var productController = {
  createProduct: createProduct2,
  getAllProducts: getAllProducts2,
  getSingleProduct: getSingleProduct2,
  getProductWithDetails: getProductWithDetails2,
  updateProduct,
  deleteProduct: deleteProduct2
};

// src/modules/products/products.routes.ts
var router3 = Router3();
router3.get("/", productController.getAllProducts);
router3.get("/:productId", productController.getSingleProduct);
router3.post("/", auth2("ADMIN" /* ADMIN */), productController.createProduct);
router3.patch("/:productId", auth2("ADMIN" /* ADMIN */), productController.updateProduct);
router3.delete("/:productId", auth2("ADMIN" /* ADMIN */), productController.deleteProduct);
router3.get("/:productId/admin", auth2("ADMIN" /* ADMIN */), productController.getProductWithDetails);
var productRoutes = router3;

// src/app.ts
var app = express();
var port = process.env.PORT;
app.use(express.json());
app.use(cors());
app.all("/api/auth/*splat", toNodeHandler(auth));
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.get("", (req, res) => {
  res.send("Hello world!");
});
var app_default = app;

// src/server.ts
var port2 = process.env.PORT || 5e3;
async function main() {
  try {
    console.log("Connected to the database successfully!");
    app_default.listen(port2, () => {
      console.log(`Server is running on http://localhost:${port2}`);
    });
  } catch (error) {
    console.error("An error occured", error);
    process.exit(1);
  }
}
main();
