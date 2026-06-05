import http from 'k6/http';
import { sleep, check } from 'k6';

export const options = {
  vus: 1000,
  duration: '30s',
};

export default function () {
// token recibido al hacer login, debe ser un token válido para que el test funcione correctamente
  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibmFtZSI6Ikp1YW4iLCJlbWFpbCI6Imp1YW5AdGVzdC5jb20iLCJpYXQiOjE3ODA2OTkxMzUsImV4cCI6MTc4MDcwMjczNX0.JquwVAOXtdneR19xiTgV_eLRTmqMke6MeMRU3v62UrY'; 

  const params = {
    headers: { // Agregamos el token al header de autorización
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  };

  // Atacamos la ruta protegida que tiene el patrón Cache-Aside
  const res = http.get('http://localhost:3000/users', params);

  check(res, {
    'status es 200': (r) => r.status === 200,
  });

  sleep(1);
}