import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: `${process.env.SERVER_HOST}/users`, // Ajusta la URL base
  timeout: 5000, // Tiempo máximo de espera
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;
