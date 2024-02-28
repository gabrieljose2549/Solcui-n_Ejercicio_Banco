const AccountController = require('../controllers/account.controller');
const { protect } = require('../middleware/authentication_mw');

module.exports = function(app) {
    app.post('/api/account/new', protect, AccountController.createAccount_);
    app.post('/api/accounts/user/new/:userId', protect, AccountController.createAccount);
    app.get('/api/accounts', protect, AccountController.getUserAccounts);
    app.get('/api/accounts/user/:userId', protect, AccountController.getAccountsByUser);
    app.get('/api/account/:id', protect, AccountController.getAccount);
    app.put('/api/account/:id', protect, AccountController.updateAccount);
    app.delete('/api/account/:id', protect, AccountController.deleteAccount);
};