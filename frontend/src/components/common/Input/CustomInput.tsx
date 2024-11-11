import React from 'react';
import styles from './CustomInput.module.css';

interface CustomInputProps {
  label?: string;
  type?: string;
  name: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void; // Agregar onBlur
  errorMessage?: string;
  className?: string;
}

const CustomInput: React.FC<CustomInputProps> = ({
  label,
  type = 'text',
  name,
  placeholder,
  value,
  onChange,
  onBlur, // Asegúrate de recibir onBlur como prop
  errorMessage,
  className,
}) => {
  return (
    <div className={`${styles.inputWrapper} ${className || ''}`}>
      {label && <label htmlFor={name} className={styles.label}>{label}</label>}
      <input
        type={type}
        id={name}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onBlur={onBlur} // Pasar el evento onBlur al input
        className={styles.input}
      />
      {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}
    </div>
  );
};

export default CustomInput;
