const { Sequelize, Model, DataTypes, Op } = require('sequelize')
const sequelize = new Sequelize('CPSD_Lab13', 'SA', 'Qwe12345', {
	host: '192.168.1.2',
	dialect: 'mssql',
	pool: {
		max: 10,
		min: 0
	}
})

class AUTH extends Model {}
AUTH.init(
  {
	username: {
	  type: DataTypes.STRING(20),
	  allowNull: false,
	  primaryKey: true,
	},
	password: {
	  type: DataTypes.STRING(100),
	},
  },
  {
	sequelize,
	modelName: 'AUTH',
	tableName: 'AUTH',
	timestamps: false,
  }
)
sequelize.sync().then(() => {
    console.log('models synched')
})

module.exports = {
    AUTH
}