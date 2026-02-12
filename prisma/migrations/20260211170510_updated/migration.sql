/*
  Warnings:

  - Added the required column `updatedAt` to the `cart` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `products` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "cart" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "products" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
