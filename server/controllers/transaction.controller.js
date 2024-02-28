const Transaction = require('../models/transaction.model');
const Account = require('../models/account.model');

// Registrar un nuevo movimiento asociado a una cuenta
module.exports.createTransaction = async (req, res) => {
    const { transactionDate, transactionType, transactionValue, accountDetails } = req.body;

    // Valida manualmente el formato de fecha
    /*const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(transactionDate)) {
        return res.status(400).json({ message: 'El formato de la fecha debe ser "YYYY-MM-DD".' });
    }*/

    try {
        const account = await Account.findById(accountDetails);
        if (!account) {
            return res.status(400).json({ message: 'Account not found' });
        }

        // Crear una nueva transacción y asociarla a la cuenta
        const newTransaction = await Transaction.create({
            transactionDate,
            transactionType,
            transactionValue,
            accountDetails: account._id  // Asociar la transacción a la cuenta
        });

        // Actualizar el saldo de la cuenta basado en el tipo de transacción
        if (transactionType === 'Débito') {
            account.accountFunds -= transactionValue;
        } else if (transactionType === 'Crédito') {
            account.accountFunds += transactionValue;
        }

        // Guardar la cuenta actualizada
        await account.save();

        res.status(201).json(newTransaction);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Obtener los movimientos de una cuenta específica
module.exports.getAccountTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find({ accountDetails: req.params.id }).populate('accountDetails');
        res.json(transactions);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Actualizar los datos de un movimiento
module.exports.updateTransaction = async (req, res) => {
    try {
        const updatedTransaction = await Transaction.findByIdAndUpdate(req.params.id, req.body, { new: true });

        // Actualizar el saldo de la cuenta basado en el tipo de transacción
        const account = await Account.findById(updatedTransaction.accountDetails);
        if (updatedTransaction.transactionType === 'Débito') {
            account.accountFunds -= updatedTransaction.transactionValue;
        } else if (updatedTransaction.transactionType === 'Crédito') {
            account.accountFunds += updatedTransaction.transactionValue;
        }

        // Guardar la cuenta actualizada
        await account.save();

        res.json(updatedTransaction);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Eliminar un movimiento
module.exports.deleteTransaction = async (req, res) => {
    try {
        // Encontrar la transacción antes de eliminarla
        const transactionToDelete = await Transaction.findById(req.params.id);

        // Obtener la cuenta asociada a la transacción
        const account = await Account.findById(transactionToDelete.accountDetails);

        // Actualizar el saldo de la cuenta basado en el tipo de transacción antes de eliminarla
        if (transactionToDelete.transactionType === 'Débito') {
            account.accountFunds += transactionToDelete.transactionValue;
        } else if (transactionToDelete.transactionType === 'Crédito') {
            account.accountFunds -= transactionToDelete.transactionValue;
        }

        // Guardar la cuenta actualizada
        await account.save();

        // Eliminar la transacción
        await Transaction.findByIdAndDelete(req.params.id);

        res.json({ message: 'Transaction deleted successfully' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};