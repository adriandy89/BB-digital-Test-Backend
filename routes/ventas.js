const { Router } = require('express');
const { check } = require('express-validator');

const { validarJWT, validarCampos, tieneRol } = require('../middlewares');

const { crearVenta,
    obtenerVentas,
    obtenerVenta,
    actualizarVenta,
    borrarVenta,
    obtenerListaProductos,
    obtenerGananciaTotal } = require('../controllers/Ventas');

const { existeVentaPorId, existeProductoEnStock, existeUsuarioPorId } = require('../helpers/db-validators');

const router = Router();

/**
 * {{url}}/api/ventas
 */

//  Obtener todos los Ventas - publico
router.get('/', obtenerVentas);

//  Obtener lista de productos vendidos - publico
router.get('/productos/vendidos', [
    validarJWT,
    tieneRol('ADMIN_ROLE', 'EDITOR_ROLE'),
    validarCampos
], obtenerListaProductos);

//  Obtener ganancia total - publico
router.get('/ganancia/total', [
    validarJWT,
    tieneRol('ADMIN_ROLE', 'EDITOR_ROLE'),
    validarCampos
], obtenerGananciaTotal);

// Obtener un Venta por id - publico
router.get('/:id', [
    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('id').custom(existeVentaPorId),
    validarCampos,
], obtenerVenta);

// Crear Venta - privado - cualquier persona con un token válido
router.post('/', [
    validarJWT,
    tieneRol('ADMIN_ROLE', 'EDITOR_ROLE'),
    check('monto', 'El nombre es obligatorio').not().isEmpty(),
    check('producto', 'El producto es obligatorio').isMongoId(),
    check('producto').custom(existeProductoEnStock),
    check('usuario', 'El usuario es obligatorio').isMongoId(),
    check('usuario').custom(existeUsuarioPorId),
    validarCampos
], crearVenta);

// Actualizar - privado - administradores y editores
router.put('/:id', [
    validarJWT,
    tieneRol('ADMIN_ROLE', 'EDITOR_ROLE'),
    check('id', 'No es un id de Mongo').isMongoId(),
    check('id').custom(existeVentaPorId),
    validarCampos
], actualizarVenta);

// Borrar un Venta - administradores y editores
router.delete('/:id', [
    validarJWT,
    tieneRol('ADMIN_ROLE', 'EDITOR_ROLE'),
    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('id').custom(existeVentaPorId),
    validarCampos,
], borrarVenta);


module.exports = router;