import React, { useEffect, useState } from 'react';
import styles from './FluidProgressBar.module.css';

interface FluidProgressBarProps {
  progress: number; // Valor en porcentaje (0-100)
}

const FluidProgressBar: React.FC<FluidProgressBarProps> = ({ progress }) => {
  const [currentProgress, setCurrentProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentProgress((prev) => (prev < progress ? prev + 1 : prev));
    }, 20); // Incremento suave

    return () => clearInterval(interval);
  }, [progress]);

  return (
    <div className={styles.progressWrapper}>
      <div
        className={styles.svgWrapper}
        style={{ transform: `translateY(${100 - currentProgress}%)` }}
      >
        <svg
          viewBox="0 0 120 28"
          preserveAspectRatio="none"
          style={{ width: '200%', height: '100%' }}
        >
          <path
            className={styles.wave}
            d="M0,28 C30,0 90,0 120,28 L120,30 L0,30 Z"
          />
        </svg>
      </div>
    </div>
  );
};

export default FluidProgressBar;
