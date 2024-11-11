import React from 'react';
import styles from './ResponsiveBox.module.css';

interface ResponsiveBoxProps {
  children: React.ReactNode; // Los componentes a albergar
}

const ResponsiveBox: React.FC<ResponsiveBoxProps> = ({ children }) => {
  return <div className={styles.boxWrapper}>{children}</div>;
};

export default ResponsiveBox;
