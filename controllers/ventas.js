const { response } = require('express');
const { Venta, Producto } = require('../models');


const crearVenta = async (req, res = response) => {

    const { ...body } = req.body;

    // Generar la data a guardar
    const data = {
        ...body
    }

    if (data.cantidad > 1) {
        return res.status(400).json({
            msg: `Solo se puede comprar 1 producto por venta`
        });
    }

    const venta = new Venta(data);

    const producto = await Producto.findById(data.producto)

    // Guardar DB
    await venta.save();
    await Promise.all([
        venta.save(),
        Producto.findByIdAndUpdate(data.producto, { stock: (producto.stock - 1) }, { new: true })
    ]);

    res.status(201).json(venta);
}

const obtenerVentas = async (req, res = response) => {

    try {
        const {
            limite = 10,
            desde = 0,
            ...data
        } = req.query;

        const query = { ...data };

        const [total, venta] = await Promise.all([
            Venta.countDocuments(query),
            Venta.find(query)
                .populate('producto', 'nombre')
                .populate('usuario', 'correo')
                .skip(Number(desde))
                .limit(Number(limite))
        ]);

        res.json({
            total,
            venta
        });

    } catch (error) {
        res.status(400).json({
            msg: `Parámetros Incorrectos`
        });
    }
}

const obtenerListaProductos = async (req, res = response) => {

    try {
        const {
            limite = 10,
            desde = 0,
        } = req.query;

        const query = {};

        const [total, venta] = await Promise.all([
            Venta.countDocuments(query),
            Venta.find(query)
                .populate('producto')
                .populate('usuario', 'correo')
                .skip(Number(desde))
                .limit(Number(limite))
        ]);

        res.json({
            total,
            venta
        });

    } catch (error) {
        res.status(400).json({
            msg: `Parámetros Incorrectos`
        });
    }
}

const obtenerGananciaTotal = async (req, res = response) => {

    try {

        const query = {};

        const ventas = await Venta.find(query).select({ monto: 1, _id: 0 });
        
        let total = 0;

        ventas.forEach(venta => {
            total+= venta.monto;
        });

        res.json({
            total
        });

    } catch (error) {
        res.status(400).json({
            msg: `Parámetros Incorrectos`
        });
    }
}

const obtenerVenta = async (req, res = response) => {

    const { id } = req.params;
    const venta = await Venta.findById(id)
        .populate('producto', 'nombre')
        .populate('usuario', 'correo')

    res.json(venta);

}

const actualizarVenta = async (req, res = response) => {

    const { id } = req.params;
    const { ...data } = req.body;

    const venta = await Venta.findByIdAndUpdate(id, data, { new: true });

    res.json(venta);

}

const borrarVenta = async (req, res = response) => {

    const { id } = req.params;
    const ventaBorrado = await Venta.findByIdAndRemove(id);

    res.json(ventaBorrado);
}

module.exports = {
    crearVenta,
    obtenerVentas,
    obtenerVenta,
    actualizarVenta,
    borrarVenta,
    obtenerListaProductos,
    obtenerGananciaTotal
}