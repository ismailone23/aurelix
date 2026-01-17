import { initTRPC, TRPCError } from "@trpc/server";

// Context
export interface Context {
  userId?: number;
  userRole?: string;
}

const t = initTRPC.context<Context>().create();

export const router = t.router;
export const publicProcedure = t.procedure;

// Middleware for authentication
const isAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.userId) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next({
    ctx: {
      userId: ctx.userId,
      userRole: ctx.userRole,
    },
  });
});

// Middleware for admin only
const isAdmin = t.middleware(({ ctx, next }) => {
  if (!ctx.userId || ctx.userRole !== "admin") {
    throw new TRPCError({ code: "FORBIDDEN" });
  }
  return next({
    ctx: {
      userId: ctx.userId,
      userRole: ctx.userRole,
    },
  });
});

export const protectedProcedure = t.procedure.use(isAuthed);
export const adminProcedure = t.procedure.use(isAdmin);
