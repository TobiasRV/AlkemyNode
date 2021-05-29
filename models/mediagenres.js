'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class MediaGenres extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Media, Genre}) {
      this.belongsTo( Media, { foreignKey: 'mediaId'});
      this.belongsTo( Genre, { foreignKey: 'genreId'});
    }
  };
  MediaGenres.init({
    uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
  }, {
    sequelize,
    modelName: 'MediaGenres',
  });
  return MediaGenres;
};
