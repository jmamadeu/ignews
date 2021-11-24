import { query as q } from 'faunadb';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/client';
import { fauna } from '../../services/fauna';
import { stripe } from '../../services/stripe';

type User = {
  ref: {
    id: string;
  };
  data: { stripe_customer_id: string };
};

export default async (request: NextApiRequest, response: NextApiResponse) => {
  if (request.method === 'POST') {
    const session = await getSession({ req: request });

    const user = await fauna.query<User>(
      q.Get(
        q.Match(
          q.Index('user_by_email'),
          q.Casefold(session?.user?.email as string)
        )
      )
    );

    let customerId = user.data.stripe_customer_id;

    if (!customerId) {
      const stripeCostumer = await stripe.customers.create({
        email: session?.user?.email as string
      });

      customerId = stripeCostumer.id;
    }

    await fauna.query(
      q.Update(q.Ref(q.Collection('users'), user.ref.id), {
        data: { stripe_customer_id: customerId }
      })
    );

    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      billing_address_collection: 'required',
      line_items: [{ price: process.env.STRIPE_PRICE_API_KEY, quantity: 1 }],
      mode: 'subscription',
      allow_promotion_codes: true,
      success_url: process.env.STRIPE_SUCCESS_URL as string,
      cancel_url: process.env.STRIPE_CANCEL_URL as string,
      customer: customerId
    });

    return response.status(200).json({
      sessionId: checkoutSession.id
    });
  } else {
    response.setHeader('Allow', 'POST');
    response.status(405).end('Method not allowed');
  }
};
