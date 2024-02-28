const mongoose = require('mongoose');

const db_name = 'codev_db'

mongoose.set("strictQuery", false);

mongoose.connect("mongodb://127.0.0.1/" + db_name, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('Established a connection to database'))
.catch(err => console.log("Something went wrong when connecting to the database", err));
