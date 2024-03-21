const { Sequelize, Model, DataTypes } = require('sequelize')
const sequelize = new Sequelize('SEPDB', 'SA', 'Qwe12345', {
	host: '127.0.0.1',
	dialect: 'mssql',
	pool: {
		max: 10,
		min: 0
	}
})

class ROLE extends Model {}
ROLE.init({
	ID: {
		type: DataTypes.INTEGER,
		primaryKey: true
	},
	NAME: {
		type: DataTypes.STRING(50),
		unique: true,
		allowNull: false
	}
}, {
	sequelize,
	modelName: 'ROLE',
	tableName: 'ROLE',
	timestamps: false
})

class STAFF extends Model {}
STAFF.init({
	NODE: {
		type: DataTypes.STRING,
		primaryKey: true,
		allowNull: false
	},
	NAME: {
		type: DataTypes.STRING(50),
		allowNull: false,
		unique: true,
	},
	ROLE: {
		type: DataTypes.INTEGER,
		allowNull: false,
		references: {
			model: 'ROLES',
			key: 'ID',
		},
	}
}, {
	sequelize,
	modelName: 'STAFF',
	tableName: 'STAFF',
	timestamps: false
})

class COMMITS extends Model {}
COMMITS.init({
	ID: {
		type: DataTypes.INTEGER,
		primaryKey: true
	},
	DEVELOPER: {
		type: DataTypes.INTEGER,
		references: {
			modelName: 'STAFF',
			key: 'ID'
		},
		allowNull: false
	},
	COMMIT_DATE: {
		type: DataTypes.DATE,
		allowNull: false
	}
}, {
	sequelize,
	modelName: 'COMMITS',
	tableName: 'COMMITS',
	timestamps: false
})

class TEST_DATA extends Model {}
TEST_DATA.init({
	ID: {
		type: DataTypes.INTEGER,
		primaryKey: true
	},
	GEO_DATA: {
		type: DataTypes.GEOMETRY,
	},
	JSON_DATA: {
		type: DataTypes.STRING(1000)
	}
}, {
	sequelize,
	modelName: 'TEST_DATA',
	tableName: 'TEST_DATA',
	timestamps: false
})

class TESTS extends Model {}
TESTS.init({
	ID: {
		type: DataTypes.INTEGER,
		primaryKey: true
	},
	TESTER: {
		type: DataTypes.INTEGER,
		allowNull: false
	},
    COMMIT_ID: {
		type: DataTypes.INTEGER,
		allowNull: false
	},
    DATA_ID: {
		type: DataTypes.INTEGER,
		allowNull: false
	},
    PASSED: {
		type: DataTypes.STRING(1),
		allowNull: false
	}
}, {
	sequelize,
	modelName: 'TESTS',
	tableName: 'TESTS',
	timestamps: false
})


function GenerateGeoData() {
	const minX = -180
	const maxX = 180
	const minY = -90
	const maxY = 90
  
	const randomLongitude = Math.random() * (maxX - minX) + minX
	const randomLatitude = Math.random() * (maxY - minY) + minY
  
	const randomGeometry = {
		type: 'Point',
		coordinates: [randomLongitude, randomLatitude],
	}
  
	return randomGeometry
}
function errorHandler(err) {
	console.log('error', err)
}


module.exports = {
	STAFF,
	ROLE,
	TEST_DATA,
	COMMITS,
	TESTS,
	sequelize,
	GetSubordinates: async function(principalName) {
		try {
			const ret = (await sequelize.query(`EXEC GetSubordinatesByName @parentName = N'${principalName}'`))[0].map(e => e.NAME)
			console.log(ret)
		} catch (err) {
			errorHandler(err)
		}
	},
	GenerateGeoData,
	InsertTestData: async function(jsonData) {
		try {
			const point = GenerateGeoData()
			await sequelize.query(`INSERT INTO TEST_DATA (GEO_DATA, JSON_DATA) VALUES (geometry::STGeomFromText('POINT (${point.coordinates[0]} ${point.coordinates[1]})', 0), '${jsonData}')`)
		} catch (err) {
			errorHandler(err)
		}
	}
}