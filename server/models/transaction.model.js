const mongoose = require('mongoose');
const Account = require('./account.model');

const TransactionSchema = new mongoose.Schema({
    transactionDate: {
        type: Date,
        required: [true, 'La fecha de movimiento es requerida'],
        /*validate: {
            validator: function (value) {
                const dateFormat = /^\d{4}-\d{2}-\d{2}$/;
                return dateFormat.test(value);
            },
            message: 'El formato de la fecha debe ser "YYYY-MM-DD".'
        }*/
    },
    transactionType: {
        type: String,
        enum: ['Crédito', 'Débito']
    },
    transactionValue: {
        type: Number,
        required: [true, 'El valor del movimiento es requerido'],
        min: [10, 'El valor del movimiento debe ser mayor o igual a 10']
    },
    accountDetails: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account'
    }
});

const Transaction = mongoose.model('Transaction', TransactionSchema);
module.exports = Transaction;