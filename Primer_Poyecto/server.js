import express from 'express';
import ProductManager from './src/Products/ProductManager.js';
import CarManager from './src/Car/CarManager.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/products', ProductManager);
app.use('/api/carts', CarManager);

app.listen(3000, () => console.log(`Aqui estamos corriendo en el puerto 3000`));

