import { prisma } from "../lib/prisma";
import { userRoles } from "../middleware/auth";

async function seedAdmin() {
  try {
    const adminData = {
      name: process.env.ADMIN_NAME as string,
      email: process.env.ADMIN_EMAIL as string,
      password: process.env.ADMIN_PASSWORD as string,
    };

    const existingUser = await prisma.user.findUnique({
      where: { email: adminData.email },
    });

    if (existingUser) {
      console.log("Admin already exists!");
      return;
    }

    // Sign up via auth API
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    // Only add Origin if APP_URL is defined
    if (process.env.APP_URL) {
      headers["Origin"] = process.env.APP_URL;
    }

    const response = await fetch(
      `${process.env.BETTER_AUTH_URL}/api/auth/sign-up/email`,
      {
        method: "POST",
        headers,
        body: JSON.stringify(adminData),
      },
    );

    const text = await response.text();
    let result: any;
    try {
      result = JSON.parse(text);
    } catch {
      console.error("Response was not JSON:", text);
      return;
    }

    console.log("Sign-up result:", result);

    if (!response.ok) {
      console.error("Failed to create admin via auth API");
      return;
    }

    // Promote user to ADMIN
    await prisma.user.update({
      where: { email: adminData.email },
      data: {
        role: userRoles.ADMIN,
        emailVerified: true,
      },
    });

    console.log("Admin promoted successfully!");
  } catch (error) {
    console.error("Error seeding admin:", error);
    process.exit(1); 
  }
}

// Run the seed
seedAdmin();
