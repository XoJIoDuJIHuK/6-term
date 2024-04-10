// const { Sequelize, Model, DataTypes, Op } = require('sequelize')
import { Sequelize, Model, DataTypes } from "sequelize"
// const sequelize = new Sequelize('xd', 'SA', 'Qwerty123', {
// 	host: '192.168.75.131',
// 	dialect: 'mssql',
// 	pool: {
// 		max: 10,
// 		min: 0
// 	}
// })
const sequelize = new Sequelize('xd', 'postgres', 'mysecretpassword', {
	host: '192.168.75.131',
	dialect: 'postgres',
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
	login: {
		type: DataTypes.STRING(20),
		allowNull: false,
		unique: true
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
	},
	email: {
		type: DataTypes.STRING(30),
		unique: true
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
	login: {
		type: DataTypes.STRING(20),
		allowNull: false,
		unique: true
	},
	name: {
		type: DataTypes.STRING(70),
		allowNull: false,
		unique: true,
	},
	password_hash: {
		type: DataTypes.STRING(60),
		allowNull: false
	},
	approved: {
		type: DataTypes.CHAR(1),
		allowNull: false,
		get() {
			return this.getDataValue('approved') === 'Y'
		},
		set(value) {
			this.setDataValue('approved', value ? 'Y' : 'N')
		}
	},
	description: {
		type: DataTypes.STRING(2000)
	},
	email: {
		type: DataTypes.STRING(30),
		unique: true
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
	release_date: {
		type: DataTypes.DATEONLY,
		allowNull: false,
	},
	company: {
		type: DataTypes.INTEGER,
		allowNull: false,
		references: {
			model: 'BOURGEOISIE',
			key: 'id',
		},
	},
	active: {
		type: DataTypes.CHAR(1),
		allowNull: false,
		get() {
			return this.getDataValue('active') === 'Y';
		},
		set(value) {
			this.setDataValue('active', value ? 'Y' : 'N');
		}
	},
	min_salary: {
		type: DataTypes.INTEGER,
		validate: {
			min: 0,
		}
	},
	max_salary: {
		type: DataTypes.INTEGER,
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
			max: 4
		}
	},
	min_hours_per_day: {
		type: DataTypes.INTEGER,
		validate: {
			min: 1,
		}
	},
	max_hours_per_day: {
		type: DataTypes.INTEGER,
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
	vacancy: {
		type: DataTypes.INTEGER,
		allowNull: false,
		references: {
			model: 'VACANCIES',
			key: 'id'
		}
	},
	status: {
		type: DataTypes.CHAR(1),
		allowNull: false,
		validate: {
			isIn: [['W', 'X', 'Y']]//wait, no, yes
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
	text: {
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

class PROMOTION_REQUESTS extends Model {}
PROMOTION_REQUESTS.init({
	id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true
	},
	company_id: {
		type: DataTypes.INTEGER,
		allowNull: false,
		references: {
			model: 'BOURGEOISIE',
			key: 'id'
		}
	},
	proof: {
		type: DataTypes.STRING(4000000)
	}
}, {
	sequelize,
	timestamps: false,
	modelName: 'PROMOTION_REQUESTS',
	tableName: 'PROMOTION_REQUESTS'
});

class ACCOUT_DROP_REQUESTS extends Model {}
ACCOUT_DROP_REQUESTS.init({
	id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true
	},
	isCompany: {
		type: DataTypes.INTEGER,
		allowNull: false,
		get() {
			return ACCOUT_DROP_REQUESTS.getDataValue('is_company') === 'Y';
		},
		set(value) {
			this.setDataValue('is_company', value ? 'Y' : 'N');
		}
	},
	account_id: {
		type: DataTypes.INTEGER,
		allowNull: false
	},
	commentary: {
		type: DataTypes.STRING()
	}
}, {
	sequelize,
	timestamps: false,
	modelName: 'ACCOUT_DROP_REQUESTS',
	tableName: 'ACCOUT_DROP_REQUESTS'
});

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
			key: 'id'
		}
	},
	owner_b: {
		type: DataTypes.INTEGER,
		references: {
			model: 'BOURGEOISIE',
			key: 'id'
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

sequelize.sync({ 
	alter: true
	// force: true 
})
export {
	PROLETARIAT,
	CVS,
	BOURGEOISIE,
	VACANCIES,
	RESPONSES,
	REVIEWS,
	PROMOTION_REQUESTS,
	ACCOUT_DROP_REQUESTS,
	TOKENS
}