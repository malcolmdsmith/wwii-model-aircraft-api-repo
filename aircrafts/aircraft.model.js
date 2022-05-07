const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize) {
    const attributes = {
        aircraft_id: { type: DataTypes.INTEGER, autoIncrement:true, primaryKey:true},
        aircraft_name: { type: DataTypes.STRING(100), allowNull: false },
        year_of_manufacture: { type: DataTypes.INTEGER, allowNull: false },
        country_of_manufacturer: { type: DataTypes.STRING(45), allowNull: false },
        operators_during_wwii: { type: DataTypes.STRING(200), allowNull: false },
        primary_group_id: { type: DataTypes.INTEGER, allowNull: false },
        wikilink: { type: DataTypes.STRING(1000), allowNull:true },
        owner_id: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
    };

    const options = {
        defaultScope: {
            // exclude hash by default
            attributes: { exclude: ['hash'] }
        },
        scopes: {
            // include hash with this scope
            withHash: { attributes: {}, }
        },
        tableName: 'aircrafts'
    };

    return sequelize.define('Aircraft', attributes, options);
}