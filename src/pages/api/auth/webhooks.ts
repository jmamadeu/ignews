import { NextApiRequest, NextApiResponse } from 'next';

import { Readable } from 'stream';
import Stripe from 'stripe';
import { saveSubscription } from '../_lib/manage-subscription';
import { stripe } from '../../../services/stripe';

async function buffer(readable: Readable) {
  const chunks = [];

  for await (const chunk of readable) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }

  return Buffer.concat(chunks);
}

export const config = {
  api: {
    bodyParser: false
  }
};

const relevantEvents = new Set([
  'checkout.session.completed',
  'customer.subscription.deleted',
  'customer.subscription.updated'
]);

export default async (request: NextApiRequest, response: NextApiResponse) => {
  if (request.method === 'POST') {
    const buf = await buffer(request);
    const secret = request.headers['stripe-signature'] as string;

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        buf,
        secret,
        process.env.STRIPE_WEBHOOK_SECRET as string
      );
    } catch (err: any) {
      return response.status(400).send(`Webhook error ${err.message}`);
    }
    const { type } = event;

    if (relevantEvents.has(type)) {
      try {
        switch (type) {
          case 'checkout.session.completed': {
            const checkoutSession = event.data
              .object as Stripe.Checkout.Session;

            await saveSubscription({
              subscriptionId:
                checkoutSession.subscription?.toString() as string,
              customerId: checkoutSession.customer?.toString() as string,
              createAction: true
            });
            break;
          }
          case 'customer.subscription.deleted':
          case 'customer.subscription.updated': {
            const subscription = event.data.object as Stripe.Subscription;

            await saveSubscription({
              customerId: subscription.customer.toString(),
              subscriptionId: subscription.id.toString()
            });

            break;
          }

          default: {
            throw new Error('Unhandled event.');
          }
        }
      } catch (err) {
        return response.json({ error: 'webhook handler failed' });
      }
    }

    return response.json({ received: true });
  } else {
    response.setHeader('Allow', 'POST');
    response.status(405).end('Method not allowed');
  }
};
