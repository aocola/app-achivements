import React from 'react';
import styles from './CustomButton.module.css';

interface CustomButtonProps {
  label: string;
  onClick?: () => void;
  variant: 'primary' | 'secondary' | 'danger';
  size: 'small' | 'medium' | 'large';
  type?: 'button' | 'submit' | 'reset'; // Agregar soporte para el atributo `type`
  className?: string; // Permitir clases personalizadas
}

const CustomButton: React.FC<CustomButtonProps> = ({
  label,
  onClick,
  variant,
  size,
  type = 'button', // Valor predeterminado para `type`
  className = '',
}) => {
  return (
    <button
      type={type} // Usar el atributo `type` en el botón
      onClick={onClick}
      className={`${styles.button} ${styles[variant]} ${styles[size]} ${className}`}
    >
      {label}
    </button>
  );
};

export default CustomButton;
