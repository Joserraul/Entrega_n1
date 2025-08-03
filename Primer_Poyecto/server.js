import express from 'express';
import productRouter from './src/router/router_ProductManager.js';
import CartManager from './src/Cart/Cart_Manager.js';
import { fileURLToPath } from 'url';
import path from 'path';

const  __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/carts', CartManager);

app.use('/api/products', productRouter);

app.use((req, res) => {
  res.status(404).json({ error: 'Bro y la ruta? 😅' });
});


app.listen(8080, () => console.log(`Aqui estamos corriendo en el puerto 8080`));

