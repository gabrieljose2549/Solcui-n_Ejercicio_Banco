const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Person = require('./person.model');

const UserSchema = new mongoose.Schema({
    userStatus: {
        type: Boolean,
        default: false
    },
    password: {
        type: String,
        required: [true, "Password is required"]
    },
    personDetails: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Person'
    },
    accounts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account'
    }]
}, {
    timestamps: true
});

/*UserSchema.pre('save', async function (next) {
    // Hash de la contraseña antes de guardar el usuario
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});*/

const User = mongoose.model('User', UserSchema);
module.exports = User;