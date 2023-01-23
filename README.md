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

5. Clonar el archivo __.env.template__ y renombrarlo a __.env__.

6. Llenar las variables de entorno definidar en el __.env__.

7. Levantar el servidor en dev.

```bash
npm run start:dev
```

8. Reconstruir la base de datos con la semilla.

```bash
http://localhost:3000/api/seed
```


9. Probar la API.

```bash
http://localhost:3000/api
```

## Stack usado

* MongoDB
* Mongoose
* NestJS
* Docker Compose