const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'database.sqlite'
});

const Rock = sequelize.define('Rock', {
    uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    found: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    timestamp: {
        type: DataTypes.DATE,
        allowNull: true,
    },
});

sequelize.sync();

module.exports = { sequelize, Rock };
