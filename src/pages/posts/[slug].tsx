import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { RichText } from 'prismic-dom';
import { getPrismicClient } from '../../services/prismic';
import { getSession } from 'next-auth/client';
import styles from './post.module.scss';

type PostProperties = {
  post: {
    slug: string;
    title: string;
    content: string;
    updatedAt: string;
  };
};

export default function Post({ post }: PostProperties) {
  return (
    <>
      <Head>
        <title>{post.title}</title>
      </Head>

      <main className={styles.container}>
        <article className={styles.post}>
          <h1>{post.title}</h1>
          <time> {post.updatedAt} </time>

          <div
            dangerouslySetInnerHTML={{ __html: post.content }}
            className={styles.postContent}
          />
        </article>
      </main>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({
  req,
  params
}) => {
  const session = await getSession({ req });

  if (!session?.activeSubscription) {
    return {
      redirect: {
        destination: '/',
        permanent: false
      }
    };
  }

  const { slug } = params as { slug: string };

  const prismic = getPrismicClient(req);

  const response = await prismic.getByUID('post', String(slug), {});

  const post = {
    slug,
    title: RichText.asText(response?.data?.title),
    content: RichText.asHtml(response?.data?.content),
    updatedAt: new Date(
      response.last_publication_date as string
    ).toLocaleDateString('pt-Br', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    })
  };

  // if(!session) {

  // }

  return {
    props: {
      post
    }
  };
};
