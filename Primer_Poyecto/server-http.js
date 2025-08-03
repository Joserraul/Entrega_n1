import { createServer } from 'http';
import express from 'express';
import routerProductManager from './src/router/router_ProductManager.js';

const server = createServer((req, res) => {
  if  (req.url === './api/products' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Bienvenido a mi servidor HTTP! 🌟');
  }
  res.end("Ruta no encontrada 😅");
});

server.listen(3000, () => { console.log('Servidor HTTP corriendo en el puerto 3000'); });

