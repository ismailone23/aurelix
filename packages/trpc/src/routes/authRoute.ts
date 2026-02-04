import z from "zod";
import { protectedProcedure, publicProcedure, router } from "../trpc";
import { db, users } from "@workspace/db";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { TRPCError } from "@trpc/server";

export const authRouter = router({
  register: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string().min(6),
        name: z.string().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      const hashedPassword = await bcrypt.hash(input.password, 10);
      const [user] = await db
        .insert(users)
        .values({
          email: input.email,
          password: hashedPassword,
          name: input.name,
        })
        .returning();
      if (!user) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      const jwtSecret = process.env.JWT_SECRET;
      if (!jwtSecret) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "JWT_SECRET is not defined",
        });
      }
      const token = jwt.sign(
        { userId: user.id, role: user.role },
        jwtSecret,
        { expiresIn: "7d" },
      );

      return {
        user: { id: user.id, email: user.email, name: user.name },
        token,
      };
    }),

  login: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.email, input.email));

      if (!user || !(await bcrypt.compare(input.password, user.password))) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid credentials",
        });
      }

      const jwtSecret = process.env.JWT_SECRET;
      if (!jwtSecret) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "JWT_SECRET is not defined",
        });
      }

      const token = jwt.sign(
        { userId: user.id, role: user.role },
        jwtSecret,
        { expiresIn: "7d" },
      );

      return {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
        token,
      };
    }),

  me: protectedProcedure.query(async ({ ctx }) => {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, ctx.userId!));
    return user;
  }),
});
