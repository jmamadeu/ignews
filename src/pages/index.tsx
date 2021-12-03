import type { GetStaticProps, NextPage } from 'next';

import Head from 'next/head';
import { SubscribeButton } from '../components/subscribe-button';
import { stripe } from '../services/stripe';
import styles from './home.module.scss';

type HomeProps = {
  product: {
    priceId: string;
    amount: number;
  };
};

const Home: NextPage<HomeProps> = ({ product }) => {
  return (
    <div>
      <Head>
        <title>Home | ig.news</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.contentContainer}>
        <section className={styles.hero}>
          <span>👏 Hey, welcome</span>
          <h1>
            News about the <span>React</span> world.
          </h1>
          <p>
            Get access to all the publications <br />
            <span>for {product?.amount} month</span>
          </p>

          <SubscribeButton />
        </section>

        <img src="/images/avatar.svg" alt="girl coding" />
      </main>
    </div>
  );
};

export default Home;

export const getStaticProps: GetStaticProps = async () => {
  const price = await stripe.prices.retrieve(
    process.env.STRIPE_PRICE_API_KEY as string
  );

  const product = {
    priceId: price.id,
    amount: new Intl.NumberFormat('en-US', {
      currency: 'USD',
      style: 'currency'
    }).format((price?.unit_amount || 0) / 100)
  };

  return {
    props: {
      product
    },
    revalidate: 60 * 60 * 24
  };
};
