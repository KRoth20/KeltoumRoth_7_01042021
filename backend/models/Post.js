//structure de la table post
module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define('Post', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    img_url: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    date_publication: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false
    },
    likes: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false
    },
    dislikes: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false
    }
  },
    {
      timestamps: false,
      tableName: 'Post'
    }
  );

  //relié à l'utilisateur pour pouvoir être supprimé en même temps
  Post.associate = function (models) {
    models.Post.belongsTo(models.User, {
      onDelete: "cascade",
      foreignerKey: {
        name: 'UserId',
        allowNull: false
      }
    });
    models.Post.hasMany(models.Like, {
      foreignKey: 'postId',
    })
    models.Post.hasMany(models.Comment, {
      foreignKey: 'postId',
    })
  };

//A chaque post serajouté l'horodatage
  Post.addScope('formatted_date', {
    attributes: {
      include: [[sequelize.fn('date_format', sequelize.col('date_publication'), '%Y-%m-%d %H:%i'), 'formatted_date']]
    }
  });

  return Post;
}