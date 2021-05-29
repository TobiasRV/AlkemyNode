'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Media extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Character, MediaGenres }) {
      this.hasMany( Character, { foreignKey: 'mediaId'});
      this.hasMany( MediaGenres, { foreignKey: 'mediaId'});
    }
  };
  Media.init({
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
    }
  }, {
    sequelize,
    modelName: 'Media',
  });
  return Media;
};
