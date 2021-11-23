import { signIn, signOut, useSession } from 'next-auth/client';
import { FaGithub } from 'react-icons/fa';
import { FiX } from 'react-icons/fi';
import styles from './styles.module.scss';

export function SignInOrOutButton() {
  const [session] = useSession();

  const handleSignInButton = () => {
    signIn('github');
  };

  const handleSignOutButton = () => {
    signOut();
  };

  return session ? (
    <button
      type="button"
      className={styles.button}
      onClick={handleSignOutButton}
    >
      <FaGithub color="#04d3a1" />
      {session.user?.name}
      <FiX color="#737380" className={styles.closeIcon} />
    </button>
  ) : (
    <button
      type="button"
      className={styles.button}
      onClick={handleSignInButton}
    >
      <FaGithub color="#eba417" /> Sign in with Github
    </button>
  );
}
