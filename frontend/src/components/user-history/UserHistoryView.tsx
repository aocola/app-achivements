import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import styles from './UserHistoryView.module.css';
import CustomTable from '../common/table/CustomTable';
import CustomButton from '../common/button/CustomButton';
import { getUserDetalleById } from '@/services/userService';
import { toast } from 'react-toastify';

interface Detail {
  detalleId: string;
  userId: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  counter: number;
  createdAt: Date;
  updatedAt: Date;
  medal: string;
}

const UserHistoryView: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;

  const [data, setData] = useState<Detail[]>([]);

  useEffect(() => {
    const getDetails = async () => {
      const { data, status } = await getUserDetalleById(id as string);
      if (!status) {
        toast.error('Ocurrió un error al obtener los datos');
        return;
      }
      if (data.length === 0) {
        toast.error('El usuario no posee registros');
        return;
      }

      // Mapear los estados a español
      const translatedData = data.map((item: Detail) => ({
        ...item,
        status: item.status === 'APPROVED' 
          ? 'Aprobado' 
          : item.status === 'REJECTED' 
          ? 'Rechazado' 
          : 'Pendiente',
      }));

      setData(translatedData);
    };
    getDetails();
  }, [id]);

  const handleBack = () => {
    router.push('/admin');
  };

  const renderBadge = (status: string) => {
    const badgeStyles: Record<'Aprobado' | 'Rechazado' | 'Pendiente', string> = {
      Aprobado: styles.approvedBadge,
      Rechazado: styles.rejectedBadge,
      Pendiente: styles.pendingBadge,
    };
  
    return <span className={`${styles.badge} ${badgeStyles[status as 'Aprobado' | 'Rechazado' | 'Pendiente']}`}>{status}</span>;
  };

  return (
    <div className={styles.card}>
      <div className={styles.container}>
        <h2 className={styles.title}>Historial del Usuario: {id}</h2>
        <CustomButton
          label="Regresar"
          onClick={handleBack}
          variant="secondary"
          size="small"
          className={styles.backButton}
        />
        <CustomTable
          data={data}
          columns={[
            { header: 'ID Usuario', accessor: 'userId' as keyof Detail },
            { header: 'Registrados', accessor: 'counter' as keyof Detail },
            {
              header: 'Fecha de Creación',
              accessor: 'createdAt' as keyof Detail,
              render: (row) => new Date(row.createdAt).toLocaleString(),
            },
            {
              header: 'Fecha de Actualización',
              accessor: 'updatedAt' as keyof Detail,
              render: (row) => new Date(row.updatedAt).toLocaleString(),
            },
            { header: 'Medalla', accessor: 'medal' as keyof Detail },
            {
              header: 'Estado',
              accessor: 'status' as keyof Detail,
              render: (row) => renderBadge(row.status),
            },
          ]}
          rowsPerPage={5}
        />
      </div>
    </div>
  );
};

export default UserHistoryView;
