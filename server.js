const express = require('express');
const bodyParser = require('body-parser');
userRoutes = require('./routes/user.routes');
//dotenv permet de réccupérer tout ce qui se trouve dans le fichier .env qu'on passe directement comme variable d'environnement
require('dotenv').config({ path: './config/.env' });
require('./config/db');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//ROUTES
app.use('/api/user', userRoutes);


//SERVER
app.listen(process.env.PORT, () => console.log(`Notre application Node est démarrée sur : http://localhost:${process.env.PORT}`))