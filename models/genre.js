'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Genre extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate( { MediaGenres } ) {
      this.hasMany(MediaGenres, { foreignKey: 'genreId'});
    }
  };
  Genre.init({
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
    }
  }, {
    sequelize,
    modelName: 'Genre',
  });
  return Genre;
};
