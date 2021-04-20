const { Comment } = require("../models");

//logique de manipulation des commentaires
exports.commentPost = (req, res) => {
  Comment.create(req.body)
    .then(() => {
      res.status(201).json({ message: "Commentaire publié" });
    })
    .catch(error => {
      res.status(500).json({ error })
    })
}

exports.deleteComment = (req, res) => {
  Comment.destroy({
    where: {
      id: req.params.id
    }
  })
    .then(() => {
      res.status(200).json({ message: "Commentaire supprimé" });
    })
    .catch(error => {
      res.status(500).json({ error })
    })
}

exports.modifyComment = (req, res) => {
  Comment.update({ content: req.body.content },
    { where: { id: req.body.id } }
  )
    .then(() => {
      res.status(201).json({ message: "Commentaire modifié" });
    })
    .catch(error => {
      res.status(500).json({ error })
    })
}