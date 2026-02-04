import "dotenv/config";
import { db, users } from "./index";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

async function seed() {
  console.log("Seeding database...");

  // Create admin user
  const adminEmail = "aurelixperfume@gmail.com";
  const adminPassword = "#Aurelix*1@@";

  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  try {
    const [existingUser] = await db
      .select()
      .from(users)
      .where(eq(users.email, adminEmail));

    if (existingUser) {
      console.log("Admin user already exists:", adminEmail);
    } else {
      const [admin] = await db
        .insert(users)
        .values({
          email: adminEmail,
          password: hashedPassword,
          name: "Admin",
          role: "admin",
        })
        .returning();

      console.log("Created admin user:", admin?.email);
    }
  } catch (error) {
    console.error("Error seeding:", error);
  }

  console.log("\n✅ Seed completed!");
  console.log("\nAdmin credentials:");
  console.log("  Email: aurelixperfume@gmail.com");
  console.log("  Password: #Aurelix*1@@");

  process.exit(0);
}

seed();
