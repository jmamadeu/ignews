import { SignInOrOutButton } from '../sign-in-out-button';
import styles from './styles.module.scss';

export function Header() {
  return (
    <header className={styles.headerContainer}>
      <div className={styles.headerContent}>
        <img src="/images/logo.svg" alt="IgNews logo" />
        <nav className={styles.contentContainer}>
          <a className={styles.active}>Home</a>
          <a>Posts</a>
        </nav>
        <SignInOrOutButton />
      </div>
    </header>
  );
}
