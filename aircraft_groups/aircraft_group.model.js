const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize) {
    const attributes = {
        group_id: { type: DataTypes.INTEGER, autoIncrement:true, primaryKey:true},
        group_name: { type: DataTypes.STRING(45), allowNull: false, unique:true },
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
        tableName: 'aircraft_groups'
    };

    return sequelize.define('Aircraft_Group', attributes, options);
}