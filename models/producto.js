const { Schema, model } = require('mongoose');

const ProductoSchema = Schema({
    sku: {
        type: String,
        required: [true, 'El identificador es obligatorio'],
        unique: true
    },
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    estado: {
        type: Boolean,
        default: true,
        required: true
    },
    precio: {
        type: Number,
        default: 0
    },
    stock: {
        type: Number,
        default: 0
    },
    tags: {
        type: Number,
        default: 0
    },
    valoracion: {
        type: Number,
        default: 0
    },
    categoria: {
        type: Schema.Types.ObjectId,
        ref: 'Categoria',
        required: true
    },
    descripcion: { type: String },
    informacion: { type: String },
    imagenes: { type: [] },
});


ProductoSchema.methods.toJSON = function () {
    const { __v, estado, ...data } = this.toObject();
    return data;
}


module.exports = model('Producto', ProductoSchema);
