import { ReactNode } from 'react';
import styles from './CenteredContainer.module.css';

interface CenteredContainerProps {
  children: ReactNode;
}

export const CenteredContainer = ({ children }: CenteredContainerProps) => (
  <div className={styles.centered}>{children}</div>
);
