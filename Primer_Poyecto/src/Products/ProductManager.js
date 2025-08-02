import { Router } from 'express';
import path from 'path';
import fs from 'fs/promises';

class ProductManager {
  constructor(filepath) {
    this.path = path.resolve(filepath);
    this.products = [];
    this.iniciar();
  }

  async iniciar() {
    try {
      await fs.access(this.path);
      const data = await fs.readFile(this.path, 'utf-8');
      if (data.trim() === '') {
        this.products = [];
        await this.guardado();
      } else {
        this.products = JSON.parse(data);
      }
    } catch (error) {
      if (error.code === 'ENOENT') {
        this.products = [];
        await this.guardado();
      } else {
        console.error('Error al iniciar:', error);
        throw error;
      }
    }
  }

  async guardado() {
    try {
      await fs.mkdir(path.dirname(this.path), { recursive: true });
      await fs.writeFile(this.path, JSON.stringify(this.products, null, 2));
    } catch (error) {
      console.error('Error al guardar:', error);
      throw error;
    }
  }

  async agregarproducto(producto) {
    if (!producto.title || !producto.code) {
      throw new Error('Bro necesitamos el título y el código del producto 😅');
    }
    if (this.products.some(prod => prod.code === producto.code)) {
      throw new Error('Bro, el código del producto ya existe 😒');
    }

    const nuevoproducto = {
      id: this.products.length > 0 ? this.products[this.products.length - 1].id + 1 : 1,
      ...producto,
      timestamp: Date.now()
    };

    this.products.push(nuevoproducto);
    await this.guardado();
    return nuevoproducto;
  }

  async listarproductos(){
    return this.products;
  }

  async Buscarproducto(id) {
    const producto = this.products.find(prod => prod.id === id);
    if (!producto) throw new Error('crack... ese producto no lo encontre🤔');
    return producto;
  }

  async Actualizarproducto(id, Actualizarproducto) {
    const index = this.products.findIndex(prod => prod.id === id);
    if (index === -1) throw new Error('crack... no puedo actualizar lo que no esta😐');
    this.products[index] = { ...this.products[index], ...Actualizarproducto, timestamp: new Date().toISOString() };
    await this.guardado();
    return this.products[index];
  }

  async Borrarproducto(id) {
    const index = this.products.findIndex(prod => prod.id === id);
    if (index === -1) throw new Error('crack... no puedo borrar lo que no existe😒');

    const exterminador = this.products.splice(index, 1);
    await this.guardado();
    return exterminador[0];
  }
}


export default ProductManager;