import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import styles from './AdminView.module.css';
import CustomTable from '../common/table/CustomTable';
import CustomButton from '../common/button/CustomButton';
import { useSelector, useDispatch } from 'react-redux';
import { acceptDetalle, getAllDetalles, rejectDetalle } from '@/services/userService';
import { toast } from 'react-toastify';
import CustomInput from '../common/Input/CustomInput';
import { io } from 'socket.io-client';
import { setUserState } from '@/redux/slices/appSlice';

interface Detail {
  detalleId: string;
  userId: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  counter: number;
  createdAt: Date;
  updatedAt: Date;
}

const AdminView: React.FC = () => {
  const [data, setData] = useState<Detail[]>([]);
  const [filteredData, setFilteredData] = useState<Detail[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isClient, setIsClient] = useState(false);
  const user = useSelector((state: any) => state.app.userState);
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    setIsClient(true); // Marca que estamos en el cliente
  }, []);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const { data, status } = await getAllDetalles();
        if (!status) {
          toast.error('Ocurrio un error al obtener los datos');
          return;
        }
        const pendingDetails = data.filter((item: Detail) => item.status === 'PENDING');
        setData(pendingDetails);
        setFilteredData(pendingDetails);
      } catch {
        toast.error('Error al obtener detalles.');
      }
    };

    fetchDetails();

    if (user && user.userId) {
      const socket = io(process.env.SERVER_HOST, {
        transports: ['websocket'],
        withCredentials: true,
      });

      // Unirse a la sala de administradores
      socket.emit('joinAdmin', (response: any) => {
        console.log('Unido a la sala de administradores:', response);
      });

      // Escuchar nuevos detalles
      socket.on('notifyDetail', (detail) => {
        toast.info(`Nuevo detalle agregado de usuario: ${detail.userId}`);
        setData((prevData) => [detail, ...prevData]);
        setFilteredData((prevData) => [detail, ...prevData]);
      });

      // Remover detalles aprobados
      socket.on('removeDetail', ({ detailId }) => {
        setData((prevData) => prevData.filter((item) => item.detalleId !== detailId));
        setFilteredData((prevData) => prevData.filter((item) => item.detalleId !== detailId));
      });

      socket.on('error', (error) => {
        console.error('Error de socket:', error);
      });

      return () => {
        socket.off('notifyDetail');
        socket.off('removeDetail');
        socket.disconnect();
      };
    }
  }, [user]);

  const handleSearch = () => {
    if (!searchQuery) {
      setFilteredData(data);
      return;
    }
    const result = data.filter((item) => item.userId.includes(searchQuery));
    setFilteredData(result);
  };

  const handleAction = async (counter: number, detalleId: string, userId: string, action: 'APPROVED' | 'REJECTED') => {
    try {
      let status;
      if (action === 'APPROVED') {
        ({ status } = await acceptDetalle({ id: detalleId }));
        status ? toast.success('Operación exitosa se aprobó el registro') : toast.warn('Ocurrio un problema al aprobar el registro');
      } else {
        ({ status } = await rejectDetalle({ id: detalleId }));
        status ? toast.success('Operación exitosa se rechazó el registro') : toast.warn('Ocurrió un problema al rechazar el registro');
      }

      if (status) {
        setFilteredData((prev) => prev.filter((item: Detail) => item.detalleId !== detalleId));
      }
    } catch {
      toast.error(`Ocurrió un error al ${action === 'APPROVED' ? 'aprobar' : 'rechazar'} el registro`);
    }
  };

  const handleViewHistory = (userId: string) => {
    router.push(`/admin/history/${userId}`);
  };

  const handleLogout = async () => {
    try {
      dispatch(setUserState(null));
      toast.success('Sesión cerrada exitosamente.');
      router.push('/');
    } catch {
      toast.error('Error al cerrar sesión.');
    }
  };

  return (
    <div className={styles.card}>
      <div className={styles.container}>
        <h2 className={styles.title}>Administración de Usuarios</h2>
        <div className={styles.searchContainer}>
          <div className={styles.searchOptions}>
          <CustomInput
            name="search"
            placeholder="Ingrese User ID"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <CustomButton label="Buscar en Tabla" variant="primary" size="medium" onClick={handleSearch} />
          <CustomButton
            label="Buscar Historial"
            variant="secondary"
            size="medium"
            onClick={() => {
              if (!searchQuery) {
                toast.info('Debe de ingresar un ID de Usuario');
                return;
              }
              router.push(`/admin/history/${searchQuery}`);
            }}
          />
          </div>
          
          <CustomButton
          label="Cerrar Sesión"
          onClick={handleLogout}
          variant="danger"
          size="medium"
        />
        </div>
        
        <CustomTable
          data={filteredData}
          columns={[
            { header: 'User ID', accessor: 'userId' as keyof Detail },
            { header: 'Counter', accessor: 'counter' as keyof Detail },
            {
              header: 'Created At',
              accessor: 'createdAt' as keyof Detail,
              render: (row: Detail) => (isClient ? new Date(row.createdAt).toLocaleString() : 'Cargando...'),
            },
            {
              header: 'Updated At',
              accessor: 'updatedAt' as keyof Detail,
              render: (row: Detail) => (isClient ? new Date(row.updatedAt).toLocaleString() : 'Cargando...'),
            },
            {
              header: 'Acciones',
              render: (row: Detail) => (
                <div className={styles.buttonGroup}>
                  <CustomButton
                    label="Aceptar"
                    variant="primary"
                    size="small"
                    onClick={() => handleAction(row.counter, row.detalleId, row.userId, 'APPROVED')}
                  />
                  <CustomButton
                    label="Rechazar"
                    variant="danger"
                    size="small"
                    onClick={() => handleAction(row.counter, row.detalleId, row.userId, 'REJECTED')}
                  />
                  <button
                    onClick={() => handleViewHistory(row.userId)}
                    className={styles.iconButton}
                    title="Ver historial"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      className="bi bi-search"
                      viewBox="0 0 16 16"
                    >
                      <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398l3.85 3.85a1 1 0 0 0 1.415-1.415l-3.85-3.85zm-5.44 1.415a5.5 5.5 0 1 1 0-11 5.5 5.5 0 0 1 0 11z" />
                    </svg>
                  </button>
                </div>
              ),
            },
          ]}
          rowsPerPage={5}
        />
      </div>
    </div>
  );
};

export default AdminView;
