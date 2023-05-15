import {
    createTRPCRouter,
    protectedProcedure,
} from "~/server/api/trpc";
import { z } from 'zod';

export const cartRouter = createTRPCRouter({
    getNumberOfItemsInCart: protectedProcedure.query(async ({ ctx }) => {

        const user = ctx.session.user;
        let cart = await ctx.prisma.cart.findFirst({
            where: { userId: user.id }
        })

        // cart should always exist
        // for now create it if it does not exist
        // in the future, create it when the user first logs in
        if (!cart) {
            cart = await ctx.prisma.cart.create({
                data:
                {
                    userId: user.id
                }
            })
        }

        const cartItems = await ctx.prisma.cartItems.findMany({
            where: { cartId: cart.id }

        })

        if (!cartItems) {
            return 0;
        }

        return cartItems.length;
    }),

    addToCart: protectedProcedure
        .input(z.object({ shirtId: z.string() }))
        .mutation(async ({ ctx, input }) => {

            const user = ctx.session.user;
            const cart = await ctx.prisma.cart.findFirstOrThrow({
                where: { userId: user.id }
            })

            const result = await ctx.prisma.cartItems.upsert({
                where: { cartId_shirtId: { cartId: cart.id, shirtId: input.shirtId } },
                update: {
                    quantity: {
                        increment: 1
                    }
                },
                create: {
                    cartId: cart.id,
                    shirtId: input.shirtId,
                    quantity: 1
                }
            })

            return result.quantity;
        }),

    removeFromCart: protectedProcedure
        .input(z.object({ shirtId: z.string() }))
        .mutation(async ({ ctx, input }) => {
            const user = ctx.session.user;
            const cart = await ctx.prisma.cart.findFirstOrThrow({
                where: { userId: user.id }
            })

            const result = await ctx.prisma.cartItems.delete({
                where: { cartId_shirtId: { cartId: cart.id, shirtId: input.shirtId } },
            })

            return result.quantity;

        }),

    removeAllFromCart: protectedProcedure
        .mutation(async ({ ctx }) => {
            const user = ctx.session.user;
            const cart = await ctx.prisma.cart.findFirstOrThrow({
                where: { userId: user.id }
            })

            const result = await ctx.prisma.cartItems.deleteMany({
                where: { cartId: cart.id },
            })

            return result.count;
        }),


    updateShirtQuantity: protectedProcedure
        .input(z.object({ shirtId: z.string(), quantity: z.number() }))
        .mutation(async ({ ctx, input }) => {
            const user = ctx.session.user;
            const cart = await ctx.prisma.cart.findFirstOrThrow({
                where: { userId: user.id }
            })

            const result = await ctx.prisma.cartItems.update({
                where: { cartId_shirtId: { cartId: cart.id, shirtId: input.shirtId } },
                data: {
                    quantity: input.quantity
                }
            })

            return result.quantity;
        }),



    getAllCartItems: protectedProcedure.query(async ({ ctx }) => {
        const user = ctx.session.user;

        const cart = await ctx.prisma.cart.findFirstOrThrow({
            where: { userId: user.id }
        })

        const cartItems = await ctx.prisma.cartItems.findMany({
            where: { cartId: cart.id },
            include: {
                shirt: true
            }
        });

        return cartItems;

    })
})
