const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize) {
    const attributes = {
        manufacturer_id: { type: DataTypes.INTEGER, autoIncrement:true, primaryKey:true},
        manufacturer_name: { type: DataTypes.STRING(60), allowNull: false },
        manufacturer_fullname: { type: DataTypes.STRING(100), allowNull: false },
        country_of_origin: { type: DataTypes.STRING(45), allowNull: false },
        related_brands_logos: { type: DataTypes.STRING(100), allowNull: true, defaultValue: "" },
        kitmolds: { type: DataTypes.STRING(200), allowNull: true, defaultValue: "" },
        years_active: { type: DataTypes.STRING(50), allowNull: true, defaultValue: "" },
        website: { type: DataTypes.STRING(200), allowNull: true, defaultValue: "" },
        owner_id: { type: DataTypes.INTEGER, allowNull:false, defaultValue: 1}
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
        tableName: 'manufacturers'
    };

    return sequelize.define('Manufacturer', attributes, options);
}