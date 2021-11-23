import { useState } from 'react';
import { FaGithub } from 'react-icons/fa';
import { FiX } from 'react-icons/fi';
import styles from './styles.module.scss';

export function SignInOrOutButton() {
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);

  return isUserLoggedIn ? (
    <button
      type="button"
      className={styles.button}
      onClick={() => setIsUserLoggedIn(false)}
    >
      <FaGithub color="#04d3a1" /> João Amadeu
      <FiX color="#737380" className={styles.closeIcon} />
    </button>
  ) : (
    <button
      type="button"
      className={styles.button}
      onClick={() => setIsUserLoggedIn(true)}
    >
      <FaGithub color="#eba417" /> Sign in with Github
    </button>
  );
}
