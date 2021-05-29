'use strict';
module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.createTable('Genres', {
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
      image:{
        type:DataTypes.STRING,
        allowNull: false,
        validate:{
          notNull: { msg: 'Image can not be null'},
          notEmpty: { msg: 'Image can not be empty'},
        }
      },
      name: {
        type:DataTypes.STRING,
        allowNull: false,
        validate:{
          notNull: { msg: 'Name can not be null'},
          notEmpty: { msg: 'Name can not be empty'},
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
    await queryInterface.dropTable('Genres');
  }
};
