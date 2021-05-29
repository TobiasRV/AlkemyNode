'use strict';
module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.createTable('Characters', {
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
      name: {
        type:DataTypes.STRING,
        allowNull: false,
        validate:{
          notNull: { msg: 'Name can not be null'},
          notEmpty: { msg: 'Name can not be empty'},
        }
      },
      age: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate:{
          notNull: { msg: 'Age can not be null'},
          notEmpty: { msg: 'Age can not be empty'},
        }
      },
      weight: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate:{
          notNull: { msg: 'Weight can not be null'},
          notEmpty: { msg: 'Weight can not be empty'},
        }
      },
      story: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate:{
          notNull: { msg: 'Story can not be null'},
          notEmpty: { msg: 'Story can not be empty'},
        }
      },
      mediaId: {
        type: DataTypes.INTEGER,
        allowNull: false
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
    await queryInterface.dropTable('Characters');
  }
};
