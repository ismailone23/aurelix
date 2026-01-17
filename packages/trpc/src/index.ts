// Re-export everything from trpc setup
export {
  router,
  publicProcedure,
  protectedProcedure,
  adminProcedure,
  type Context,
} from "./trpc";

// Import and re-export the app router
import { appRouter } from "./routes";
export { appRouter };
export type AppRouter = typeof appRouter;
