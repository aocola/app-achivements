import React, { useEffect, useState } from 'react';
import styles from './LoginForm.module.css';
import CustomInput from '../common/Input/CustomInput';
import CustomButton from '../common/button/CustomButton';
import { loginUser, registerUser } from '@/services/userService';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { setUserState } from '@/redux/slices/appSlice';

interface LoginFormProps {
  onRoute: (role: 'ADMIN' | 'USER') => void;
}

const initialStateReg = { userId: '', password: '', name: '' };
const initialStateData = { userCode: '', password: '' };

const LoginForm: React.FC<LoginFormProps> = ({ onRoute }) => {
  const [formData, setFormData] = useState(initialStateData);
  const [errors, setErrors] = useState(initialStateData);
  const [showRegister, setShowRegister] = useState(false);
  const [registerData, setRegisterData] = useState(initialStateReg);
  const [registerErrors, setRegisterErrors] = useState(initialStateReg);
  const [registerTouched, setRegisterTouched] = useState({
    userId: false,
    password: false,
    name: false,
  });

  const dispatch = useDispatch();

  useEffect(() => {
    resetForms();
  }, [showRegister]);

  const resetForms = () => {
    setRegisterData(initialStateReg);
    setFormData(initialStateData);
    setRegisterErrors(initialStateReg);
    setErrors(initialStateData);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target;
    setRegisterTouched((prev) => ({ ...prev, [name]: true }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, form: 'login' | 'register') => {
    const { name, value } = e.target;
    if (form === 'login') {
      setFormData({ ...formData, [name]: value });
      setErrors({ ...errors, [name]: '' });
    } else {
      setRegisterData({ ...registerData, [name]: value });
      setRegisterErrors({ ...registerErrors, [name]: '' });
    }
  };

  const validateLoginForm = () => {
    const newErrors = { userCode: '', password: '' };
    let isValid = true;

    if (!formData.userCode || formData.userCode.length !== 8) {
      newErrors.userCode = 'El código de usuario es incorrecto';
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const validateRegisterForm = () => {
    const newErrors = { userId: '', password: '', name: '' };
    let isValid = true;

    if (!registerData.userId || registerData.userId.length !== 8) {
      newErrors.userId = 'El ID de usuario debe tener 8 caracteres';
      isValid = false;
    }

    if (!registerData.password) {
      newErrors.password = 'La contraseña es requerida';
      isValid = false;
    }

    if (!registerData.name) {
      newErrors.name = 'El nombre es requerido';
      isValid = false;
    }

    setRegisterErrors(newErrors);
    return isValid;
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateLoginForm()) {
      try {
        const { status, data } = await loginUser({
          userId: formData.userCode,
          password: formData.password,
        });
        if (!status) {
          toast.warning('Por favor verifique sus credenciales');
          return;
        } else {
          toast.success('Bienvenido');
          dispatch(setUserState(data));
          onRoute(data.role);
        }
      } catch {
        toast.error('Error al iniciar sesión');
      }
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateRegisterForm()) {
      try {
        const { status, message } = await registerUser(registerData);
        if (status) {
          toast.success('Usuario registrado exitosamente');
          setShowRegister(false);
        } else {
          toast.info(message);
        }
      } catch {
        toast.error('Error al registrar usuario');
      }
    }
  };

  return (
    <div className={styles.formWrapper}>
      {showRegister ? (
        <form onSubmit={handleRegisterSubmit} className={styles.form}>
          <h2 className={styles.title}>Registro de Usuario</h2>
          <CustomInput
            label="ID de Usuario"
            name="userId"
            value={registerData.userId}
            onChange={(e) => handleChange(e, 'register')}
            onBlur={handleBlur}
            errorMessage={registerTouched.userId ? registerErrors.userId : ''}
          />
          <CustomInput
            label="Nombre"
            name="name"
            value={registerData.name}
            onChange={(e) => handleChange(e, 'register')}
            onBlur={handleBlur}
            errorMessage={registerTouched.name ? registerErrors.name : ''}
          />
          <CustomInput
            label="Contraseña"
            name="password"
            type="password"
            value={registerData.password}
            onChange={(e) => handleChange(e, 'register')}
            onBlur={handleBlur}
            errorMessage={registerTouched.password ? registerErrors.password : ''}
          />
          <CustomButton label="Registrar" type="submit" variant="primary" size="medium" />
          <CustomButton
            label="Volver a Iniciar Sesión"
            onClick={() => setShowRegister(false)}
            variant="secondary"
            size="medium"
          />
        </form>
      ) : (
        <form onSubmit={handleLoginSubmit} className={styles.form}>
          <h2 className={styles.title}>Iniciar Sesión</h2>
          <CustomInput
            label="Código de Usuario"
            name="userCode"
            value={formData.userCode}
            onChange={(e) => handleChange(e, 'login')}
            errorMessage={errors.userCode}
          />
          <CustomInput
            label="Contraseña"
            name="password"
            type="password"
            value={formData.password}
            onChange={(e) => handleChange(e, 'login')}
            errorMessage={errors.password}
          />
          <CustomButton label="Iniciar Sesión" type="submit" variant="primary" size="medium" />
          <CustomButton
            label="Registrarse"
            onClick={() => setShowRegister(true)}
            variant="secondary"
            size="medium"
          />
        </form>
      )}
    </div>
  );
};

export default LoginForm;
