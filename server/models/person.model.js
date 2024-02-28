// Importamos el módulo 'mongoose', que nos permite trabajar con MongoDB y definir esquemas y modelos para nuestros datos.
const mongoose = require('mongoose');

// Definimos un esquema para la colección de administradores en la base de datos.
const PersonSchema = new mongoose.Schema({
    personName: {
        type: String,
        required: [true, "El nombre del admin es requerido"],
        validate: {
            validator: function (value) {
                // Validamos que el nombre tenga entre 4 y 10 caracteres.
                return value.length >= 4 && value.length <= 10;
            },
            message: 'El nombre del admin debe tener entre cuatro y diez caracteres.'
        }
    },
    personLastname: {
        type: String,
        required: [true, "El apellido del admin es requerido"],
        validate: {
            validator: function (value) {
                // Validamos que el apellido tenga entre 4 y 10 caracteres.
                return value.length >= 4 && value.length <= 10;
            },
            message: 'El apellido del admin debe tener entre cuatro y diez caracteres.'
        }
    },
    personDNI: {
        type: Number,
        required: [true, "El DNI del admin es requerido"],
        unique: true,
        validate: {
            validator: function (value) {
                // Validamos que el DNI tenga exactamente 10 dígitos.
                return value.toString().length === 10;
            },
            message: 'El DNI del admin debe tener diez números.'
        }
    },
    personMail: {
        type: String,
        required: [true, "El correo del admin es requerido"],
        unique: true,
        validate: {
            validator: function (value) {
                // Validamos el formato de correo electrónico usando una expresión regular.
                const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$/;
                return emailRegex.test(value);
            },
            message: 'El correo del admin no es válido.'
        }
    },
    personAddress: {
        type: String,
        required: [true, "La dirección del domicilio se requiere"],
        validate: {
            validator: function (value) {
                // Validamos que el apellido tenga entre 4 y 10 caracteres.
                return value.length >= 4 && value.length <= 10;
            },
            message: 'La dirección debe tener entre cuatro y diez caracteres.'
        }
    }
});

// Creamos un índice único para DNI, teléfono y correo.
// PersonSchema.index({ personDNI: 1, adminMail: 1 }, { unique: true });

// Creamos un modelo 'Admin' a partir del esquema definido, que nos permitirá interactuar con la colección de administradores en la base de datos.
const Person = mongoose.model('Person', PersonSchema);

// Exportamos el modelo 'Admin' para poder utilizarlo en otras partes de la aplicación.
module.exports = Person;
