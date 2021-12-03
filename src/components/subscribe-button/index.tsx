import { signIn, useSession } from 'next-auth/client';

import { api } from '../../services/api';
import { getStripeJS } from '../../services/stripe-js';
import styles from './styles.module.scss';
import { useRouter } from 'next/router';

export function SubscribeButton() {
  const [session] = useSession();
  const { push } = useRouter();

  async function handleSubscribe() {
    if (!session) {
      signIn('github');

      return;
    }

    if (session?.activeSubscription) {
      push('/posts');

      return;
    }

    try {
      const { data } = await api.post('/subscribe');

      const stripe = await getStripeJS();

      await stripe?.redirectToCheckout({ sessionId: data.sessionId });
    } catch (err: any) {
      console.log(err.message);
      alert(err.message);
    }
  }

  return (
    <button
      type="button"
      className={styles.subscribeButton}
      onClick={handleSubscribe}
    >
      Subscribe now
    </button>
  );
}
