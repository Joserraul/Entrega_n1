import { Router } from 'express';
import fs from 'fs/promises';
import path from 'path';
import ProductManager from '../Products/ProductManager.js'


class CartManager {
  constructor(filepath, productManager) {
    this.path = path.resolve(filepath);
    this.carts = [];
    this.productManager = productManager;
    this.iniciar();
  }

  async iniciar() {
    try {
      const data = await fs.readFile(this.path, 'utf-8');
      this.carts = JSON.parse(data || '[]');
    } catch (error) {
      if (error.code === 'ENOENT') {
        this.carts = [];
        await this.guardado();
      } else {
        throw error;
      }
    }
  }

  async guardado() {
    await fs.writeFile(this.path, JSON.stringify(this.carts, null, 2));
  }

  async agregarProducto(cid, pid) {
    try {
      const producto = await this.productManager.Buscarproducto(pid);

      if (producto.stock <= 0) {
        throw new Error(`Bro, no hay stock ${pid}😅`);
      }

      const cartIndex = this.carts.findIndex(c => c.id === cid);
      if (cartIndex === -1) {
        throw new Error(`Bro, no existe el carrito con id ${cid} 😅`);
      }

      const productIndex = this.carts[cartIndex].products.findIndex(p => p.id === pid);

      if (productIndex !== -1) {
        const nuevaCantidad = this.carts[cartIndex].products[productIndex].quantity + 1;
        if (producto.stock < nuevaCantidad) {
          throw new Error(`Bro, no hay suficiente stock para el producto ${pid} 😅`);
        }
        this.carts[cartIndex].products[productIndex].quantity += 1;
      } else {
        this.carts[cartIndex].products.push({ id: pid, quantity: 1 });
      }

      await this.guardado();
      return this.carts[cartIndex];
    } catch (error) {
      console.error('Error al agregar producto al carrito:', error);
      throw error;
    }
  }

  async compraRealizada(cid) {
    try {
      const cartIndex = this.carts.findIndex(c => c.id === cid);
      if (cartIndex === -1) {
        throw new Error(`Bro, no existe el carrito con id ${cid} 😅`);
      }

      const cart = this.carts[cartIndex];

      for (const item of cart.products) {
        const producto = await this.productManager.Buscarproducto(item.id);
        if (producto.stock < item.quantity) {
          throw new Error(`Bro, no hay suficiente stock para el producto ${item.id} 😅`);
        }
        await this.productManager.Actualizarproducto(item.id, { 
          stock: producto.stock - item.quantity 
        });
      }

      this.carts[cartIndex].products = [];
      await this.guardado();
      return { success: true, message: 'Compra realizada con éxito' };
    } catch (error) {
      console.error('Error al realizar la compra:', error);
      throw error;
    }
  }
}

export default CartManager;