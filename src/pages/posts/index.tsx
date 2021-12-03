import Head from 'next/head';
import styles from './styles.module.scss';

export default function Posts() {
  return (
    <>
      <Head>
        <title>Posts |ig.news</title>
      </Head>

      <main className={styles.container}>
        <div className={styles.posts}>
          <a href="!#">
            <time>March 12th</time>

            <strong>How to code</strong>

            <p>
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Dolorum
              in asperiores impedit odit molestias, perspiciatis voluptas ea,
              similique praesentium neque recusandae at, consequatur ab!
              Blanditiis suscipit enim voluptates iste cupiditate! Lorem ipsum
              dolor sit amet consectetur adipisicing elit. Consequuntur vitae
              minima perspiciatis suscipit neque cumque quos adipisci eligendi
              similique! Laudantium, sint odit nam doloribus dolorum suscipit
              velit vel amet. Iste. Lorem ipsum dolor sit amet consectetur,
              adipisicing elit. Deleniti quidem distinctio dolor. Cumque ullam,
              autem at ipsa obcaecati beatae facilis eum ad doloremque? Nulla
              minus aspernatur cumque exercitationem blanditiis atque?
            </p>
          </a>

          <a href="!#">
            <time>March 12th</time>

            <strong>How to code</strong>

            <p>
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Dolorum
              in asperiores impedit odit molestias, perspiciatis voluptas ea,
              similique praesentium neque recusandae at, consequatur ab!
              Blanditiis suscipit enim voluptates iste cupiditate! Lorem ipsum
              dolor sit amet consectetur adipisicing elit. Consequuntur vitae
              minima perspiciatis suscipit neque cumque quos adipisci eligendi
              similique! Laudantium, sint odit nam doloribus dolorum suscipit
              velit vel amet. Iste. Lorem ipsum dolor sit amet consectetur,
              adipisicing elit. Deleniti quidem distinctio dolor. Cumque ullam,
              autem at ipsa obcaecati beatae facilis eum ad doloremque? Nulla
              minus aspernatur cumque exercitationem blanditiis atque?
            </p>
          </a>

          <a href="!#">
            <time>March 12th</time>

            <strong>How to code</strong>

            <p>
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Dolorum
              in asperiores impedit odit molestias, perspiciatis voluptas ea,
              similique praesentium neque recusandae at, consequatur ab!
              Blanditiis suscipit enim voluptates iste cupiditate! Lorem ipsum
              dolor sit amet consectetur adipisicing elit. Consequuntur vitae
              minima perspiciatis suscipit neque cumque quos adipisci eligendi
              similique! Laudantium, sint odit nam doloribus dolorum suscipit
              velit vel amet. Iste. Lorem ipsum dolor sit amet consectetur,
              adipisicing elit. Deleniti quidem distinctio dolor. Cumque ullam,
              autem at ipsa obcaecati beatae facilis eum ad doloremque? Nulla
              minus aspernatur cumque exercitationem blanditiis atque?
            </p>
          </a>
        </div>
      </main>
    </>
  );
}
