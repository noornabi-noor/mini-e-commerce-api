import { NextFunction, Request, Response } from "express";
import { auth as betterAuth } from "../lib/auth";
import { prisma } from "../lib/prisma";

export enum userRoles {
  CUSTOMER = "CUSTOMER",
  ADMIN = "ADMIN",
}

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        name: string;
        role: userRoles;
        emailVerified: boolean;
      };
    }
  }
}

export const auth =
  (...roles: userRoles[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const session = await betterAuth.api.getSession({
        headers: {
          cookie: req.headers.cookie || "",
          authorization: req.headers.authorization || "",
        },
      });

      // No session
      if (!session) {
        return res.status(401).json({
          success: false,
          message: "You are not authorized!",
        });
      }

      // Email not verified
      if (!session.user.emailVerified) {
        return res.status(403).json({
          success: false,
          message: "Email verification required!",
        });
      }

      // Find user in DB
      const dbUser = await prisma.user.findUnique({
        where: { id: session.user.id },
      });

      if (!dbUser) {
        return res.status(401).json({
          success: false,
          message: "User not found",
        });
      }

      // Attach user to request
      req.user = {
        id: dbUser.id,
        email: dbUser.email,
        name: dbUser.name,
        role: dbUser.role as userRoles,
        emailVerified: dbUser.emailVerified,
      };

      // Role check (if roles passed)
      if (roles.length > 0 && !roles.includes(req.user.role)) {
        return res.status(403).json({
          success: false,
          message: "You do not have permission!",
        });
      }

      next();
    } catch (error) {
      console.error("Auth middleware error:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error during authentication",
      });
    }
  };
