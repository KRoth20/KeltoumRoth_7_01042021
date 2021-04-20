const { Post, User, Like, Comment } = require("../models");
const { Op } = require("sequelize");
const fs = require('fs');

//logique de manipulation des posts
exports.getPosts = (req, res) => {
  
// Cherche tous les posts en incluant les utilisateurs correspondants, récupère les likes ainsi que les commentaires
  Post.scope('formatted_date').findAll({
    include: [{ model: User, as: 'User', attributes: ['firstname', 'name', 'avatar_url'] },
    { model: Like },
    {
      model: Comment,
      include: [{ model: User, attributes: ['firstname', 'name', 'avatar_url'] }],
    }
    ],
// dans l'ordre décroissant des dates
    order: [
      ['date_publication', 'DESC'],
      [Comment, 'createdAt', 'DESC']
    ]
  })
    .then(posts => {
      res.status(200).json(posts);
    })
    .catch(error => {
      res.status(500).json({ error });
    });
}

//création d'un post
exports.createPost = (req, res) => {
  const newPost = {
    img_url: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
    UserId: req.body.userId
  }
  Post.create(newPost)
    .then(post => res.status(201).json(post))
    .catch(error => res.status(500).json({ error }));
}

//suppression d'un post
exports.deletePost = (req, res) => {
  Post.findOne({ where: { id: req.params.id } })
    .then(post => {
      // On supprime l'image du post du serveur puis on supprime le post
      const filename = post.img_url.split('/images/')[1];
      fs.unlink(`images/${filename}`, () => {
        Post.destroy({ where: { id: req.params.id } })
          .then(() => res.status(200).json({ message: 'Post supprimé !' }))
          .catch(error => res.status(500).json({ error }));
      })
    })
    .catch(error => res.status(500).json({ error }));
}

//création d'un like
exports.likePost = (req, res) => {
  Like.findOne({
    where: {
      userId: req.body.userId,
      postId: req.body.postId
    }
  })
    .then(response => {
      //1er cas de figure 
      // Si l'utilisateur n'a aucun like ou dislike sur le post
      if (response == null) {
        // et qu'il clique sur like
        if (req.body.likeValue == 1) {
          Like.create({ liked: req.body.likeValue, postId: req.body.postId, userId: req.body.userId });
          Post.increment({ likes: 1 }, { where: { id: req.body.postId } })
          res.status(201).json({ message: 'Like ajouté au post' })
        }
        // et qu'il clique sur dislike
        else if (req.body.likeValue == -1) {
          Like.create({ liked: req.body.likeValue, postId: req.body.postId, userId: req.body.userId });
          Post.increment({ dislikes: 1 }, { where: { id: req.body.postId } })
          res.status(201).json({ message: 'Dislike ajouté au post' })
        }
      }
      //2e cas de figure 
        // Si l'utilsateur a déjà liké le post
        else if (response.dataValues.liked == 1) {
        // et clique sur dislike
        if (req.body.likeValue == -1) {
          Like.update({ liked: -1 }, {
            where: {
              [Op.and]: [{ postId: req.body.postId }, { userId: req.body.userId }]
            }
          })
          Post.increment({ dislikes: 1 }, { where: { id: req.body.postId } });
          Post.decrement({ likes: 1 }, { where: { id: req.body.postId } });
          res.status(201).json({ message: 'Like retiré et dislike ajouté au post' })
        }
        // et clique sur like
        else {
          Like.destroy({
            where: {
              [Op.and]: [{ postId: req.body.postId }, { userId: req.body.userId }]
            }
          });
          Post.decrement({ likes: 1 }, { where: { id: req.body.postId } });
          res.status(201).json({ message: 'Like retiré du post' })
        }
      }
      //3e cas de figure 
      // Si l'utilisateur a déjà disliké le post
      else if (response.dataValues.liked == -1) {
        // et clique sur like
        if (req.body.likeValue == 1) {
          Like.update({ liked: 1 }, {
            where: {
              [Op.and]: [{ postId: req.body.postId }, { userId: req.body.userId }]
            }
          })
          Post.decrement({ dislikes: 1 }, { where: { id: req.body.postId } });
          Post.increment({ likes: 1 }, { where: { id: req.body.postId } });
          res.status(201).json({ message: 'Dislike retiré et like ajouté au post' })
        }
        // et clique sur dislike
        else {
          Like.destroy({
            where: {
              [Op.and]: [{ postId: req.body.postId }, { userId: req.body.userId }]
            }
          });
          Post.decrement({ dislikes: 1 }, { where: { id: req.body.postId } });
          res.status(201).json({ message: 'Dislike retiré du post' })
        }
      }
    })
    .catch(error => res.status(500).json({ error }));
}