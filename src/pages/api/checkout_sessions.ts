import type { NextApiRequest, NextApiResponse } from "next";
import Stripe from 'stripe';
import { env } from "~/env.mjs";

const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
    apiVersion: '2022-11-15'
})

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        console.log(req.body);
        try {
            const lineItem = {
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: 't-shirt or something'
                    },
                    unit_amount: 100
                },
                quantity: 1
            }

            const session = await stripe.checkout.sessions.create({
                line_items: [lineItem],
                mode: 'payment',
                success_url: `${env.NEXTAUTH_URL}/?success=true`,
                cancel_url: `${env.NEXTAUTH_URL}/?canceled=true`,
                automatic_tax: { enabled: true },
            });
            res.status(200).json({sessionId: session.id})
        } catch (err) {
            console.log(err);
        }
    } else {
        res.setHeader('Allow', 'POST');
        res.status(405).end('Method not Allowed');
    }
}
