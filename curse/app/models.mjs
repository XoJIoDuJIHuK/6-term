// const { Sequelize, Model, DataTypes, Op } = require('sequelize')
import { Sequelize, Model, DataTypes } from "sequelize"
const sequelize = new Sequelize('xd', 'SA', 'Qwerty123', {
	host: '192.168.75.131',
	dialect: 'mssql',
	pool: {
		max: 10,
		min: 0
	}
})

class PROLETARIAT extends Model {}
PROLETARIAT.init({
	id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true,
	},
	name: {
		type: DataTypes.STRING(70),
		allowNull: false,
	},
	password_hash: {
		type: DataTypes.STRING(60),
		allowNull: false,
	},
	is_admin: {
		type: DataTypes.CHAR(1),
		allowNull: false,
		get() {
			return this.getDataValue('is_admin') === 'Y'
		},
		set(value) {
			this.setDataValue('is_admin', value ? 'Y' : 'N')
		}
	},
	education_json: {
		allowNull: false,
		type: DataTypes.STRING(200),
		get() {
			return JSON.parse(this.getDataValue('education_json'))
		},
		set(value) {
			this.setDataValue('education_json', JSON.stringify(value))
		}
	},
	experience_json: {
		allowNull: false,
		type: DataTypes.STRING(500),
		get() {
			return JSON.parse(this.getDataValue('experience_json'))
		},
		set(value) {
			this.setDataValue('experience_json', JSON.stringify(value))
		}
	}
}, {
	sequelize,
	timestamps: false,
	modelName: 'PROLETARIAT',
	tableName: 'PROLETARIAT'
})

class CVS extends Model {}
CVS.init({
	id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true,
	},
	name: {
		type: DataTypes.STRING(30),
		allowNull: false,
	},
	applicant: {
		type: DataTypes.INTEGER,
		allowNull: false,
		references: {
			model: 'PROLETARIAT',
			key: 'id',
		},
	},
	skills_json: {
		allowNull: false,
		type: DataTypes.STRING(100),
		get() {
			return JSON.parse(this.getDataValue('skills_json'))
		},
		set(value) {
			this.setDataValue('skills_json', JSON.stringify(value))
		}
	}
}, {
	sequelize,
	timestamps: false,
	modelName: 'CVS',
	tableName: 'CVS'
})

class BOURGEOISIE extends Model {}
BOURGEOISIE.init({
	id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true,
	},
	name: {
		type: DataTypes.STRING(70),
		allowNull: false,
		unique: true,
	},
	password_hash: {
		type: DataTypes.STRING(60),
		allowNull: false
	}
}, {
	sequelize,
	timestamps: false,
	modelName: 'BOURGEOISIE',
	tableName: 'BOURGEOISIE'
})

class VACANCIES extends Model {}
VACANCIES.init({
	id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true,
	},
	name: {
		type: DataTypes.STRING(30),
		allowNull: false,
		unique: true,
	},
	company: {
		type: DataTypes.INTEGER,
		allowNull: false,
		references: {
			model: 'BOURGEOISIE',
			key: 'id',
		},
	},
	min_salary: {
		type: DataTypes.INTEGER,
		allowNull: false,
		validate: {
			min: 0,
		}
	},
	max_salary: {
		type: DataTypes.INTEGER,
		allowNull: false,
		validate: {
			min: 0,
		}
	},
	region: {
		type: DataTypes.STRING(20),
	},
	schedule: {
		type: DataTypes.INTEGER,
		allowNull: false,
		validate: {
			min: 1,
			max: 5
		}
	},
	experience: {
		type: DataTypes.INTEGER,
		allowNull: false,
		validate: {
			min: 1,
			max: 5
		}
	},
	min_hours_per_day: {
		type: DataTypes.INTEGER,
		allowNull: false,
		validate: {
			min: 1,
		}
	},
	max_hours_per_day: {
		type: DataTypes.INTEGER,
		allowNull: false,
		validate: {
			min: 1,
		}
	},
	description: {
		type: DataTypes.STRING(1000),
		allowNull: false,
	},
}, {
	sequelize,
	timestamps: false,
	modelName: 'VACANCIES',
	tableName: 'VACANCIES',
})

class RESPONSES extends Model {}
RESPONSES.init({
	id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true
	},
	cv: {
		type: DataTypes.INTEGER,
		allowNull: false,
		references: {
			model: 'CVS',
			key: 'id'
		}
	},
	status: {
		type: DataTypes.CHAR(1),
		allowNull: false,
		validate: {
			isIn: [['W', 'X', 'Y']]
		}
	}
}, {
	sequelize,
	timestamps: false,
	modelName: 'RESPONSES',
	tableName: 'RESPONSES'
})

class REVIEWS extends Model {}
REVIEWS.init({
	id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true
	},
	p_subject: {
		type: DataTypes.INTEGER,
		references: {
			model: 'PROLETARIAT',
			key: 'id'
		}
	},
	b_subject: {
		type: DataTypes.INTEGER,
		references: {
			model: 'BOURGEOISIE',
			key: 'id'
		}
	},
	b_object: {
		type: DataTypes.INTEGER,
		references: {
			model: 'PROLETARIAT',
			key: 'id'
		}
	},
	p_object: {
		type: DataTypes.INTEGER,
		references: {
			model: 'BOURGEOISIE',
			key: 'id'
		}
	},
	status: {
		type: DataTypes.STRING(100),
	},
	rating: {
		type: DataTypes.INTEGER,
		allowNull: false,
		validate: {
			min: 1,
			max: 5
		}
	}
}, {
	sequelize,
	timestamps: false,
	modelName: 'REVIEWS',
	tableName: 'REVIEWS'
})

class REGISTRATION_REQUESTS extends Model {}
REGISTRATION_REQUESTS.init({
	id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true
	},
	name: {
		type: DataTypes.STRING(70),
		allowNull: false
	},
	password_hash: {
		type: DataTypes.STRING(256),
		allowNull: false
	},
	proof: {
		type: DataTypes.STRING()
	}
}, {
	sequelize,
	timestamps: false,
	modelName: 'REGISTRATION_REQUESTS',
	tableName: 'REGISTRATION_REQUESTS'
})

class TOKENS extends Model {}
TOKENS.init({
	type: {
		type: DataTypes.CHAR(1),
		allowNull: false,
		validate: {
			isIn: [['A', 'R']]
		}
	},
	owner_p: {
		type: DataTypes.INTEGER,
		references: {
			model: 'PROLETARIAT',
			key: 'ID'
		}
	},
	owner_b: {
		type: DataTypes.INTEGER,
		references: {
			model: 'BOURGEOISIE',
			key: 'ID'
		}
	},
	value: {
		type: DataTypes.STRING(256),
		allowNull: false
	},
	expires: {
		type: DataTypes.DATE,
		allowNull: false
	}
}, {
	sequelize,
	timestamps: false,
	modelName: 'TOKENS',
	tableName: 'TOKENS'
})

sequelize.sync()

// module.exports = {
// 	PROLETARIAT,
// 	CVS,
// 	BOURGEOISIE,
// 	VACANCIES,
// 	RESPONSES,
// 	REVIEWS,
// 	REGISTRATION_REQUESTS,
// 	TOKENS
// }

export {
	PROLETARIAT,
	CVS,
	BOURGEOISIE,
	VACANCIES,
	RESPONSES,
	REVIEWS,
	REGISTRATION_REQUESTS,
	TOKENS
}