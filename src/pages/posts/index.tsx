import { GetStaticProps } from 'next';
import Head from 'next/head';
import Prismic from '@prismicio/client';
import { RichText } from 'prismic-dom';
import { getPrismicClient } from '../../services/prismic';
import styles from './styles.module.scss';

type PostProperties = {
  slug: string;
  title: string;
  excerpt: string;
  updatedAt: string;
};

type PostProps = {
  posts: Array<PostProperties>;
};

export default function Posts({ posts }: PostProps) {
  return (
    <>
      <Head>
        <title>Posts |ig.news</title>
      </Head>

      <main className={styles.container}>
        <div className={styles.posts}>
          {posts?.map((post) => (
            <a key={post.slug} href="!#">
              <time>{post.updatedAt}</time>

              <strong>{post.title}</strong>

              <p>{post.excerpt}</p>
            </a>
          ))}
        </div>
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  try {
    const prismic = getPrismicClient();

    const docs = await prismic.query([
      Prismic.predicates.at('document.type', 'post')
    ]);

    const posts = docs.results.map((post) => ({
      slug: post.uid,
      title: RichText.asText(post.data.title),
      excerpt:
        post.data.content.find(
          (content: { type: string }) => content.type === 'paragraph'
        )?.text ?? '',

      updatedAt: new Date(
        post.last_publication_date as string
      ).toLocaleDateString('pt-Br', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      })
    }));

    return {
      props: {
        posts
      }
    };
  } catch (err: any) {
    console.log(err);
  }

  return {
    props: {
      a: 1
    }
  };
};
