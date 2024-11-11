import React from 'react';
import styles from './ReusableForm.module.css';

interface ReusableFormProps {
  title: string;
  onSubmit: (e: React.FormEvent) => void;
  submitLabel?: string;
  children: React.ReactNode;
}

const ReusableForm: React.FC<ReusableFormProps> = ({
  title,
  onSubmit,
  submitLabel = 'Submit',
  children,
}) => {
  return (
    <div className={styles.formWrapper}>
      <h2 className={styles.formTitle}>{title}</h2>
      <form onSubmit={onSubmit} className={styles.form}>
        {children}
        <button type="submit" className={styles.submitButton}>
          {submitLabel}
        </button>
      </form>
    </div>
  );
};

export default ReusableForm;
