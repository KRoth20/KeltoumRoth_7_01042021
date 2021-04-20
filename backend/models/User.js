//structure de la table utilisateur
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    firstname: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        is: /[A-Z\-]{2,}/gi
      }
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        is: /[A-Z\-]{2,}/gi
      }
    },
    avatar_url: {
      type: DataTypes.STRING,
      defaultValue: 'http://localhost:3000/images/default_picture.jpg',
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    admin: {
      type: DataTypes.BOOLEAN,
      defaultValue: 0,
      allowNull: false
    }
  },
    {
      timestamps: false,
      tableName: 'User',
    }
  );
//relié au post 
  User.associate = function (models) {
    models.User.hasMany(models.Post, {
      foreignKeys: {
        allowNull: false
      }
    });
  };

  //le mot de passe ne reste pas attaché à l'utilisateur
  User.addScope('nopassword', {
    attributes: { exclude: ['password'] }
  });

  return User;
}