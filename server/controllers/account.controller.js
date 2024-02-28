const Account = require('../models/account.model');
const User = require('../models/user.model');

// Crear una nueva cuenta asociada a un usuario
module.exports.createAccount_ = async (req, res) => {
    const { accountStatus, accountFunds, accountType, accountNumber, userDetails } = req.body;
    try {
        const user = await User.findById(userDetails);
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        // Crear una nueva cuenta y asociarla al usuario
        const newAccount = await Account.create({
            accountStatus,
            accountFunds,
            accountType,
            accountNumber,
            userDetails: user._id  // Asociar la cuenta al usuario
        });

        // Agregar la nueva cuenta al array 'accounts' en el modelo de usuario
        user.accounts.push(newAccount._id);
        await user.save();

        res.status(201).json(newAccount);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Controlador para crear una nueva cuenta asociada a un usuario específico
module.exports.createAccountOne = async (req, res) => {
    const { accountStatus, accountFunds, accountType, accountNumber } = req.body;
    const userId = req.params.userId;

    try {
        // Verificar si el usuario existe
        const user = await User.findById(userId);
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        // Crear una nueva cuenta y asociarla al usuario
        const newAccount = await Account.create({
            accountStatus,
            accountFunds,
            accountType,
            accountNumber,
            userDetails: user._id  // Asociar la cuenta al usuario
        });

        // Agregar la nueva cuenta al array 'accounts' en el modelo de usuario
        user.accounts.push(newAccount._id);
        await user.save();

        res.status(201).json(newAccount);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Función para obtener el ID de usuario a partir del ID de persona
const getUserIdFromPersonId = async (personId) => {
    try {
      const user = await User.findOne({ personDetails: personId });
      return user ? user._id : null;
    } catch (error) {
      console.error("Error:", error.message);
      return null;
    }
  };

// Controlador para crear una nueva cuenta asociada a un usuario específico
module.exports.createAccount = async (req, res) => {
    const { accountStatus, accountFunds, accountType, accountNumber } = req.body;
    const userIdOrPersonId = req.params.userId;
  
    try {
      // Obtener el ID de usuario a partir del ID de persona (si se proporciona un ID de persona)
      const userId = await getUserIdFromPersonId(userIdOrPersonId);
  
      if (!userId) {
        // Si no se puede obtener el ID de usuario directamente, asumir que se proporcionó el ID de usuario
        if (!userIdOrPersonId.match(/^[0-9a-fA-F]{24}$/)) {
          // Verificar si el ID proporcionado es un ID de usuario válido
          return res.status(400).json({ message: 'Invalid user or person ID' });
        }
  
        // Utilizar el ID proporcionado directamente como ID de usuario
        const user = await User.findById(userIdOrPersonId);
  
        if (!user) {
          return res.status(400).json({ message: 'User not found' });
        }
  
        // Crear una nueva cuenta y asociarla al usuario
        const newAccount = await Account.create({
          accountStatus,
          accountFunds,
          accountType,
          accountNumber,
          userDetails: userIdOrPersonId  // Asociar la cuenta al usuario
        });
  
        // Agregar la nueva cuenta al array 'accounts' en el modelo de usuario
        user.accounts.push(newAccount._id);
        await user.save();
  
        return res.status(201).json(newAccount);
      } else {
        // Crear una nueva cuenta y asociarla al usuario usando el ID de usuario
        const newAccount = await Account.create({
          accountStatus,
          accountFunds,
          accountType,
          accountNumber,
          userDetails: userId  // Asociar la cuenta al usuario
        });
  
        // Agregar la nueva cuenta al array 'accounts' en el modelo de usuario
        const user = await User.findById(userId);
        user.accounts.push(newAccount._id);
        await user.save();
  
        return res.status(201).json(newAccount);
      }
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  };

  // Obtener cuentas asociadas a un usuario específico
module.exports.getAccountsByUser = async (req, res) => {
    const userIdOrPersonId = req.params.userId;
  
    try {
      // Obtener el ID de usuario a partir del ID de persona (si se proporciona un ID de persona)
      const userId = await getUserIdFromPersonId(userIdOrPersonId);
  
      if (!userId) {
        // Si no se puede obtener el ID de usuario directamente, asumir que se proporcionó el ID de usuario
        if (!userIdOrPersonId.match(/^[0-9a-fA-F]{24}$/)) {
          // Verificar si el ID proporcionado es un ID de usuario válido
          return res.status(400).json({ message: 'Invalid user or person ID' });
        }
  
        // Utilizar el ID proporcionado directamente como ID de usuario
        const accounts = await Account.find({ userDetails: userIdOrPersonId });
        return res.json(accounts);
      } else {
        // Obtener cuentas asociadas al usuario usando el ID de usuario
        const accounts = await Account.find({ userDetails: userId });
        return res.json(accounts);
      }
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  };
  
// Obtener cuentas asociadas a un usuario específico
module.exports.getAccountsByUser_ = async (req, res) => {
    try {
        const userId = req.params.userId;
        const accounts = await Account.find({ userDetails: userId });
        res.json(accounts);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Obtener listado de cuentas asociadas a un usuario
module.exports.getUserAccounts = async (req, res) => {
    try {
        const user = req.user; // La información del usuario está disponible gracias al middleware protect
        const accounts = await Account.find({ userDetails: user._id });
        res.json(accounts);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Leer los datos de una cuenta específica
module.exports.getAccount = async (req, res) => {
    try {
        const account = await Account.findById(req.params.id).populate('userDetails');
        res.json(account);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Actualizar los datos de una cuenta
module.exports.updateAccount = async (req, res) => {
    try {
        const updatedAccount = await Account.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedAccount);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Eliminar una cuenta
module.exports.deleteAccount = async (req, res) => {
    try {
        // Encontrar la cuenta antes de eliminarla
        const accountToDelete = await Account.findById(req.params.id);

        // Eliminar la referencia de la cuenta en el array 'accounts' en el modelo de usuario
        await User.findByIdAndUpdate(accountToDelete.userDetails, { $pull: { accounts: accountToDelete._id } });

        // Eliminar la cuenta
        await Account.findByIdAndDelete(req.params.id);

        res.json({ message: 'Account deleted successfully' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};