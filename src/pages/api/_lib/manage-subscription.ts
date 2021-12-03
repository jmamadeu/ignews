import { fauna } from '../../../services/fauna';
import { query as q } from 'faunadb';
import { stripe } from '../../../services/stripe';

type SaveSubscriptionType = {
  subscriptionId: string;
  customerId: string;
  createAction?: boolean;
};

export async function saveSubscription({
  customerId,
  subscriptionId,
  createAction = false
}: SaveSubscriptionType) {
  try {
    const userRef = await fauna.query(
      q.Select(
        ['ref'],
        q.Get(q.Match(q.Index('user_by_stripe_customer_id'), customerId))
      )
    );

    const subscription = await stripe.subscriptions.retrieve(subscriptionId);

    const subscriptionData = {
      id: subscription.id,
      userId: userRef,
      status: subscription.status,
      priceId: subscription.items.data[0].price.id
    };

    if (createAction) {
      await fauna.query(
        q.Create(q.Collection('subscriptions'), { data: subscriptionData })
      );

      return;
    }

    await fauna.query(
      q.Replace(
        q.Select(
          ['ref'],
          q.Get(q.Match(q.Index('subscription_by_id'), subscriptionId))
        ),
        {
          data: subscriptionData
        }
      )
    );
  } catch (err) {
    console.log(err);
  }
}
