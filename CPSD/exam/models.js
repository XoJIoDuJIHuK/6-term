const { Sequelize, Model, DataTypes } = require('sequelize');
const fs = require('fs');
const sequelize = new Sequelize(
    'exam', 'admin', 'admin', JSON.parse(fs.readFileSync('./config.json'))
);

class User extends Model {};
User.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    userName: {
        type: DataTypes.STRING,
        allowNull: false,
    }
}, {
    timestamps: false,
    sequelize,
    modelName: 'User',
    tableName: 'User'
});

sequelize.addHook('beforeCreate', () => {
    console.log('before create');
});
User.afterCreate('localAfterCreate', (user, options) => {
    console.log(`local ${user.userName} created`);
});
sequelize.sync({
    alter: true,
    // force: true
});

module.exports = {
    User
}