<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

# Ejecutar el proyecto en desarrollo

1. Clonar el repositorio.
2. Ejecutar.

```bash
npm install
```

3. Tener Nest CLI instalado.

```bash
npm i -g @nestjs/cli
```

4. Levantar la base de datos.

```bash
docker-compose up -d
```

5. Reconstruir la base de datos con la semilla.

```bash
http://localhost:3000/api/seed
```


6. Levantar el servidor.

```bash
npm run start:dev
```

7. Probar el API.

```bash
http://localhost:3000/api
```

## Stack usado

* MongoDB
* Mongoose
* NestJS
* Docker Compose
