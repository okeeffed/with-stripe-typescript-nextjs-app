import { NextApiRequest, NextApiResponse } from 'next';

/*
 * Product data can be loaded from anywhere. In this case, we’re loading it from
 * a local JSON file, but this could also come from an async call to your
 * inventory management service, a database query, or some other API call.
 *
 * The important thing is that the product info is loaded from somewhere trusted
 * so you know the pricing information is accurate.
 */
import inventory from '../../../../data/saas.json';

import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  // https://github.com/stripe/stripe-node#configuration
  apiVersion: '2020-03-02',
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'POST') {
    try {
      // Validate the cart details that were sent from the client.
      const cartItems = req.body;
      const line_items = validateCartItems(cartItems);
      // Create Checkout Sessions from body params.
      const params: Stripe.Checkout.SessionCreateParams = {
        mode: 'subscription',
        payment_method_types: ['card'],
        line_items,
        success_url: `${req.headers.origin}/result?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${req.headers.origin}/use-shopping-cart`,
      };
      const checkoutSession: Stripe.Checkout.Session = await stripe.checkout.sessions.create(
        params,
      );

      res.status(200).json(checkoutSession);
    } catch (err) {
      res.status(500).json({ statusCode: 500, message: err.message });
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}

type SubscriptionItem = {
  name: string;
  description: string;
  sku: string;
  prod: string;
  priceId: string;
  price: number;
  currency: string;
};

const validateCartItems = (cartDetails: SubscriptionItem[]) => {
  const validatedItems = [];
  for (const sku in cartDetails) {
    const product = cartDetails[sku];
    const item = {
      price: product.priceId,
      quantity: 1,
    };

    if (inventory.some((item) => item.priceId === product.priceId)) {
      validatedItems.push(item);
    }
  }

  return validatedItems;
};
