const { Schema, model } = require('mongoose');

const VentaSchema = Schema({
    producto: {
        type: Schema.Types.ObjectId,
        ref: 'Producto',
        required: [true, 'El producto es obligatorio']
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: [true, 'El usuario es obligatorio']
    },
    monto: {
        type: Number,
        required: [true, 'El monto es obligatorio']
    },
    cantidad: {
        type: Number,
        default: 1
    },
});


VentaSchema.methods.toJSON = function () {
    const { __v, ...data } = this.toObject();
    return data;
}


module.exports = model('Venta', VentaSchema);