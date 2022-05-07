const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize) {
    const attributes = {
        media_id: { type: DataTypes.INTEGER, autoIncrement:true, primaryKey:true},
        media_name: { type: DataTypes.STRING(40), allowNull: false, unique:true },
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
        tableName: 'model_media'
    };

    return sequelize.define('Model_Media', attributes, options);
}