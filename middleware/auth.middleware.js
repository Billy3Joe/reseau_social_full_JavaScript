//jsonwebtoken jout le rôle des sessions propre à chaque utilisateur comme avec php
const jwt = require("jsonwebtoken");
const UserModel = require("../models/user.model");

//On crée une fonction checkUser si l'utilisateur est connecté tout au long du site
//On check le token de l'utilisateur pour voir si on le connait
module.exports.checkUser = (req, res, next) => {
    //On lit le cookie lié à un token grâce à la bibliothèque cookie-parser appelé dans le fichier server.js
    const token = req.cookies.jwt;
    //Si le token est sur true
    if (token) {
        jwt.verify(token, process.env.TOKEN_SECRET, async(err, decodedToken) => {
            //Si on trouve une erreur, on enlève le token
            if (err) {
                res.locals.user = null;
                res.cookie("jwt", "", { maxAge: 1 });
                next();
                //Si il n'y a pas d'erreur
            } else {
                let user = await UserModel.findById(decodedToken.id);
                res.locals.user = user;
                next();
            }
        });
        //Si il n'a pas de token, on met null ie qu'il n'existe pas
    } else {
        res.locals.user = null;
        next();
    }
};

module.exports.requireAuth = (req, res, next) => {
    const token = req.cookies.jwt;
    if (token) {
        jwt.verify(token, process.env.TOKEN_SECRET, async(err, decodedToken) => {
            if (err) {
                console.log(err);
                res.send(200).json('no token')
            } else {
                console.log(decodedToken.id);
                next();
            }
        });
    } else {
        console.log('No token');
    }
};