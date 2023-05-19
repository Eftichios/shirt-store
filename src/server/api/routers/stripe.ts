import { env } from "~/env.mjs";
import {
    createTRPCRouter,
    protectedProcedure,
} from "~/server/api/trpc";
import Stripe from 'stripe';
import { z } from 'zod';

const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
    apiVersion: '2022-11-15'
})
export const stripeRouter = createTRPCRouter({

    checkout: protectedProcedure
        .input(z.object({
            shirts: z.array(
                z.object({
                    id: z.string(),
                    description: z.string(),
                    price: z.number(),
                    quantity: z.number(),
                    url: z.string()
                })
            )
        }))
        .mutation(async ({ input }) => {
            try {
                const shirts = input.shirts;
                const lineItems = shirts.map((shirt) => ({
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: shirt.description,
                            images: [shirt.url]
                        },
                        unit_amount: shirt.price * 100
                    },
                    quantity: shirt.quantity
                }))


                const session = await stripe.checkout.sessions.create({
                    line_items: lineItems,
                    mode: 'payment',
                    success_url: `${env.NEXTAUTH_URL}/?success=true`,
                    cancel_url: `${env.NEXTAUTH_URL}/?canceled=true`,
                    automatic_tax: { enabled: true },
                });
                return { sessionId: session.id };
            } catch (err) {
                console.log(err);
            }
        })
})
