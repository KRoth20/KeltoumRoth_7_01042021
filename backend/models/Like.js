//structure de la table Like
module.exports = (sequelize, DataTypes) => {
  const Like = sequelize.define('Like', {
    liked: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    postId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Post',
        key: 'id'
      }
    },
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'User',
        key: 'id'
      }
    }
  },
    {
      timestamps: false,
      tableName: 'Likes'
    }
  );

  //relié au post et à l'utilisateur pour empêcher le like en même temps que le dislike
  Like.associate = function (models) {
    models.User.belongsToMany(models.Post, {
      through: models.Like,
      foreignKey: 'userId',
      otherKey: 'postId',
    });

    models.Post.belongsToMany(models.User, {
      through: models.Like,
      foreignKey: 'postId',
      otherKey: 'userId',
    });

    models.Like.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user',
    });

    models.Like.belongsTo(models.Post, {
      foreignKey: 'postId',
      as: 'post',
    });
  };

  return Like;
}