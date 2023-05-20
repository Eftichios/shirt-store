import { createTRPCRouter } from "~/server/api/trpc";
import { shirtRouter } from "./routers/shirt";
import { cartRouter } from "./routers/cart";
import { stripeRouter } from "./routers/stripe";
import { orderRouter } from "./routers/order";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  shirt: shirtRouter,
  cart: cartRouter,
  stripe: stripeRouter,
  order: orderRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
