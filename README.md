# Tarea - Servidor HTTP + Arquitectura MVC 

🐾 Veterinaria "Patitas Felices"
# Trabajo Práctico - Backend con Arquitectura MVC

Este proyecto es un servidor Backend desarrollado con **Node.js**, **Express** y **TypeScript** para la gestión basica de una clínica veterinaria. Implementa autenticación segura, roles de usuario con diferentes posibilidades de consulta sobre los datos y una conexión a base de datos **MongoDB Atlas**.

## 📋 Características Principales

* **Arquitectura MVC:** Código organizado en Modelos, Vistas (Rutas) y Controladores.
* **Autenticación JWT:** Login seguro con *JSON Web Tokens* y hashing de contraseñas con `bcrypt`.
* **Roles de Usuario:**
    * `ADMIN` / `VETERINARIO`: Acceso total (crear mascotas, historias clínicas).
    * `DUENIO`: Acceso restringido (solo visualiza y edita sus propias mascotas).
* **CRUD Completo:** Gestión de mascotas con validación de propiedad.
* **Historial Médico:** Registro de consultas y tratamientos vinculado a pacientes y veterinarios.
* **Seguridad:** Protección de rutas mediante Middlewares y validaciones con `express-validator`.

## 🛠️ Tecnologías Utilizadas

* **Entorno:** Node.js
* **Lenguaje:** TypeScript
* **Framework:** Express.js
* **Base de Datos:** MongoDB (Mongoose ODM)
* **Seguridad:** Bcrypt, JWT, CORS.

## 🚀 Instrucciones de Instalación


### 1. Clonar el repositorio
Abrir el bash y ejecutar los siguientes comandos

- git clone https://github.com/Sofiailin/tp-intermedio-sofia-fraga

- cd tp-intermedio-sofia-fraga

2. Instalar dependencias en el bash

- npm i

3. Configurar Variables de Entorno

- Renombra el archivo .env.example a .env.

- Completa las variables con tu conexión a MongoDB y una clave secreta.

PORT=3000
MONGODB_URI=mongodb+srv://<usuario>:<password>@cluster.mongodb.net/veterinaria
JWT_SECRET=palabra_secreta_segura
JWT_EXPIRES_IN=7d


4. Ejecutar el servidor
Para iniciar en modo desarrollo (con recarga automática) en el bash: 

- npm run dev

El servidor iniciará en: http://localhost:3000


🗂️ Estructura de la Base de Datos (MongoDB)

El sistema utiliza una base de datos NoSQL con las siguientes colecciones principales:
Users: Almacena tanto a Dueños como Veterinarios, diferenciados por el campo role.
Pets: Información de las mascotas, vinculadas a un Dueño (duenioId).
HistorialMs: Registro de consultas médicas, vinculadas a una Mascota y al Veterinario que la atendió.

🧪 Curls utilizados en la base de datos 

*Creacion de Veterinaria 

curl -X POST http://localhost:3000/api/auth/register -H "Content-Type: application/json" -d '{"username": "DraSofi", "email": "sofi@vet.com", "password": "1234vet", "role": "veterinario"}'

RESPUESTA
{"message":"Usuario creado exitosamente"}

*Creacion de Duenio 

curl -X POST http://localhost:3000/api/auth/register -H "Content-Type: application/json" -d '{"username": "JuanPerez", "email": "juan@gmail.com", "password": "1234juan", "role": "duenio"}'

RESPUESTA
{"message":"Usuario creado exitosamente"}

*Creacion de Administrador 

curl -X POST http://localhost:3000/api/auth/register -H "Content-Type: application/json" -d '{"username": "SuperAdmin", "email": "admin@sistema.com", "password": "123super", "role": "admin"}'

RESPUESTA
{"message":"Usuario creado exitosamente"}


* Pedido de Loggin

curl -X POST http://localhost:3000/api/auth/login -H "Content-Type: application/json" -d '{"email": "sofi@vet.com", "password": "1234vet"}'

RESPUESTA
{"token":"token"}

* Cargar datos de mascota con el token de usuario habilitado

curl -X POST http://localhost:3000/api/pets -H "Content-Type: application/json" -H "Authorization: Bearer <TOKEN> -d '{"nombre": "Firulais", "especie": "Perro", "edad": 5, "duenioId": "698266487f44f60a372a6c53"}'

RESPUESTA
{"message":"Mascota creada","id":"698268167f44f60a372a6c5a"}

* Pedido de Loggin
curl -X POST http://localhost:3000/api/auth/login -H "Content-Type: application/json" -d '{"email": "juan@gmail.com", "password": "1234juan"}'

RESPUESTA
{"token":"token"}

*Intento de carga de datos con duenio a datos no accesibles
curl -X GET http://localhost:3000/api/pets -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5ODI2NmFkN2Y0NGY2MGEzNzJhNmM1NSIsInVzZXJuYW1lIjoiSnVhblBlcmV6Iiwicm9sZSI6ImR1ZW5pbyIsImlhdCI6MTc3MDE2NDE5MywiZXhwIjoxNzcwMjUwNTkzfQ.9JVefKymLarC6AG0CFpcqRfS8TTBI0HKVHHz2kV_0X0"

RESPUESTA
[]


*Intento de carga de datos con Veterinario a datos accesibles
curl -X POST http://localhost:3000/api/historialm -H "Content-Type: application/json" -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5ODI2NjQ4N2Y0NGY2MGEzNzJhNmM1MyIsInVzZXJuYW1lIjoiRHJhU29maSIsInJvbGUiOiJ2ZXRlcmluYXJpbyIsImlhdCI6MTc3MDE1Mzk2MCwiZXhwIjoxNzcwMjQwMzYwfQ.X0R4wlDAr36vIX50QfzR4BZ5n2kgXqc0ohbWsk__6R4" -d '{"petId": "698268167f44f60a372a6c5a", "descripcion": "Chequeo general y vacunas anuales", "diagnostico": "Paciente sano, peso ideal", "tratamiento": "Se aplica vacuna sextuple. Próxima visita en 1 año."}'

RESPUESTA
{"mascota":"698268167f44f60a372a6c5a","veterinario":"698266487f44f60a372a6c53","descripcion":"Chequeo general y vacunas anuales","diagnostico":"Paciente sano, peso ideal","tratamiento":"Se aplica vacuna sextuple. Pr�xima visita en 1 a�o.","_id":"6982911f6ad8ba3358b41f97","fecha":"2026-02-04T00:21:51.355Z","__v":0}

* Consulta de datos con usuario dueno
curl -X GET http://localhost:3000/api/pets -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5ODI2NmFkN2Y0NGY2MGEzNzJhNmM1NSIsInVzZXJuYW1lIjoiSnVhblBlcmV6Iiwicm9sZSI6ImR1ZW5pbyIsImlhdCI6MTc3MDE2NDE5MywiZXhwIjoxNzcwMjUwNTkzfQ.9JVefKymLarC6AG0CFpcqRfS8TTBI0HKVHHz2kV_0X0"

RESPUESTA []

*Consulta con usuario Veterinaria 

curl -X GET http://localhost:3000/api/pets -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5ODI2NjQ4N2Y0NGY2MGEzNzJhNmM1MyIsInVzZXJuYW1lIjoiRHJhU29maSIsInJvbGUiOiJ2ZXRlcmluYXJpbyIsImlhdCI6MTc3MDE2MzcwNCwiZXhwIjoxNzcwMjUwMTA0fQ.Sq9Dk7X2YdIidfbv92eLrnQGif5UWBw7sdUAYqYx9Lc"

RESPUESTA [{"_id":"698268167f44f60a372a6c5a","nombre":"Firulais","especie":"Perro","edad":5,"duenio":{"_id":"698266487f44f60a372a6c53","username":"DraSofi","email":"sofi@vet.com"},"createdAt":"2026-02-03T21:26:46.911Z","updatedAt":"2026-02-03T21:26:46.911Z","__v":0},{"_id":"69828e4f6ad8ba3358b41f8f","nombre":"Firulais","especie":"Perro","edad":5,"duenio":{"_id":"698266487f44f60a372a6c53","username":"DraSofi","email":"sofi@vet.com"},"createdAt":"2026-02-04T00:09:51.744Z","updatedAt":"2026-02-04T00:09:51.744Z","__v":0}]

Alumno: Sofia Fraga