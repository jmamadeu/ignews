import Link from 'next/link';
import { SignInOrOutButton } from '../sign-in-out-button';
import styles from './styles.module.scss';
import { useRouter } from 'next/router';
import { v4 } from 'uuid';

const routes = [
  { path: '/', name: 'Home' },
  { path: '/posts', name: 'Posts' }
];

export function Header() {
  const activeRoute = useRouter();

  return (
    <header className={styles.headerContainer}>
      <div className={styles.headerContent}>
        <img src="/images/logo.svg" alt="IgNews logo" />
        <nav className={styles.contentContainer}>
          {routes.map((route) => (
            <Link key={v4()} href={route.path}>
              <a
                className={
                  route.path === activeRoute.asPath ? styles.active : ''
                }
              >
                {route.name}
              </a>
            </Link>
          ))}
        </nav>
        <SignInOrOutButton />
      </div>
    </header>
  );
}
