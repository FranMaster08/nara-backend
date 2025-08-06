<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

# NARA Backend

NARA es una API para la gestión logística de entrega de productos, permitiendo trazabilidad, eficiencia y control total del proceso. Este backend está desarrollado con NestJS y TypeORM, usando PostgreSQL como base de datos.

## 🚀 ¿Cómo levantar el proyecto?

### En local

1. Clona el repositorio:
   ```bash
   git clone https://github.com/tu-usuario/nara-backend.git
   cd nara-backend
   ```
2. Instala dependencias:
   ```bash
   npm install
   ```
3. Configura las variables de entorno en un archivo `.env`:
   ```
   DB_HOST=localhost
   DB_PORT=5432
   DB_USER=tu_usuario
   DB_PASS=tu_contraseña
   DB_NAME=nara_db
   ```
4. Ejecuta migraciones (opcional si usas synchronize):
   ```bash
   npm run migration:run
   ```
5. Levanta el servidor:
   ```bash
   npm run start:dev
   ```
6. Accede a la documentación Swagger en [http://localhost:3000/api-docs](http://localhost:3000/api-docs)

### En Docker

1. Asegúrate de tener Docker instalado.
2. Crea un archivo `.env` con las variables de entorno necesarias.
3. Construye la imagen y levanta el contenedor:
   ```bash
   docker build -t nara-backend .
   docker run --env-file .env -p 3000:3000 nara-backend
   ```
4. Accede a la API y documentación en [http://localhost:3000/api-docs](http://localhost:3000/api-docs)

## 📦 Tecnologías y librerías usadas

| Tecnología/Librería         | Descripción                                  | Emoticono |
|----------------------------|-----------------------------------------------|:---------:|
| NestJS                     | Framework principal backend                   | 🛡️        |
| TypeORM                    | ORM para base de datos                        | 🗄️        |
| PostgreSQL                 | Base de datos relacional                      | 🐘        |
| Swagger                    | Documentación interactiva de la API           | 📚        |
| class-validator            | Validación de DTOs                            | ✔️        |
| class-transformer          | Transformación de objetos                     | 🔄        |
| Docker                     | Contenerización y despliegue                  | 🐳        |
| Jest                       | Testing unitario                              | 🧪        |
| Husky                      | Git hooks para calidad                        | 🦮        |
| ESLint + Prettier          | Linting y formateo de código                  | 🧹        |

## 📖 Endpoints principales

- `POST /user` - Crear usuario
- `GET /user` - Listar usuarios
- `GET /user/:id` - Obtener usuario por ID
- `PATCH /user/:id` - Actualizar usuario
- `DELETE /user/:id` - Eliminar usuario

## 📝 Notas

- La configuración de la base de datos se realiza vía variables de entorno.
- El proyecto usa migraciones para mantener el esquema actualizado.
- La documentación Swagger está disponible en `/api-docs`.

## 👨‍💻 Autor

- Fran

## 📄 Licencia

MIT
