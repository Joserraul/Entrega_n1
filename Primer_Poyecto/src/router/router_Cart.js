import { Router } from 'express';
import{CartManager} from '../Cart/Cart_Manager.js'
import ProductManager from '../Products/ProductManager.js';

const router = Router();
const productManager = new ProductManager('./src/data/products.json');
const cartManager = new CartManager('./src/data/carts.json', productManager);

router.post('/', async (req, res) => {
  try {
    const newCart = await cartManager.crearCarrito();
    res.status(201).json(newCart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:cid', async (req, res) => {
  try {
    const cid = Number(req.params.cid);
    const cart = await cartManager.obtenerCarrito(cid);
    const productDetails = await Promise.all(
      cart.products.map(async item => {

        try {
          const product = await productManager.Buscarproducto(item.id);
          return {
            ...item,
            product: {
              title: product.title,
              description: product.description,
              price: product.price,
              thumbnail: product.thumbnail
            }
          };
        } catch (error) {
          return { ...item, error: `Producto con ID ${item.id} no encontrado` };
        }
      })
    );
    res.json({ ...cart, products: productDetails });
  } catch (error) {
    res.status(404).json({ error: `Carrito con ID ${req.params.cid} no encontrado` });
  }
});

router.post('/:cid/products/:pid', async (req, res) => {
  try {
    const cid = Number(req.params.cid);
    const pid = Number(req.params.pid);

    const updatedCart = await cartManager.agregarProductoAlCarrito(cid, pid);
    res.json({
      success: true,
      message: `Producto  ${pid} agregado al carrito con ID ${cid}`,
      cart: updatedCart
    });
  } catch (error) {
    if (error.message.includes('no hay disponible')) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(404).json({ error: error.message });
  }
}
});

router.post('/:cid/checkout', async (req, res) => {
  try {
    const cid = Number(req.params.cid);
    const purchaseResult = await cartManager.compraRealizada(cid);
    res.json(resultado)
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});



export default router;