import { Router } from 'express';
import ProductManager from '../Manager/ProductManager.js';

const router = Router();
const productManager = new ProductManager('./src/data/products.json');


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

router.get('/products/:id', async (req, res) => {
  try {
   const product = await productManager.Buscarproducto(parseInt(req.params.id));
    res.json(product);
  } catch (error) {
    res.status(404).json({ error: 'Bro, no encontre ese producto, estas seguro que lo agregaste?🤔' });
  }
});

router.post('/products', async (req, res) => {
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



router.put('/:pid', async (req, res) => {
    try {
        const id = Number(req.params.pid);

        if (isNaN(id)) {
            return res.status(400).json({ error: 'El ID debe ser un número' });
        }

        console.log('[API] Intentando actualizar producto ID:', id);

        const actualizado = await productManager.Actualizarproducto(id, req.body);

        res.json({
            success: true,
            product: actualizado
        });

    } catch (error) {
        console.error('[API ERROR]', error);
        res.status(404).json({
            error: error.message,
            existingIds: (await productManager.listarproductos()).map(p => p.id)
        });
    }
});


router.delete('/:pid', async (req, res) => {
    try {
        const id = Number(req.params.pid);

        if (isNaN(id)) {
            return res.status(400).json({ error: 'El ID debe ser un número' });
        }

        const productoEliminado = await productManager.Borrarproducto(id);

        res.json({
            success: true,
            message: 'Producto eliminado correctamente',
            deletedProduct: productoEliminado
        });

    } catch (error) {
        console.error('[DELETE ERROR]', error);

        if (error.message.includes('no existe')) {
            res.status(404).json({ 
                error: error.message,
                suggestion: 'Verifica los IDs disponibles con GET /api/products'
            });
        } else {
            res.status(500).json({ 
                error: 'Error al eliminar el producto',
                details: error.message
            });
        }
    }
});



export default router;