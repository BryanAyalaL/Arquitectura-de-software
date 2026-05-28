# Proparlo localmente 

Abre tu terminal en la raíz de tu proyecto y ejecuta estos comandos para verificar que tu configuración funciona.

Construir la imagen:

```bash
docker build -t app-turismo:1.0.0 .
```

(Este comando leerá tu Dockerfile y ejecutará la construcción en dos etapas. Notarás que al final descarta los archivos temporales).

2. Ejecutar el contenedor

```bash
docker run -p 3000:3000 --name api-turismo -d app-turismo:1.0.0
```
(Este comando levanta tu servidor. El -p 3000:3000 conecta el puerto 3000 de tu PC con el 3000 del contenedor).

Verificar que funciona:
Abre tu navegador o Postman en http://localhost:3000. Deberías ver: API funcionando 🚀

4.Detener y limpiar

```bash
docker stop api-turismo
docker rm api-turismo
```