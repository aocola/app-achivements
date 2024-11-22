import { CreateClientesBatchDto } from '@/services/userService';
import Papa from 'papaparse';

export const processCSVByIndex = (file: File, userId: string): Promise<CreateClientesBatchDto> => {
  return new Promise((resolve, reject) => {
    Papa.parse<string[]>(file, {
      header: false,
      skipEmptyLines: true,
      complete: (results) => {
        const [, ...rows] = results.data;

        // Map and validate rows
        const clientes = rows
          .map((row) => ({
            dni: row[0]?.trim() || '',
            nombre: row[1]?.trim() || '',
            apellidos: row[2]?.trim() || '',
            correo: row[3]?.trim() || '',
          }))
          .filter(
            (cliente) =>
              cliente.dni &&
              cliente.nombre &&
              cliente.apellidos &&
              cliente.correo
          );

          let warning: string | undefined;
          if (clientes.length === 0) {
            warning = 'El archivo no contiene clientes válidos. Por favor, revise el contenido.';
          }

        const payload: CreateClientesBatchDto = {
          userId,
          clientes,
          warning
        };

        resolve(payload);
      },
      error: (error) => {
        reject(error);
      },
    });
  });
};
