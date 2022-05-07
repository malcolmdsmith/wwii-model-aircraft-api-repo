const { DataTypes } = require("sequelize");

module.exports = model;

function model(sequelize) {
  const attributes = {
    sponsor_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    sponsor_name: { type: DataTypes.STRING(200) },
    sponsor_website: { type: DataTypes.STRING(200) },
    sponsor_logo: { type: DataTypes.TEXT("long") },
    sponsor_logo_format: { type: DataTypes.STRING(5) },
    image_width: { type: DataTypes.INTEGER },
    image_height: { type: DataTypes.INTEGER },
  };

  const options = {
    defaultScope: {
      // exclude hash by default
      attributes: { exclude: ["hash"] },
    },
    scopes: {
      // include hash with this scope
      withHash: { attributes: {} },
    },
    tableName: "sponsors",
  };

  return sequelize.define("Sponsor", attributes, options);
}
