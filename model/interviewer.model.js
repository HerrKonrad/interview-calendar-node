const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize')
const Availability = require("./availability.model")


const Interviewer = sequelize.define('Interviewer', {
    IDInterviewer: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    Name: {
        type: DataTypes.STRING,
        allowNull: false
    }
},{ timestamps: false,
    freezeTableName: true 
});

Availability.belongsTo(Interviewer);


module.exports = Interviewer;