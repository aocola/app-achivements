import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import styles from './UserInitialView.module.css';
import CustomButton from '../common/button/CustomButton';
import { processCSVByIndex } from '@/utils/processCv';
import { getProgress, getUserMedals, registerClientesBatch } from '@/services/userService';
import { toast } from 'react-toastify';
import { useSelector, useDispatch } from 'react-redux';
import { setUserState } from '@/redux/slices/appSlice';
import { getHighestMedalFromSet, getMaximumMedal, getStyle } from './medals';
import Image from 'next/image';
import ProgressBar from '../common/progressbar/ProgressBar';
import { io } from 'socket.io-client';

const UserInitialView: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const router = useRouter();
  const [maxMedal, setMaxMedal] = useState<{ tipo: string; status: string }>({ tipo: '', status: '' });
  const user = useSelector((state: any) => state.app.userState);
  const dispatch = useDispatch();
  const [progress, setProgress] = useState(0);
  const [isMaxMedal, setIsMaxMedal] = useState(false);

  const getMedalValues = useCallback(async () => {
    if (!user || Array.isArray(user.userId)) return;

    try {
      const { data } = await getUserMedals(user.userId);
      const medallas = new Set<string>(
        data.filter((item: any) => 'VERIFICADA'===item.status).map((item: any) => item.tipo)
      );
      const medal = medallas && getHighestMedalFromSet(medallas);
      const dataMedal = data.find((item: any) => item.tipo === medal);
      dataMedal && dataMedal.tipo===getMaximumMedal() && setIsMaxMedal(true);
      setMaxMedal(dataMedal);
    } catch(e) {
      console.log(e);
      toast.error('Error al obtener medallas.');
    }
  }, [user]);

  const getDetailValues = useCallback(async () => {
    if (!user || Array.isArray(user.userId)) return;

    try {
      const { data } = await getProgress(user.userId);
      setProgress((data % 10) * 10);
    } catch {
      toast.error('Error al obtener detalles.');
    }
  }, [user]);

  useEffect(() => {
    getMedalValues();
    getDetailValues();

    if (user && user.userId) {
      const socket = io(process.env.SERVER_HOST, {
        transports: ['websocket'],
        withCredentials: true,
      });

      socket.emit('join', user.userId, (response: any) => {
        console.log('Unido a la sala:', response);
      });

      socket.on('notifyAchivement', (medal) => {
        try {
          toast.success(`Se ha alcanzado una nueva medalla! Felicitaciones: ${medal.tipo}`);
          getMedalValues();
        } catch {
          toast.error('Error al procesar la notificación.');
        }
      });

      socket.on('notifyApproval', (detail) => {
        try {
          if (detail.status === 'APPROVED') {
            if(detail.counter<10)
              setProgress((prev) =>{
                const newProgress =  prev + (detail.counter % 10) * 10;
                return newProgress>100?100:newProgress;
              });
            else resetProgress();
            
           
            toast.info(`Se ha aprobado uno de sus archivos que contaba con ${detail.counter} clientes.`);
          } else {
            toast.warn(`Se ha rechazado uno de sus archivos que contaba con ${detail.counter} clientes.`);
          }
        } catch {
          toast.error('Error al procesar la notificación.');
        }
      });

      socket.on('error', (error) => {
        console.error('Error de socket:', error);
      });

      return () => {
        socket.off('notifyApproval');
        socket.disconnect();
      };
    }
  }, [user, getMedalValues, getDetailValues]);

  const resetProgress = () => {
    setProgress(100);
    setTimeout(() => {
      setProgress(0);
    }, 500);
  };

  useEffect(() => {
    if (progress >= 100) {
      getMedalValues();
      resetProgress();
      progress === 100 ? resetProgress() : setProgress((prev) => prev % 100);
    }
  }, [progress, getMedalValues,resetProgress]);

  const handleLogout = async () => {
    try {
      dispatch(setUserState(null)); 
      toast.success('Sesión cerrada exitosamente.');
      router.push('/'); 
    } catch {
      toast.error('Error al cerrar sesión.');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!user || Array.isArray(user.userId)) {
      toast.error('ID de usuario no válido.');
      return;
    }
    if (selectedFile) {
      try {
        const payload = await processCSVByIndex(selectedFile, user.userId);
        if(payload.warning){toast.warn(payload.warning); return;}
        
        await registerClientesBatch(payload);
        await getMedalValues();
        toast.success(`¡Operación exitosa! Se han ingresado ${payload.clientes.length} clientes!`);
      } catch(error) {
        toast.error('Operación fallida: Ocurrió un error durante el proceso.');
      }
    } else {
      toast.warn('Por favor, selecciona un archivo .csv antes de enviar.');
    }
  };

  const handleViewMedals = () => {
    if (user && user.userId) router.push(`/user/medals/${user.userId}`);
  };

  const getStatus = (status: string) => {
    switch (status) {
      case 'NO_VERIFICADA':
        return 'No Verificada';
      case 'VERIFICADA':
        return 'Verificada';
      case 'BLOQUEADA':
        return 'BLOQUEADA';
      default:
        return 'No encontrado';
    }
  };

  return (
    <div className={styles.card}>
      <div className={styles.container}>
        <div className={styles.labelWrapper}>
          <label>ID User: {`${user ? user.userId : 'NOT LOGGED'}`}</label>
        </div>

        <div className={styles.fileInputWrapper}>
          <input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            id="fileUpload"
            className={styles.hiddenFileInput}
          />
          <CustomButton
            label={selectedFile ? selectedFile.name : 'Seleccionar Archivo .csv'}
            onClick={() => document.getElementById('fileUpload')?.click()}
            variant="danger"
            size="medium"
          />
        </div>

        <CustomButton label="Enviar" onClick={handleSubmit} variant="primary" size="medium" />

        <div className={styles.medalSection}>
          {maxMedal && <p>{`${maxMedal.tipo}`} ({`${getStatus(maxMedal.status)}`})</p>}
          {!maxMedal && <p>Sin Medalla</p>}
          <div className={`${styles.medalPlaceholder} ${maxMedal && styles[getStyle(maxMedal.tipo)]}`}>
            <Image src="/medal.svg" alt="Medalla" width={32} height={32} />
          </div>
          <div className={styles.progressSection}>
            {!isMaxMedal && <p>Progreso hacia la próxima medalla:</p>}
            {isMaxMedal && <p>¡Felicidades ha alcanzado la máxima medalla!</p>}
            <ProgressBar progress={isMaxMedal?100:progress} />
          </div>
          <button onClick={handleViewMedals} className={styles.link}>
            Ver todas mis medallas
          </button>
          <br/>
          <a
            href="/plantilla.csv"
            download="plantilla.csv"
            className={styles.link} // Agrega estilos similares a otros botones/links
          >
            Descargar Plantilla CSV
          </a>
        </div>

        <CustomButton
          label="Cerrar Sesión"
          onClick={handleLogout}
          variant="danger"
          size="medium"
        />
      </div>
    </div>
  );
};

export default UserInitialView;
