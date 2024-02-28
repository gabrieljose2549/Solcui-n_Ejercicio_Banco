require("dotenv").config();
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

module.exports.protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Se obtiene el token (p.ej., Bearer DJDHFHFHHFHFHF#%>%)
      token = req.headers.authorization;
      console.log('Token recibido-con Bearer: ', token);
      token = token.split(' ')[1];
      console.log('Token extraído: ', token);

      // Se verifica el token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Agregamos a cada petición información del usuario
      // Excepto el password (recuperado con base en el _id contenido en el payload del token)
      const user = await User.findOne({ _id: decoded.id }).populate('personDetails').select('-password');

      if (!user) {
        return res.status(401).json({ message: 'Not authorized!' });
      }

      req.user = user;
      next();
    } catch (error) {
      res.status(401).json({ message: 'Not authorized!' });
    }
  }

  // Si no se tiene un token de portador, entonces no estará autorizado
  if (!token) {
    res.status(401).json({ message: 'Not authorized, missed token!' });
  }
};