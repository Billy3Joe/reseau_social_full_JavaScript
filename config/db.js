const mongoose = require('mongoose');

mongoose
    .connect(`mongodb+srv://${process.env.DB_USER_PASS}@cluster0.dlvejut.mongodb.net/reseau-social`, {
            useNewUrlParser: true,
            useUnifiedTopology: true
                // useCreateIndex: true,
                // useFindAndModify: false
        }

    )

.then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.log('Error connecting to MongoDB: ' + err.message));