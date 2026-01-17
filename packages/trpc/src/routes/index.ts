import { router } from "../trpc";
import { authRouter } from "./authRoute";
import { ordersRouter } from "./ordersRouter";
import { productsRouter } from "./productRouter";

// Root router
export const appRouter = router({
  auth: authRouter,
  products: productsRouter,
  orders: ordersRouter,
});
