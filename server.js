const express = require('express');
//La bibliothèque nody-parser permet de lire une URL
const bodyParser = require('body-parser');
//La bibliothèque cookie-parser permet de lire un cookie
const cookieParser = require('cookie-parser');
//Exportation des différentes routes
userRoutes = require('./routes/user.routes');
postRoutes = require('./routes/post.routes');
//dotenv permet de réccupérer tout ce qui se trouve dans le fichier .env qu'on passe directement comme variable d'environnement
require('dotenv').config({ path: './config/.env' });
require('./config/db');
//On appel nos fonctions checkUser et requireAuth dépuis le fichier auth.middleware.js
const { checkUser, requireAuth } = require('./middleware/auth.middleware');
const cors = require('cors');
const app = express();

//Cors options (Les autorisations de nos requêtes)
const corsOptions = {
    origin: process.env.CLIENT_URL,
    credentials: true,
    'allowedHeaders': ['sessionId', 'Content-Type'],
    'exposedHeaders': ['sessionId'],
    'methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
    'preflightContinue': false
}
app.use(cors(corsOptions));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

//JWT
//* veut dire que si jamais une route correspond à n'imporquel route, tu déclanches checkUser qui va checker si l'utilisateur à bien le token qui correspond à un id
//A chaque fois qu'on va faire un requête, il va checker
app.get('*', checkUser);
app.get('/jwtid', requireAuth, (req, res) => {
    res.status(200).send(res.locals.user._id);
});

//ROUTES
app.use('/api/user', userRoutes);
app.use('/api/post', postRoutes);


//SERVER
app.listen(process.env.PORT, () => console.log(`Notre application Node est démarrée sur : http://localhost:${process.env.PORT}`))