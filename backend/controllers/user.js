const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { User } = require("../models");
const CryptoJS = require('crypto-js');
const fs = require('fs');

//logique de manipulation des utilisateurs
//s'inscrire
exports.signup = (req, res) => {
  const email = req.body.email;
  const firstname = req.body.firstname;
  const name = req.body.name;
  const password = req.body.password;
  const regexEmail = /^[a-z0-9._-]+@[a-z0-9.-]{2,}[.][a-z]{2,3}$/;
  const regexPassword = /((?=.*[a-z])(?=.*[A-Z]).{6,10})/;

  if (email === null || email === '' ||
    firstname === null || firstname === '' ||
    name === null || name === '' ||
    password === null || password === '') {
    return res.status(400).json({ error: 'Tous les champs sont obligatoires' });
  }

  if (regexEmail.test(email) === false) { return res.status(400).json({ error: 'L\'email est invalide' }); }
  if (regexPassword.test(password) === false) { return res.status(400).json({ error: 'Le mot de passe doit contenir entre 6 et 10 caratères et au moins une majuscule et une minuscule' }); }
  
  // On hash et applique du salage sur le mot de passe avant de le stocker dans la BDD et on masque l'email
  bcrypt.hash(req.body.password, 10) 
    .then(hash => {
      const newUser = {
        firstname: req.body.firstname,
        name: req.body.name.toUpperCase(),
        email: CryptoJS.MD5(req.body.email).toString(), // Sécurisation du mail
        password: hash
      }
      User.create(newUser)
        .then(() => res.status(200).json({ message: 'Utilisateur crée !' }))
        .catch(() => res.status(400).json({ error: "Cet email est déjà utilisé" }))
    })
    .catch(error => res.status(500).json({ error }));
};


//se connecter
exports.login = (req, res) => {
  // On crypte l'email entré par l'utilisateur puis on le cherche dans la BDD
  let cryptedMail = CryptoJS.MD5(req.body.email).toString();
  User.findOne({ where: { email: cryptedMail } })
    .then(user => {
      if (!user) {
        return res.status(401).json({ error: "Utilisateur non trouvé !" });
      }
      // Si l'utilisateur est trouvé, on compare les deux mots de passe
      bcrypt.compare(req.body.password, user.dataValues.password)
        .then(valid => {
          if (!valid) {
            return res.status(401).json({ error: "Mot de passe incorrect !" });
          }
          // On ajoute le token d'authentification dans la réponse
          res.status(200).json({
            userId: user.dataValues.id,
            token: jwt.sign(
              { userId: user.dataValues.id },
              process.env.SECRET_TOKEN,
              { expiresIn: '24h' }
            )
          });
        })
        .catch(error => res.status(500).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};

exports.getOneUser = (req, res) => {
  User.scope('nopassword').findOne({ where: { id: req.body.id } })
    .then(user => res.status(200).json(user))
    .catch(error => res.status(500).json({ error }))
}

exports.changePassword = (req, res) => {
  User.findOne({ where: { id: req.body.id } })
    .then(user => {
      // On compare le mot de passe actuel avec celui entré par l'utilisateur
      bcrypt.compare(req.body.oldPassword, user.dataValues.password)
        .then(valid => {
          if (!valid) {
            return res.status(401).json({ error: "Le mot de passe actuel est incorrect" })
          }
          // Si les mots de passe sont corrects, on hash et applique un salage sur le nouveau mot de passe
          bcrypt.hash(req.body.newPassword, 10)
            .then(newHash => {
              User.update({ password: newHash }, { where: { id: req.body.id } })
              res.status(201).json({ message: "Mot de passe changé avec succès" })
            })
            .catch(error => {
              res.status(500).json({ error });
            })
        })
        .catch(error => res.status(500).json({ error }))
    })
    .catch(() => res.status(400).json({ error: "Utilisateur n'a pas été trouvé !" }))
}

//modifier la photo de profil
exports.changeAvatar = (req, res) => {
  User.findOne({
    where: {
      id: req.body.userId
    }
  })
    .then(user => {
      // On commence par supprimer l'ancienne image du serveur
      const filename = user.avatar_url.split('/images/')[1];
      if (filename != "default_picture.jpg") {
        fs.unlink(`images/${filename}`, (err) => {
          if (err) {
            // console.log("Erreur lors de la suppression de l'image: " + err);
          }
        });
      }
      // Puis on ajoute la nouvelle image au serveur et on met à jour la BDD
      const newAvatar = {
        avatar_url: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
      }
      User.update(newAvatar, {
        where: {
          id: req.body.userId
        }
      })
        .then(() => res.status(201).json({ message: "Avatar changé" }))
        .catch(error => res.status(500).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
}

//supprimer un utilisateur
exports.deleteUser = (req, res) => {
  User.findOne({
    where: {
      id: req.params.id
    }
  })
    .then(user => {
      // On supprime d'abord la photo de profil de l'utilisateur du serveur puis on le supprime de la BDD
      const filename = user.avatar_url.split('/images/')[1];
      if (filename != "default_picture.jpg") {
        fs.unlink(`images/${filename}`, (err) => {
          if (err) {
            // console.log("Erreur lors de la suppression de l'image: " + err);
          }
        });
      }
      User.destroy({ where: { id: req.params.id } })
        .then(() => res.status(200).json({ message: "Utilisateur supprimé" }))
        .catch(error => res.status(500).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
}