const UserController = require('../controllers/user.controller');
const { protect } = require('../middleware/authentication_mw');

module.exports = function(app){
    app.post('/api/login', UserController.loginUser);
    app.post('/api/user/new', UserController.createUser);
    app.get('/api/protectedAction', protect, UserController.protectedAction);
    app.get('/api/users', protect, UserController.getAllUsers);
    app.get('/api/user/:id', protect, UserController.getUser);
    app.put('/api/user/:id/', protect, UserController.updateUser);
    app.delete('/api/user/:id', protect, UserController.deleteUser);
} 
