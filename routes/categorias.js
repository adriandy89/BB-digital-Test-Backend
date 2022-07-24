const { Router } = require('express');
const { check } = require('express-validator');

const { validarJWT, validarCampos, esAdminRol, tieneRol } = require('../middlewares');

const { crearCategoria,
    obtenerCategorias,
    obtenerCategoria,
    actualizarCategoria,
    borrarCategoria } = require('../controllers/categorias');
const { existeCategoriaPorId } = require('../helpers/db-validators');

const router = Router();

/**
 * {{url}}/api/categorias
 */

//  Obtener todas las categorias - publico
router.get('/', obtenerCategorias);

// Obtener una categoria por id - publico
router.get('/:id', [
    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('id').custom(existeCategoriaPorId),
    validarCampos,
], obtenerCategoria);

// Crear categoria - privado - administradores y editores
router.post('/', [
    validarJWT,
    tieneRol('ADMIN_ROLE', 'EDITOR_ROLE'),
    check('nombre', 'El nombre es obligatorio').not().isEmpty()
], crearCategoria);

// Actualizar - privado - administradores y editores
router.put('/:id', [
    validarJWT,
    tieneRol('ADMIN_ROLE', 'EDITOR_ROLE'),
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('id').custom(existeCategoriaPorId),
    validarCampos
], actualizarCategoria);

// Borrar una categoria - administradores y editores
router.delete('/:id', [
    validarJWT,
    tieneRol('ADMIN_ROLE', 'EDITOR_ROLE'),
    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('id').custom(existeCategoriaPorId),
    validarCampos,
], borrarCategoria);



module.exports = router;