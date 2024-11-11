# Gestor de Medallas por Clientes

## Descripción del Proyecto

Este proyecto es una aplicación web que permite gestionar medallas otorgadas a clientes en función de su actividad registrada. Está construido con **NestJS** para el backend y **Next.js** para el frontend.

### Roles Disponibles

1. **USER**: 
   - Puede registrarse desde la aplicación.
   - Subir un archivo CSV con datos de clientes.
   - Ver su progreso hacia la próxima medalla.
   - Consultar las medallas obtenidas.

2. **ADMIN**:
   - Puede gestionar los registros enviados por los usuarios.
   - Aprobar o rechazar detalles específicos.
   - Revisar el historial de registros por usuario.

### Usuarios de Prueba (ADMIN)

| Usuario  | Contraseña |
|----------|------------|
| 11111111 | admin      |
| 00000000 | admin      |
| 11111133 | sample     |

---

## Tecnologías Utilizadas

- **Backend**: NestJS
- **Frontend**: Next.js
- **Base de Datos**: MongoDB
- **Websockets**: Comunicación en tiempo real para notificaciones de progreso.
- **Otros**: Redux para manejo de estado, Socket.IO para notificaciones.

---

## Instalación

### 1. Clonar el repositorio

```bash
git clone <url_del_repositorio>
```

### 2. Instalar dependencias

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 3. Ejecutar la aplicación

```bash
# Backend
cd backend
npm run start:dev

# Frontend
cd ../frontend
npm run dev
```

El backend estará disponible en `http://localhost:4000` y el frontend en `http://localhost:3000`.

---

## Funcionalidades

### 1. Registro de Usuarios

Los usuarios pueden registrarse utilizando el siguiente endpoint:

**Endpoint**: `POST /users/register`

**Body**:

```json
{
  "name": "Joe",
  "userId": "11111134",
  "password": "Password@123"
}
```

**Respuesta**:

```json
{
  "status": true,
  "message": "Operación satisfactoria",
  "data": {
    "userId": "11111134",
    "name": "Joe",
    "role": "USER",
    "lastDayLogin": "2024-11-11T00:14:39.876Z",
    "isActive": true
  },
  "httpStatus": 201
}
```

### 2. Inicio de Sesión

**Endpoint**: `POST /users/login`

**Body**:

```json
{
  "userId": "11111134",
  "password": "Password@123"
}
```

**Respuesta**:

```json
{
  "status": true,
  "message": "Operación satisfactoria",
  "data": {
    "userId": "11111134",
    "name": "Joe",
    "role": "USER",
    "lastDayLogin": "2024-11-11T00:16:59.207Z",
    "isActive": true
  },
  "httpStatus": 202
}
```

### 3. Gestión de Detalles (ADMIN)

**Endpoint para Aprobar**: `PUT /users/detalle/aceptar`

**Body**:

```json
{
  "id": "e405e18a-0cde-407e-9c1f-4d901c15fe8e"
}
```

**Endpoint para Rechazar**: `PUT /users/detalle/rechazar`

---

## Flujo de Uso

### Usuario

1. **Registro**: El usuario se registra proporcionando su `userId`, `name` y `password`.
2. **Inicio de Sesión**: Después de iniciar sesión, el usuario puede subir un archivo CSV con datos de clientes.
3. **Ver Progreso**: Puede ver su progreso hacia la próxima medalla y las medallas obtenidas.

### Administrador

1. **Inicio de Sesión**: Accede con uno de los usuarios ADMIN preconfigurados.
2. **Gestión de Detalles**: Aprobar o rechazar los detalles enviados por los usuarios.
3. **Historial**: Revisar el historial de registros para cada usuario.

---

## Websockets

El sistema utiliza **WebSockets** para notificar en tiempo real a los usuarios sobre:

- **Progreso hacia la próxima medalla**.
- **Aprobación o rechazo de detalles**.

### Ejemplo de Evento

Cuando un ADMIN aprueba un detalle, se emite el evento:

```json
{
  "userId": "11111134",
  "detailId": "e405e18a-0cde-407e-9c1f-4d901c15fe8e",
  "counter": 5,
  "status": "APPROVED"
}
```

El usuario recibirá una notificación en tiempo real.

---

## Consideraciones

- **Validaciones**: Se aplican validaciones estrictas en el backend para garantizar la seguridad y consistencia de los datos.
- **Pruebas**: Se incluyen usuarios ADMIN para pruebas iniciales.
- **Escalabilidad**: El sistema está diseñado para manejar múltiples usuarios simultáneamente con soporte de WebSockets.

---

## Licencia

Este proyecto se encuentra bajo la licencia MIT.