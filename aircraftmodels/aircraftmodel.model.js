const { DataTypes } = require("sequelize");

module.exports = model;

function model(sequelize) {
  const attributes = {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    aircraft_id: { type: DataTypes.INTEGER, allowNull: false },
    manufacturer_id: { type: DataTypes.INTEGER, allowNull: false },
    media_id: { type: DataTypes.INTEGER, allowNull: false },
    scale_id: { type: DataTypes.INTEGER, allowNull: false },
    kit_mold: { type: DataTypes.STRING(100), allowNull: false },
    kit_no: { type: DataTypes.STRING(100), allowNull: false },
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
    tableName: "aircraftmodels",
  };

  return sequelize.define("AircraftModel", attributes, options);
}
