import React from 'react';
import styles from './LinearProgressBar.module.css';

interface LinearProgressBarProps {
  progress: number; // Valor en porcentaje (0-100)
  showLabel?: boolean; // Muestra el porcentaje dentro de la barra
}

const LinearProgressBar: React.FC<LinearProgressBarProps> = ({ progress=0, showLabel = true }) => {
  return (
    <div className={styles.progressWrapper}>
      <div
        className={styles.progressBar}
        style={{ width: `${progress}%` }}
      ></div>
      {showLabel && <span className={styles.label}>{progress}%</span>}
    </div>
  );
};

export default LinearProgressBar;
