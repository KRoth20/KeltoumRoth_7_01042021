'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      id: {
        type: Sequelize.INTEGER
      },
      firstname: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          is: /[A-Z\-]{2,}/gi
        }
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          is: /[A-Z\-]{2,}/gi
        }
      },

      avatar_url: {
        type: Sequelize.STRING,
        defaultValue: 'http://localhost:3000/images/default_picture.jpg',
      allowNull: false
      },

      email: {
        type: Sequelize.STRING,
        allowNull: false,
      unique: true,
      },

      password: {
        type: Sequelize.STRING,
        allowNull: false
      },

      admin: {
        type: Sequelize.BOOLEAN,
        defaultValue: 0,
      allowNull: false
      },

      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },

      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Users');
  }


};