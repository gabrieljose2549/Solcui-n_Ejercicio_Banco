const express = require('express');
require('./server/config/mongoose.config');
const cors = require('cors');
const app = express();
const port = 8000;


app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 
app.use(cors());

const allUserRoutes = require('./server/routes/user.routes');
allUserRoutes(app);

const allAccountRoutes = require('./server/routes/account.routes');
allAccountRoutes(app);

const allTransactionRoutes = require('./server/routes/transaction.routes');
allTransactionRoutes(app);

app.listen(port, '0.0.0.0', () => {
    console.log("Server listening at port", port);
})
