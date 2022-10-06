const mongoose = require('mongoose');
//On appel isEmail(une fonction qui renvoit true ou false) de la bibliothèque validator pour controller l'email
const { isEmail } = require('validator');

//bcrypt permet de crypter le md^p en générant une serie de caractères
const bcrypt = require('bcrypt');

//NB: Les tables sont crées au sigulier mais dans mongodb ça se met automatiquement au pluriel
const userSchema = new mongoose.Schema({
    pseudo: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 55,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        validate: [isEmail],
        lowercase: true,
        unique: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
        max: 1024,
        minlength: 6
    },

    //Le reste de champs non obligatoire
    picture: {
        type: String,
        default: "./uploads/profil/random-user.png"
    },
    bio: {
        type: String,
        max: 1024,
    },
    followers: {
        type: [String]
    },
    following: {
        type: [String]
    },
    likes: {
        type: [String]
    }
}, {
    timestamps: true,
});

// play function before save into display: 'block',
//Avant d'enregistrer les données dans la bd, je veux que tu crypte le mdp
userSchema.pre("save", async function(next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// userSchema.statics.login = async function(email, password) {
//     const user = await this.findOne({ email });
//     if (user) {
//         const auth = await bcrypt.compare(password, user.password);
//         if (auth) {
//             return user;
//         }
//         throw Error('incorrect password');
//     }
//     throw Error('incorrect email')
// };

const UserModel = mongoose.model("user", userSchema);

module.exports = UserModel;