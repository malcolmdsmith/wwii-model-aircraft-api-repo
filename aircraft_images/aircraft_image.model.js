const { DataTypes } = require("sequelize");

module.exports = model;

function model(sequelize) {
  const attributes = {
    image_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    aircraft_id: { type: DataTypes.INTEGER },
    aircraft_image: { type: DataTypes.TEXT("long"), allowNull: false },
    aircraft_image_format: { type: DataTypes.STRING(5) },
    show_main_image: { type: DataTypes.TINYINT, allowNull: false },
    image_width: { type: DataTypes.INTEGER },
    image_height: { type: DataTypes.INTEGER },
    owner_id: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
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
    tableName: "aircraftimages",
  };

  return sequelize.define("AircraftImage", attributes, options);
}
