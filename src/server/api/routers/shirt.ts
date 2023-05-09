import {
    createTRPCRouter,
    publicProcedure,
    protectedProcedure,
} from "~/server/api/trpc";
import { z } from 'zod';

export const shirtRouter = createTRPCRouter({
    getAll: publicProcedure.query(({ ctx }) => {
        return ctx.prisma.shirt.findMany();
    }),

    isShirtInCart: protectedProcedure
        .input(z.object({ shirtId: z.string() }))
        .query(async ({ ctx, input }) => {
            const user = ctx.session.user;

            const cart = await ctx.prisma.cart.findFirstOrThrow({
                where: { userId: user.id }
            })

            const result = await ctx.prisma.cartItems.findUnique({
                where: {cartId_shirtId: {cartId: cart.id, shirtId: input.shirtId}}
            })

            return result !== null;

        }),

    getSecretMessage: protectedProcedure.query(() => {
        return "you can now see this secret message!";
    }),
});
