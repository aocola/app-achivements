import { CreateClientesBatchDto } from '@/services/userService';
import Papa from 'papaparse';

interface Cliente {
  dni: string;
  nombre: string;
  apellido: string;
  correo: string;
}

interface Payload {
  userId: string;
  clientes: Cliente[];
}

export const processCSVByIndex = (file: File, userId: string): Promise<CreateClientesBatchDto> => {
    return new Promise((resolve, reject) => {
      Papa.parse<string[]>(file, {
        header: false,
        skipEmptyLines: true,
        complete: (results) => {
          const [headers, ...rows] = results.data;
  
          const clientes = rows.map((row) => ({
            dni: row[0] || '',
            nombre: row[1] || '',
            apellidos: row[2] || '', // Cambia 'apellido' por 'apellidos' aquí
            correo: row[3] || '',
          }));
  
          const payload: CreateClientesBatchDto = {
            userId,
            clientes,
          };
  
          resolve(payload);
        },
        error: (error) => {
          reject(error);
        },
      });
    });
  };
  
  
  