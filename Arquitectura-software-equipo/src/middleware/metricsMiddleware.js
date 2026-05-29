const client = require('prom-client');

// 1. Crear un Registry global
const register = new client.Registry();

// 2. Encender las métricas por defecto (CPU, RAM de Node.js)
// Le agregamos un prefijo para identificar de dónde vienen los datos
client.collectDefaultMetrics({
  app: 'api-turismo', // Nombre de nuestra app para identificarla en Prometheus
  prefix: 'node_', // Agrega un prefijo a las métricas por defecto (ej: node_process_cpu_user_seconds_total)
  timeout: 5000, // Frecuencia de recolección de métricas por defecto (5 segundos)
  register
});

// 3. Crear un Histograma para medir TIEMPOS DE RESPUESTA (ADR-001)
// histograma es una métrica que nos permite medir la distribución 
// de los tiempos de respuesta, no solo el promedio, sino también 
// percentiles (ej: 95% de las peticiones responden en menos de X segundos)
const httpRequestDurationMicroseconds = new client.Histogram({ 
  name: 'http_request_duration_seconds', // Nombre de la métrica (sin espacios, con guiones bajos)
  help: 'Duracion de las peticiones HTTP en segundos', // Descripción de la métrica
  labelNames: ['method', 'route', 'status_code'], // Etiquetas para segmentar los datos (método HTTP, ruta, código de estado)
  // Definimos las "cubetas" de tiempo: 0.1s, 0.5s, 1s, 2s (nuestro límite Must Have), y 5s
  buckets: [0.1, 0.5, 1, 2, 5], // Si pasa los dos segundo significa que el must have no se 
  // está cumpliendo, y lo queremos saber para mejorar la API
});

// 4. Crear un Contador para el TOTAL DE PETICIONES
const httpRequestsTotal = new client.Counter({ // Contador es una métrica que solo puede aumentar (ideal para contar eventos)
  name: 'http_requests_total',
  help: 'Total de peticiones HTTP recibidas',
  labelNames: ['method', 'route', 'status_code']
});

// Registrar nuestras métricas personalizadas
register.registerMetric(httpRequestDurationMicroseconds);
register.registerMetric(httpRequestsTotal);

// Middleware que intercepta la petición para medirla y luego dejarla pasar a la ruta correspondiente
const metricsMiddleware = (req, res, next) => {
  // Ignoramos la propia ruta /metrics para no ensuciar los datos
  if (req.url === '/metrics') {
    return next();
  }

  // Iniciamos el cronómetro interno
  const endTimer = httpRequestDurationMicroseconds.startTimer();

  // Interceptamos el evento 'finish' (cuando la API ya envió la respuesta al usuario)
  res.on('finish', () => {
    // Al finalizar, detenemos el cronómetro y anotamos las etiquetas
    endTimer({
      method: req.method,
      route: req.baseUrl || req.path,
      status_code: res.statusCode
    });

    // Sumamos +1 al contador de peticiones totales
    httpRequestsTotal.inc({
      method: req.method,
      route: req.baseUrl || req.path,
      status_code: res.statusCode
    });
  });

  next();
};

module.exports = {
  register,
  metricsMiddleware
};