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
	tableName: 'PROLETARIAT',
});

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
			onDelete: 'CASCADE'
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
	tableName: 'CVS',
});

PROLETARIAT.hasMany(CVS, { foreignKey: 'applicant', sourceKey: 'id' });
CVS.belongsTo(PROLETARIAT, { foreignKey: 'applicant', targetKey: 'id' });

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
	tableName: 'BOURGEOISIE',
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
			onDelete: 'CASCADE'
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
});

BOURGEOISIE.hasMany(VACANCIES,   { foreignKey: 'company', sourceKey: 'id' });
VACANCIES.belongsTo(BOURGEOISIE, { foreignKey: 'company', targetKey: 'id' });

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
			key: 'id',
			onDelete: 'CASCADE'
		}
	},
	vacancy: {
		type: DataTypes.INTEGER,
		allowNull: false,
		references: {
			model: 'VACANCIES',
			key: 'id',
			onDelete: 'CASCADE'
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
});

RESPONSES.hasOne(VACANCIES,    { foreignKey: 'id', sourceKey: 'vacancy' });
VACANCIES.belongsTo(RESPONSES, { foreignKey: 'id', targetKey: 'vacancy' });
RESPONSES.hasOne(CVS,    { foreignKey: 'id', sourceKey: 'cv' });
CVS.belongsTo(RESPONSES, { foreignKey: 'id', targetKey: 'cv' });

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
			key: 'id',
			onDelete: 'CASCADE'
		}
	},
	b_subject: {
		type: DataTypes.INTEGER,
		references: {
			model: 'BOURGEOISIE',
			key: 'id',
			onDelete: 'CASCADE'
		}
	},
	b_object: {
		type: DataTypes.INTEGER,
		references: {
			model: 'BOURGEOISIE',
			key: 'id',
			onDelete: 'CASCADE'
		}
	},
	p_object: {
		type: DataTypes.INTEGER,
		references: {
			model: 'PROLETARIAT',
			key: 'id',
			onDelete: 'CASCADE'
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
	},
	reported: {
		type: DataTypes.CHAR(1),
		allowNull: false,
		defaultValue: 'N',
		validate: { isIn: [['Y', 'N']] }
	}
}, {
	sequelize,
	timestamps: false,
	modelName: 'REVIEWS',
	tableName: 'REVIEWS'
})

REVIEWS.belongsTo(PROLETARIAT, { foreignKey: 'p_object' });
REVIEWS.belongsTo(PROLETARIAT, { foreignKey: 'p_subject' });
REVIEWS.belongsTo(BOURGEOISIE, { foreignKey: 'b_object' });
REVIEWS.belongsTo(BOURGEOISIE, { foreignKey: 'b_subject' });


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
		type: DataTypes.STRING(1000000)
	}
}, {
	sequelize,
	timestamps: false,
	modelName: 'PROMOTION_REQUESTS',
	tableName: 'PROMOTION_REQUESTS'
});

PROMOTION_REQUESTS.hasOne(BOURGEOISIE,    { foreignKey: 'id', sourceKey: 'company_id' });
BOURGEOISIE.belongsTo(PROMOTION_REQUESTS, { foreignKey: 'id', targetKey: 'company_id' });

class ACCOUNT_DROP_REQUESTS extends Model {}
ACCOUNT_DROP_REQUESTS.init({
	id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true
	},
	isCompany: {
		type: DataTypes.CHAR(1),
		allowNull: false,
		validate: { isIn: [['Y', 'N']] }
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
	modelName: 'ACCOUNT_DROP_REQUESTS',
	tableName: 'ACCOUNT_DROP_REQUESTS'
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
			key: 'id',
			onDelete: 'CASCADE'
		}
	},
	owner_b: {
		type: DataTypes.INTEGER,
		references: {
			model: 'BOURGEOISIE',
			key: 'id',
			onDelete: 'CASCADE'
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

async function GetRating(userType, userId) {
	const result = (await sequelize.query('select GetAverageRating(:userType, :userId);', { replacements: { userType, userId } }))
		[0][0].getaveragerating;
	return result;
}

class BLACK_LIST extends Model {};
BLACK_LIST.init({
	id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true
	},
	p_subject: {
		type: DataTypes.INTEGER,
		references: {
			model: 'PROLETARIAT',
			key: 'id',
			onDelete: 'CASCADE'
		}
	},
	p_object: {
		type: DataTypes.INTEGER,
		references: {
			model: 'PROLETARIAT',
			key: 'id',
			onDelete: 'CASCADE'
		}
	},
	b_subject: {
		type: DataTypes.INTEGER,
		references: {
			model: 'BOURGEOISIE',
			key: 'id',
			onDelete: 'CASCADE'
		}
	},
	b_object: {
		type: DataTypes.INTEGER,
		references: {
			model: 'BOURGEOISIE',
			key: 'id',
			onDelete: 'CASCADE'
		}
	}
}, {
	timestamps: false,
	sequelize,
	modelName: 'BLACK_LIST',
	tableName: 'BLACK_LIST'
})

sequelize.sync({ 
	// alter: true,
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
	ACCOUNT_DROP_REQUESTS,
	TOKENS,
	BLACK_LIST,
	GetRating,
	sequelize
}