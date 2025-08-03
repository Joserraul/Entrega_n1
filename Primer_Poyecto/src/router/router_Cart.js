import { Router } from 'express';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const products = await productManager.listarproductos();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const newProduct = await productManager.agregarproducto(req.body);
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/pid', async (req, res) => {
  try {
   const product = await productManager.Buscarproducto(parseInt(req.params.id));
    res.json(product);
  } catch (error) {
    res.status(404).json({ error: 'Bro, no encontre ese producto, estas seguro que lo agregaste?🤔' });
  }
});

router.post('/pid', async (req, res) => {
  try {
    console.log('Body recibido:', req.body);

    const { title, description, price, thumbnail, code, stock } = req.body;

    if (!title || !description || !price || !code) {
      return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }

    const newProduct = {
      title,
      description,
      price,
      thumbnail: thumbnail || '',
      code,
      stock: stock || 0
    };

    await productManager.agregarproducto(newProduct);
    res.status(201).json(newProduct);
  } catch (error) {
    console.error('Error en POST /products:', error);
    res.status(500).json({
      error: 'Error al agregar el producto',
      details: error.message
    });
  }
});




export default router;