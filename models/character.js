'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Character extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Media }) {
      this.belongsTo(Media, { foreignKey: 'mediaId'})
    }
  };
  Character.init({
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
    }
  }, {
    sequelize,
    modelName: 'Character',
  });
  return Character;
};
