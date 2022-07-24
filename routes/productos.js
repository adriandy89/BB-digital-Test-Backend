const { Router } = require('express');
const { check } = require('express-validator');

const { validarJWT, validarCampos, tieneRol } = require('../middlewares');

const { crearProducto,
    obtenerProductos,
    obtenerProducto,
    actualizarProducto,
    borrarProducto,
    obtenerCantidadProductoXCaracteristica,
    obtenerProductosSinStock } = require('../controllers/productos');

const { existeCategoriaPorId, existeProductoPorId } = require('../helpers/db-validators');

const router = Router();

/**
 * {{url}}/api/productos
 */

//  Obtener todos los productos - publico
router.get('/', obtenerProductos);

//  Obtener cantidad de productos x caracteristica  - publico
router.get('/cantidad/caracteristica', obtenerCantidadProductoXCaracteristica);

//  Obtener productos sin stock  - publico
router.get('/stock/0', obtenerProductosSinStock);

// Obtener un producto por id - publico
router.get('/:id', [
    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('id').custom(existeProductoPorId),
    validarCampos,
], obtenerProducto);

// Crear producto - privado - cualquier persona con un token válido
router.post('/', [
    validarJWT,
    tieneRol('ADMIN_ROLE', 'EDITOR_ROLE'),
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('categoria', 'No es un id de Mongo').isMongoId(),
    check('categoria').custom(existeCategoriaPorId),
    validarCampos
], crearProducto);

// Actualizar - privado - administradores y editores
router.put('/:id', [
    validarJWT,
    tieneRol('ADMIN_ROLE', 'EDITOR_ROLE'),
    check('categoria', 'No es un id de Mongo').isMongoId(),
    check('id').custom(existeProductoPorId),
    validarCampos
], actualizarProducto);

// Actualizar stock sin recibir categoria  - privado - administradores y editores
router.patch('/:id', [
    validarJWT,
    tieneRol('ADMIN_ROLE', 'EDITOR_ROLE'),
    check('id').custom(existeProductoPorId),
    validarCampos
], actualizarProducto);

// Borrar un producto - administradores y editores
router.delete('/:id', [
    validarJWT,
    tieneRol('ADMIN_ROLE', 'EDITOR_ROLE'),
    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('id').custom(existeProductoPorId),
    validarCampos,
], borrarProducto);


module.exports = router;