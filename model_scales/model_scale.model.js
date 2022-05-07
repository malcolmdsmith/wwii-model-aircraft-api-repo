const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize) {
    const attributes = {
        scale_id: { type: DataTypes.INTEGER, autoIncrement:true, primaryKey:true},
        scale_range: { type: DataTypes.STRING(20), allowNull: false, unique:true },
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
        tableName: 'model_scales'
    };

    return sequelize.define('Model_Scale', attributes, options);
}