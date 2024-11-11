import axiosInstance from './axios-config'; // Usar la instancia configurada

export interface CreateUserDto {
  name: string;
  userId: string;
  password: string;
}

export interface LoginDto {
  userId: string;
  password: string;
}

export interface CreateClienteDto {
  dni: string;
  nombre: string;
  apellidos: string;
  correo: string;
}

export interface CreateClientesBatchDto {
  userId: string;
  clientes: CreateClienteDto[];
}

export interface DetalleRequestDto {
  id: string;
}

// Servicio para registrar un usuario
export const registerUser = async (userData: CreateUserDto) => {
  const response = await axiosInstance.post(`/register`, userData);
  return response.data;
};

// Servicio para iniciar sesión
export const loginUser = async (loginData: LoginDto) => {
  const response = await axiosInstance.post(`/login`, loginData);
  return response.data;
};

// Servicio para registrar clientes en batch
export const registerClientesBatch = async (clientesData: CreateClientesBatchDto) => {
  const response = await axiosInstance.post(`/customers`, clientesData);
  return response.data;
};

// Servicio para aceptar un detalle
export const acceptDetalle = async (detalle: DetalleRequestDto) => {
  const response = await axiosInstance.put(`/detalle/aceptar`, detalle);
  return response.data;
};

// Servicio para rechazar un detalle
export const rejectDetalle = async (detalle: DetalleRequestDto) => {
  const response = await axiosInstance.put(`/detalle/rechazar`, detalle);
  return response.data;
};

// Servicio para reintentar un detalle
export const retryDetalle = async (detalle: DetalleRequestDto) => {
  const response = await axiosInstance.put(`/detalle/reintentar`, detalle);
  return response.data;
};

// Servicio para obtener un detalle por ID
export const getUserDetalleById = async (id: string) => {
  const response = await axiosInstance.get(`/detalle/${id}`);
  return response.data;
};

// Servicio para obtener todos los detalles
export const getAllDetalles = async () => {
  const response = await axiosInstance.get(`/detalle`);
  return response.data;
};

// Servicio para obtener las medallas de un usuario
export const getUserMedals = async (id: string) => {
  const response = await axiosInstance.get(`/medals/${id}`);
  return response.data;
};
