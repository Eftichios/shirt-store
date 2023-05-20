import {
    createTRPCRouter,
    protectedProcedure,
} from "~/server/api/trpc";

export const orderRouter = createTRPCRouter({
    getAllOrders: protectedProcedure
        .query(async ({ ctx} ) => {

            const userId = ctx.session.user.id;

            const orders = await ctx.prisma.order.findMany({
                where: { userId: userId},
                include: {orderItems: true}
            })

            return orders;
        })
})
