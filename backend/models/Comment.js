//structure de la table commentaire
module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define('Comment', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    postId: {
      type: DataTypes.INTEGER,
    },
    userId: {
      type: DataTypes.INTEGER,
    }
  },
    {
      tableName: 'Comment'
    }
  );

//relié à l'utilisateur pour pouvoir être supprimé en même temps
  Comment.associate = function (models) {
    models.Comment.belongsTo(models.User, {
      onDelete: "cascade",
      foreignKey: 'userId'
    })
  };

  return Comment;
}
