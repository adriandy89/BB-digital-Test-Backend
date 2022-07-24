const { response } = require('express');
const { ObjectId } = require('mongoose').Types;

const { Usuario, Categoria, Producto } = require('../models');

const coleccionesPermitidas = [
    'usuarios',
    'categorias',
    'productos',
    'roles'
];

const buscarUsuarios = async (termino = '', limite, desde, res = response) => {

    const esMongoID = ObjectId.isValid(termino); // TRUE 

    if (esMongoID) {
        const usuario = await Usuario.findById(termino);
        return res.json({
            results: (usuario) ? [usuario] : []
        });
    }

    const regex = new RegExp(termino, 'i');
    const usuarios = await Usuario.find({
        $or: [{ nombre: regex }, { correo: regex }],
        $and: [{ estado: true }]
    })
        .skip(Number(desde))
        .limit(Number(limite));

    res.json({
        results: usuarios
    });

}

const buscarCategorias = async (termino = '', limite, desde, res = response) => {

    const esMongoID = ObjectId.isValid(termino); // TRUE 

    if (esMongoID) {
        const categoria = await Categoria.findById(termino);
        return res.json({
            results: (categoria) ? [categoria] : []
        });
    }

    const regex = new RegExp(termino, 'i');
    const categorias = await Categoria.find({ nombre: regex, estado: true })
        .skip(Number(desde))
        .limit(Number(limite));

    res.json({
        results: categorias
    });

}

const buscarProductos = async (termino = '', limite, desde, res = response) => {

    const esMongoID = ObjectId.isValid(termino);

    if (esMongoID) {
        const producto = await Producto.findById(termino)
            .populate('categoria', 'nombre');
        return res.json({
            results: (producto) ? [producto] : []
        });
    }

    const regex = new RegExp(termino, 'i');
    const productos = await Producto.find({
        $or: [
            { sku: regex },
            { nombre: regex },
            { precio: regex },
            { stock: regex },
            { tags: regex },
            { valoracion: regex },
            { descripcion: regex },
            { informacion: regex },
            { categoria: regex },
        ],
        $and: [{ estado: true }]
    })
        .populate('categoria', 'nombre')
        .skip(Number(desde))
        .limit(Number(limite))

    res.json({
        results: productos
    });

}

const buscar = (req, res = response) => {

    const { coleccion, termino } = req.params;
    const { limite = 10, desde = 0 } = req.query;

    if (!coleccionesPermitidas.includes(coleccion)) {
        return res.status(400).json({
            msg: `Las colecciones permitidas son: ${coleccionesPermitidas}`
        })
    }

    switch (coleccion) {
        case 'usuarios':
            buscarUsuarios(termino, limite, desde, res);
            break;
        case 'categorias':
            buscarCategorias(termino, limite, desde, res);
            break;
        case 'productos':
            buscarProductos(termino, limite, desde, res);
            break;

        default:
            res.status(500).json({
                msg: 'Se le olvido hacer esta búsquda'
            })
    }

}

module.exports = {
    buscar
}