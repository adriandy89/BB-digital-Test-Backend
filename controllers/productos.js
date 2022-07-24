const { response } = require('express');
const { Producto } = require('../models');


const crearProducto = async (req, res = response) => {

    const { ...body } = req.body;

    const productoDB = await Producto.findOne({ sku: body.sku });

    if (productoDB) {
        return res.status(400).json({
            msg: `El producto ${productoDB.nombre}, ya existe`
        });
    }

    // Generar la data a guardar
    const data = {
        ...body,
        nombre: body.nombre.toUpperCase()
    }

    const producto = new Producto(data);

    // Guardar DB
    await producto.save();

    res.status(201).json(producto);

}

const obtenerProductos = async (req, res = response) => {

    try {
        const {
            limite = 10,
            desde = 0,
            ...data
        } = req.query;

        const query = { estado: true, ...data };

        const [total, productos] = await Promise.all([
            Producto.countDocuments(query),
            Producto.find(query)
                .populate('categoria', 'nombre')
                .skip(Number(desde))
                .limit(Number(limite))
        ]);

        res.json({
            total,
            productos
        });

    } catch (error) {
        res.status(400).json({
            msg: `Parámetros Incorrectos`
        });
    }
}

const obtenerProductosSinStock = async (req, res = response) => {

    try {
        const {
            limite = 10,
            desde = 0,
            ...data
        } = req.query;

        const query = { stock: 0 };

        const [total, productos] = await Promise.all([
            Producto.countDocuments(query),
            Producto.find(query)
                .populate('categoria', 'nombre')
                .skip(Number(desde))
                .limit(Number(limite))
        ]);

        res.json({
            total,
            productos
        });

    } catch (error) {
        res.status(400).json({
            msg: `Parámetros Incorrectos`
        });
    }
}

const obtenerCantidadProductoXCaracteristica = async (req, res = response) => {

    try {
        const { ...data } = req.query;

        const query = { estado: true, ...data };


        const total = await Producto.countDocuments(query);

        res.json({ total });

    } catch (error) {
        res.status(400).json({
            msg: `Parámetros Incorrectos`
        });
    }
}

const obtenerProducto = async (req, res = response) => {

    const { id } = req.params;
    const producto = await Producto.findById(id)
        .populate('categoria', 'nombre');

    res.json(producto);

}

const actualizarProducto = async (req, res = response) => {

    const { id } = req.params;
    const { ...data } = req.body;

    if (data.nombre) {
        data.nombre = data.nombre.toUpperCase();
    }

    const producto = await Producto.findByIdAndUpdate(id, data, { new: true });

    res.json(producto);

}

const borrarProducto = async (req, res = response) => {

    const { id } = req.params;
    const productoBorrado = await Producto.findByIdAndUpdate(id, { estado: false }, { new: true });

    res.json(productoBorrado);
}

module.exports = {
    crearProducto,
    obtenerProductos,
    obtenerProducto,
    obtenerCantidadProductoXCaracteristica,
    actualizarProducto,
    borrarProducto,
    obtenerProductosSinStock
}