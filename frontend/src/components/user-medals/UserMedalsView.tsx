import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import styles from './UserMedalsView.module.css';
import CustomButton from '../common/button/CustomButton'; 
import { getUserMedals } from '@/services/userService';
import { io } from 'socket.io-client';
import { toast } from 'react-toastify';

interface Medalla {
  status: string,
  tipo: string
}

const UserMedalsView: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;

  const [medallas, setMedallas] = useState([]);
  

  const getValues = async () => {
    const { data, status } = await getUserMedals(id as string);
    if(status){
      const parsed = data
        .filter((item: any) => item.status === 'VERIFICADA' || item.status === 'NO_VERIFICADA')
        .map((item: any) => { return { tipo: item.tipo as string, status: item.status } });
      setMedallas(parsed);
    }
  }
  
  useEffect(() => {
      getValues();
      if(id){
        const socket = io(process.env.SERVER_HOST, {
          transports: ['websocket'],
          withCredentials: true,
        });
        
        socket.emit('join', id, (response: any) => {
          console.log('Unido a la sala:', response);
        });

        socket.on('notifyAchivement', (medal) => {
          try {
            toast.success(`Se ha alcanzado una nueva medalla! Felicitaciones: ${medal.tipo}`);
            getValues();
          } catch {
            toast.error('Error al procesar la notificación.');
          }
        });
  
        socket.on('error', (error) => {
          console.error('Error de socket:', error);
        });
  
        return () => {
          socket.off('notifyAchivement');
          socket.disconnect();
        };
      }
  }, [id]);

  const handleBack = () => {
    router.push('/user');
  };

  return (
    <div className={styles.card}>
      <div className={styles.container}>
        <h2 className={styles.title}>Mis Medallas</h2>
        <CustomButton
          label="Regresar"
          onClick={handleBack}
          variant="secondary"
          size="small"
          className={styles.backButton}
        />
        <div className={styles.medalsGrid}>
          {medallas && medallas.map((medal: Medalla, index) => (
            <div key={index} className={styles.medalItem}>
              <div className={`${styles.medal} ${medal.status==="VERIFICADA"?styles[(medal.tipo).toLowerCase()]:styles.notverify}`}></div>
              <p className={styles.medalLabel}>{medal.tipo} {`${medal.status==="NO_VERIFICADA"?"(No Verificada)":""}`}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserMedalsView;
