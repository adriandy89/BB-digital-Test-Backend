# Rest API Server - Nodejs

- Ejecutar ```npm install``` para reconstruir los módulos de Node.


- Ejecutar ```node app.js``` para correr el server.


- Los endpoint en postman se encuentran el archivo exportado: 'node-api-test.postman_collection.json'


- La configuración se encuentra en el archivo: '.env' , puede configurar la autenticación con google, 'http://localhost:8080/'


- Usuario con rol administrador registrado en la Base de Datos MongoDB en la nuve:

```
    {{url}}/auth/login
        {
            "correo":"bb.digital.chile@gmail.com",
            "password":"mipassword123"
        }
```

- Obtenga el token cuando se loguee y úselo para acceder a las rutas protegidas.
