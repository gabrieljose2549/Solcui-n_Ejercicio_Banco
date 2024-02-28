require("dotenv").config();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const User = require('../models/user.model');
const Person = require('../models/person.model');

module.exports.loginUser = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ 'personDetails.personMail': email }).populate('personDetails');

    if (!user) {
        console.log('User Not Found');
        return res.status(400).json({ message: 'User not found' });
    }

    console.log('Stored Password:', user.password);
    console.log('Entered Password:', password);

    if (user && (await bcrypt.compare(password, user.password))) {
        res.json({ message: 'Login User', email: user.personDetails.personMail, userName: user.personDetails.personName, id: user.personDetails._id, token: generateToken(user._id) })
    } else {
        console.log('Password Comparison Failed');
        res.status(400).json({ message: 'Login Failed' })
    }
}

module.exports.protectedAction = async (req, res) => {
    const user = await User.findById(req.user.id).populate('personDetails');
    res.status(200).json({ _id: user._id, userName: user.personDetails.personName, email: user.personDetails.personMail });
}

module.exports.createUser = async (request, response) => {
    const { personName, personLastname, personDNI, personMail, personAddress, password } = request.body;
    if (!personName || !personLastname || !personDNI || !personMail || !personAddress || !password) {
        response.status(400).json({ message: 'Missing fields, all are mandatory!' });
    }
    try {
        // Crea primero la instancia de Persona
        const newPerson = await Person.create({
            personName,
            personLastname,
            personDNI,
            personMail,
            personAddress
        });

        // Genera un hash de la contraseña
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Crea la instancia de Usuario y establece la relación con Persona
        const newUser = await User.create({
            personDetails: newPerson._id,
            password: hashedPassword
        });

        // Genera un token JWT
        const token = generateToken(newUser._id);

        response.status(201).json({
            _id: newUser._id,
            personDetails: newPerson,
            token
        });
    } catch (error) {
        response.status(400).json({ message: error.message });
    }
}

module.exports.getAllUsers = async (_, response) => {
    try {
        const users = await User.find({}).populate('personDetails');
        response.json(users);
    } catch (err) {
        response.json(err);
    }
}

module.exports.getUser = async (request, response) => {
    try {
        const user = await User.findById(request.params.id).populate('personDetails');
        response.json(user);
    } catch (err) {
        response.json(err);
    }
}

module.exports.updateUser = async (request, response) => {
    try {
        // Actualizar sólo los campos de Usuario
        const updatedUser = await User.findByIdAndUpdate(request.params.id, request.body, { new: true });

        // Actualizar los campos de Persona separadamente
        const updatedPerson = await Person.findByIdAndUpdate(updatedUser.personDetails, request.body.personDetails, { new: true });

        response.json({
            user: updatedUser,
            person: updatedPerson
        });
    } catch (err) {
        response.json(err);
    }
}

module.exports.deleteUser = async (request, response) => {
    try {
        // Eliminar la instancia de Usuario
        const deletedUser = await User.findByIdAndDelete(request.params.id);

        // Eliminar la instancia de Persona asociada
        await Person.findByIdAndDelete(deletedUser.personDetails);

        response.json({ message: 'User and associated Person deleted successfully' });
    } catch (err) {
        response.json(err);
    }
}

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
}