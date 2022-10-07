const UserModel = require("../models/user.model");
const ObjectID = require("mongoose").Types.ObjectId;

//On réccupère tous les utilisateurs par la fonction getAllUsers
module.exports.getAllUsers = async(req, res) => {
    //("-password") demande qu'il ne renvoit pas le password sur posman 
    //Lorsque sur le site, il va faloir réccupérer tous les utilisateurs, il va revoyer tous les infos sauf le password
    const users = await UserModel.find().select("-password");
    res.status(200).json(users);
};

//On réccupère les données d'un utilisateur par la fonction userInfo 
module.exports.userInfo = (req, res) => {
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send("ID unknown : " + req.params.id);

    UserModel.findById(req.params.id, (err, docs) => {
        if (!err) res.send(docs);
        else console.log("ID unknown : " + err);
    }).select("-password");
};

//Modification des informations d'un utilisateur par la fonction updateUser
module.exports.updateUser = async(req, res) => {
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send("ID unknown : " + req.params.id);

    try {
        await UserModel.findOneAndUpdate({ _id: req.params.id }, {
                $set: {
                    bio: req.body.bio,
                },
            }, { new: true, upsert: true, setDefaultsOnInsert: true },
            (err, docs) => {
                if (!err) return res.send(docs);
                if (err) return res.status(500).send({ message: err });
            }
        );
    } catch (err) {
        return res.status(500).json({ message: err });
    }
};

//Suppression d'un utilisateur par la fonction deleteUser 
module.exports.deleteUser = async(req, res) => {
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send("ID unknown : " + req.params.id);

    try {
        await UserModel.remove({ _id: req.params.id }).exec();
        res.status(200).json({ message: "Successfully deleted. " });
    } catch (err) {
        return res.status(500).json({ message: err });
    }
};

module.exports.follow = async(req, res) => {
    if (!ObjectID.isValid(req.params.id) ||
        !ObjectID.isValid(req.body.idToFollow)
    )
        return res.status(400).send("ID unknown : " + req.params.id);

    try {
        // add to the follower list
        await UserModel.findByIdAndUpdate(
            req.params.id, { $addToSet: { following: req.body.idToFollow } }, { new: true, upsert: true },
            (err, docs) => {
                if (!err) res.status(201).json(docs);
                else return res.status(400).jsos(err);
            }
        );
        // add to following list
        await UserModel.findByIdAndUpdate(
            req.body.idToFollow, { $addToSet: { followers: req.params.id } }, { new: true, upsert: true },
            (err, docs) => {
                // if (!err) res.status(201).json(docs);
                if (err) return res.status(400).jsos(err);
            }
        );
    } catch (err) {
        return res.status(500).json({ message: err });
    }
};


module.exports.unfollow = async(req, res) => {
    if (!ObjectID.isValid(req.params.id) ||
        !ObjectID.isValid(req.body.idToUnfollow)
    )
        return res.status(400).send("ID unknown : " + req.params.id);

    try {
        await UserModel.findByIdAndUpdate(
            req.params.id, { $pull: { following: req.body.idToUnfollow } }, { new: true, upsert: true },
            (err, docs) => {
                if (!err) res.status(201).json(docs);
                else return res.status(400).jsos(err);
            }
        );
        // remove to following list
        await UserModel.findByIdAndUpdate(
            req.body.idToUnfollow, { $pull: { followers: req.params.id } }, { new: true, upsert: true },
            (err, docs) => {
                // if (!err) res.status(201).json(docs);
                if (err) return res.status(400).jsos(err);
            }
        );
    } catch (err) {
        return res.status(500).json({ message: err });
    }
};