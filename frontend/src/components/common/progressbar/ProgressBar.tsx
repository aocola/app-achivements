import React, { useEffect, useState } from 'react';
import styles from './ProgressBar.module.css';

interface ProgressBarProps {
  progress: number; // Valor de progreso en porcentaje (0-100)
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress }) => {
  const [bubbles, setBubbles] = useState<number[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (progress < 100) {
        setBubbles((prev) => [...prev, Math.random()]);
        setTimeout(() => {
          setBubbles((prev) => prev.slice(1));
        }, 4000);
      }
    }, 800);

    return () => clearInterval(interval);
  }, [progress]);

  return (
    <div className={styles.progressBarWrapper}>
      <div
        className={styles.progressBar}
        style={{ width: `${progress}%` }}
      ></div>
      <span className={styles.percentage}>{`${progress}%`}</span>
      {bubbles.map((_, index) => (
        <div
          key={index}
          className={styles.bubble}
          style={{
            left: `${Math.random() * 90}%`,
            animationDelay: `${Math.random() * 2}s`,
          }}
        ></div>
      ))}
    </div>
  );
};

export default ProgressBar;
