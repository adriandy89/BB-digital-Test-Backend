const { response } = require('express');
const { Categoria } = require('../models');

const crearCategoria = async (req, res = response) => {

    const nombre = req.body.nombre.toUpperCase();

    const categoriaDB = await Categoria.findOne({ nombre });

    if (categoriaDB) {
        return res.status(400).json({
            msg: `La categoria ${categoriaDB.nombre}, ya existe`
        });
    }

    const categoria = new Categoria({ nombre });

    // Guardar DB
    await categoria.save();

    res.status(201).json(categoria);

}

const obtenerCategorias = async (req, res = response) => {

    const { limite = 10, desde = 0 } = req.query;
    const query = { estado: true };

    const [total, categorias] = await Promise.all([
        Categoria.countDocuments(query),
        Categoria.find(query)
            .skip(Number(desde))
            .limit(Number(limite))
    ]);

    res.json({
        total,
        categorias
    });
}

const obtenerCategoria = async (req, res = response) => {

    const { id } = req.params;
    const categoria = await Categoria.findById(id);

    res.json(categoria);

}

const actualizarCategoria = async (req, res = response) => {

    const { id } = req.params;
    const { ...data } = req.body;

    data.nombre = data.nombre.toUpperCase();

    const categoria = await Categoria.findByIdAndUpdate(id, data, { new: true });

    res.json(categoria);

}

const borrarCategoria = async (req, res = response) => {

    const { id } = req.params;
    const categoriaBorrada = await Categoria.findByIdAndUpdate(id, { estado: false }, { new: true });

    res.json(categoriaBorrada);
}


module.exports = {
    crearCategoria,
    obtenerCategorias,
    obtenerCategoria,
    actualizarCategoria,
    borrarCategoria
}