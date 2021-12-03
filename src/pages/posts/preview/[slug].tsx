import { GetStaticProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { RichText } from 'prismic-dom';
import { getPrismicClient } from '../../../services/prismic';
import styles from '../post.module.scss';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/client';

type PostPreviewProperties = {
  post: {
    slug: string;
    title: string;
    content: string;
    updatedAt: string;
  };
};

export default function PostPreview({ post }: PostPreviewProperties) {
  const [session] = useSession();
  const { replace } = useRouter();

  useEffect(() => {
    if (session?.activeSubscription) {
      replace(`/posts/${post.slug}`);
    }
  }, [session]);

  return (
    <>
      <Head>
        <title>{post?.title}</title>
      </Head>

      <main className={styles.container}>
        <article className={styles.post}>
          <h1>{post?.title}</h1>
          <time> {post?.updatedAt} </time>

          <div
            dangerouslySetInnerHTML={{ __html: post?.content }}
            className={`${styles.postContent} ${styles.previewContent}`}
          />

          <div className={styles.continueReading}>
            Wanna continue reading?
            <Link href={'/'}>
              <a>Subscribe now 🤗</a>
            </Link>
          </div>
        </article>
      </main>
    </>
  );
}

export const getStaticPaths = () => {
  return {
    paths: [],
    fallback: 'blocking'
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug } = params as { slug: string };

  const prismic = getPrismicClient();

  const response = await prismic.getByUID('post', String(slug), {});

  const post = {
    slug,
    title: RichText.asText(response?.data?.title),
    content: RichText.asHtml(response?.data?.content.splice(0, 3)),
    updatedAt: new Date(
      response.last_publication_date as string
    ).toLocaleDateString('pt-Br', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    })
  };

  return {
    props: {
      post
    },
    revalidate: 60 * 30
  };
};
