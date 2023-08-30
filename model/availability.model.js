const { DataTypes, Sequelize } = require('sequelize');
const sequelize = require('../config/sequelize')

const Availability = sequelize.define('Availability', {
    IDAvailability: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    StartDateTime: {
        type: DataTypes.DATE,
        allowNull: false
    },
    EndDataTime: {
        type: DataTypes.DATE,
        allowNull: false
    }
}, { 
    timestamps: false,
    freezeTableName: true,
    tableName: 'Availability' // Nome da tabela no banco de dados

});

module.exports = Availability;