import { createTRPCRouter } from "~/server/api/trpc";
import { exampleRouter } from "~/server/api/routers/example";
import { shirtRouter } from "./routers/shirt";
import { cartRouter } from "./routers/cart";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  shirt: shirtRouter,
  cart: cartRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
