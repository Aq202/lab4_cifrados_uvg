# Laboratorio 4

Diego Andrés Morales Aquino - 21762<br>
Pablo Andrés Zamora Vásquez - 21780<br>

## Parte 1

### 📜 Descripción

El laboratorio consistió en el desarrollo de una aplicación que permitiera a los usuarios registrarse y autenticar sus credenciales de forma segura utilizando JWT. Los usuarios debían ser capaces de firmar archivos digitalmente con ECC o RSA, proteger su integridad mediante SHA-256 y acceder a los archivos cifrados con su llave privada. La aplicación incluía un frontend para el registro, login, y gestión de archivos, mientras que el backend gestionaba la autenticación, la firma de archivos y su verificación, garantizando la seguridad en todo el proceso mediante cifrado y hashing.

### 🚀 Instalación y Ejecución

1. Clona este repositorio e instala las dependencias:

    ```bash
    git clone https://github.com/Aq202/lab4_cifrados_uvg
    cd lab4_cifrados_uvg
    ```

2. Instalación de dependencias de backend (terminal 1):

    ```bash
    npm install
    ```
3. Ejecución de servidor (terminal 1):
    ```bash
    npm run start
    ```

4. Instalación de dependencias de frontend (terminal 2):

    ```bash
    cd frontend
    npm install
    ```

5. Ejecución de servidor de frontend (terminal 2):

    ```bash
    npm run dev
    ``` 

### 📜 Rutas

* **/user/register:** <br>
    Registar a un nuevo usuario.

    Método Post

    Parámetros del body: 

    - email: email del usuario a registrar
    - password: contraseña del usuario
    - algorithm: RSA o ECC. Algoritmo de la llave a generar.

* **/user/login:** <br>
    Login de usuarios.

    Método Post

    Parámetros del body: 

    - email: email del usuario a autenticar.
    - password: contraseña del usuario.

* **/key/generate:** <br>
    Generación de pares de llaves.

    Método Post

    Parámetros del body:

    - algorithm: Algoritmo a utilizar para generar las llaves privada y pública (RSA/ECC).

* **/file:** <br> 
    Obtener listado de archivos guardados:

    Método Get


* **/file/save:** <br> 
    Guardar un nuevo archivo y firmarlo (si corresponde).

    Método Post

    Parámetros del body: 

    - file: archivo a guardar.
    - privateKey: llave privada del usuario.
    - fileName: Nombre original del archivo que se quiere subir.
    - includeHash: Valor bool que indica si el archivo debe ser firmado o no.


* **/file/:id** <br> 
    Descargar archivo previamente subido. Se encarga de obtener, descifrar y retornar un archivo.

    Método Get

    Parámetros de la ruta:

    - id: Id del archivo a descargar.


* **/file/verify:** <br> 
    Verificar la firma digital de un archivo

    Método Post

    Parámetros del body: 

   - file: archivo a verificar.
    - fileName: Nombre original del archivo que se quiere subir.
    - userId: id del usuario dueño del archivo.

