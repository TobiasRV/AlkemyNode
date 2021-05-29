'use strict';
module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.createTable('Media', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4
      },
      image: {
        type:DataTypes.STRING,
        allowNull: false,
        validate:{
          notNull: { msg: 'Image can not be null'},
          notEmpty: { msg: 'Image can not be empty'},
        }
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate:{
          notNull: { msg: 'Title can not be null'},
          notEmpty: { msg: 'Title can not be empty'},
        }
      },
      creationDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        validate:{
          notNull: { msg: 'Creating date can not be null'},
          notEmpty: { msg: 'Creating date can not be empty'},
        }
      },
      score: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate:{
          notNull: { msg: 'Score can not be null'},
          notEmpty: { msg: 'Score can not be empty'},
        }
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE
      }
    });
  },
  down: async (queryInterface, DataTypes) => {
    await queryInterface.dropTable('Media');
  }
};
