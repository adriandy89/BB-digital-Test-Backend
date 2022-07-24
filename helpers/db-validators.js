const { Usuario, Categoria, Producto, Venta } = require('../models');

const emailExiste = async (correo = '') => {

    // Verificar si el correo existe
    const existeEmail = await Usuario.findOne({ correo });
    if (existeEmail) {
        throw new Error(`El correo: ${correo}, ya está registrado`);
    }
}

const existeUsuarioPorId = async (id) => {

    // Verificar si el correo existe
    const existeUsuario = await Usuario.findById(id);
    if (!existeUsuario) {
        throw new Error(`El id no existe ${id}`);
    }
}

/**
 * Categorias
 */
const existeCategoriaPorId = async (id) => {

    // Verificar si el correo existe
    const existeCategoria = await Categoria.findById(id);
    if (!existeCategoria) {
        throw new Error(`El id no existe ${id}`);
    }
}

/**
 * Productos
 */
const existeProductoPorId = async (id) => {

    // Verificar si el correo existe
    const existeProducto = await Producto.findById(id);
    if (!existeProducto) {
        throw new Error(`El id no existe ${id}`);
    }
}

const existeProductoEnStock = async (id) => {

    // Verificar si el correo existe
    const existeProducto = await Producto.findById(id);
    if (!existeProducto) {
        throw new Error(`El id no existe ${id}`);
    }

    if (existeProducto.stock <= 0) {
        throw new Error(`No hay productos en stock`);
    }
}

/**
 * Ventas
 */
const existeVentaPorId = async (id) => {

    // Verificar si el correo existe
    const existeVenta = await Venta.findById(id);
    if (!existeVenta) {
        throw new Error(`El id no existe ${id}`);
    }
}


module.exports = {
    emailExiste,
    existeUsuarioPorId,
    existeCategoriaPorId,
    existeProductoPorId,
    existeVentaPorId,
    existeProductoEnStock
}

