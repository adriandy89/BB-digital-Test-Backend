
const { Router } = require('express');
const { check } = require('express-validator');

const {
    validarCampos,
    validarJWT,
    esAdminRol,
} = require('../middlewares');


const { emailExiste, existeUsuarioPorId } = require('../helpers/db-validators');

const { usuariosGet,
    usuariosPut,
    usuariosPost,
    usuariosDelete,
    usuariosPatch } = require('../controllers/usuarios');

const router = Router();


router.get('/', [
    validarJWT,
    esAdminRol
], usuariosGet);

router.post('/', [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'El password debe de ser más de 8 letras').isLength({ min: 8 }),
    check('correo', 'El correo no es válido').isEmail(),
    check('correo').custom(emailExiste),
    check('rol', 'No es un rol válido').isIn(['USER_ROLE']),           // Usar este para crear usuarios solamente con rol user
    // check('rol', 'No es un rol válido').isIn(['ADMIN_ROLE', 'EDITOR_ROLE', 'USER_ROLE']),
    validarCampos
], usuariosPost);

router.put('/:id', [
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    validarJWT,
    esAdminRol,
    validarCampos
], usuariosPut);

router.delete('/:id', [
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    validarJWT,
    esAdminRol,
    validarCampos
], usuariosDelete);

router.patch('/', usuariosPatch);


module.exports = router;