const mongoose = require('mongoose');
const User = require('./user.model');

const AccountSchema = new mongoose.Schema({
    accountStatus: {
        type: Boolean,
        default: false
    },
    accountFunds: {
        type: Number,
        default: 0.0
    },
    accountType: {
        type: String,
        enum: ['Ahorros', 'Corriente']
    },
    accountNumber: {
        type: String,
        required: [true, 'El número de cuenta es requerido'],
        unique: true,
        validate: {
            validator: function (value) {
                const accountRegex = /^\d{1,10}$/;
                return accountRegex.test(value);
            },
            message: 'El número de cuenta debe tener exactamente 10 dígitos'
        }
    },
    userDetails: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

const Account = mongoose.model('Account', AccountSchema);
module.exports = Account;