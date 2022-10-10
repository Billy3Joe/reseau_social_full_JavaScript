const UserModel = require('../models/user.model');
//On appel nos fonctions signUpErrors, signInErrors et de la gestion d'érreurs dépuis le dossier utils
const { signUpErrors, signInErrors } = require('../utils/errors.utils');
//jsonwebtoken jout le rôle des sessions propre à chaque utilisateur comme avec php
const jwt = require('jsonwebtoken');

//Le nombre de jour ou le token est valide: Nous on a choisie 3 jours
const maxAge = 3 * 24 * 60 * 60 * 1000;

//createToken va nous générer un token étant donné que la clé sécrète TOKEN_SECRET se trouve dans .env. Dans le token il y'aura l'id de l'utilisateur et notre clé sécrète
const createToken = (id) => {
    return jwt.sign({ id }, process.env.TOKEN_SECRET, {
        //Notre clé sécrète pour décoder le token
        expiresIn: maxAge
    })
};

//INSCRIPTION
module.exports.signUp = async(req, res) => {
    const { pseudo, email, password } = req.body

    try {
        const user = await UserModel.create({ pseudo, email, password });
        //Comme reponse, on renvoit juste l'id de l'utilisateur pour lui dire que ça a marché
        res.status(201).json({ user: user._id });
    } catch (err) {
        //signUpErrors est une fonction que nous avons crée dans le fichier errors.utils.js du dossier utils
        const errors = signUpErrors(err)
        res.status(200).send({ errors })
    }
}

//CONNEXION
module.exports.signIn = async(req, res) => {
    const { email, password } = req.body

    try {
        const user = await UserModel.login(email, password);
        //On utilise notre token généré plus haut en passant en paramètre l'id de l'utilisateur qui retournera par la suite après la connexion le même id
        const token = createToken(user._id);
        //On met dans les cookie le nom du cookie ('jwt'), le token httpOnly qui est la sécurité du token et maxeAge qui est la durée de vie du cookie
        res.cookie('jwt', token, { httpOnly: true, maxAge });
        //On se fait un status 200 avec les infos pour dire que ça a marché
        res.status(200).json({ user: user._id })
    } catch (err) {
        //signInErrors est une fonction que nous avons crée dans le fichier errors.utils.js du dossier utils
        const errors = signInErrors(err)
            //On se fait un status 200 en renvoyant l'erreur si ça n'a pas marché
        res.status(200).json({ errors });
    }
}

//DECONNEXION
module.exports.logout = (req, res) => {
    //Quand il se déconnecte on lui retire son token et jwt qui est le cookie va disparaitre tés rapidement grâce à sa durée de vie limitée de 1ms (maxAge: 1)
    res.cookie('jwt', '', { maxAge: 1 });
    //On fait une rédirection parce que si on ne le fait pas, la requête sur postman n'aboutira pas.
    res.redirect('/');
}