const TransactionController = require('../controllers/transaction.controller');
const { protect } = require('../middleware/authentication_mw');

module.exports = function(app) {
    app.post('/api/transaction/new', protect, TransactionController.createTransaction);
    app.get('/api/transactions/:id', protect, TransactionController.getAccountTransactions);
    app.put('/api/transaction/:id', protect, TransactionController.updateTransaction);
    app.delete('/api/transaction/:id', protect, TransactionController.deleteTransaction);
};