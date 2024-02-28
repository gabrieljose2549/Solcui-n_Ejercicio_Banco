const mongoose = require('mongoose');
const User = require('./user.model');

const SubjectSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: User  //Me permite definir el tipo de modelo al que pertenece el ObjectId
    },
    name: { 
        type: String,
        required: [ true, "Subject name is required"]
    }
},
{
    timestamps: true
})