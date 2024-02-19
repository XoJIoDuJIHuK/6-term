const { Sequelize, Model, DataTypes } = require('sequelize')
const sequelize = new Sequelize('CPSD_Lab13', 'SA', 'Qwe12345', {
	host: '192.168.124.252',
	dialect: 'mssql',
})

class FACULTY extends Model {}
FACULTY.init(
  {
	FACULTY: {
	  type: DataTypes.STRING(10),
	  allowNull: false,
	  primaryKey: true,
	},
	FACULTY_NAME: {
	  type: DataTypes.STRING(50),
	},
  },
  {
	sequelize,
	modelName: 'FACULTY',
	tableName: 'FACULTY',
	timestamps: false,
  }
)

class PULPIT extends Model {}
PULPIT.init(
  {
	PULPIT: {
	  type: DataTypes.STRING(10),
	  allowNull: false,
	  primaryKey: true,
	},
	PULPIT_NAME: {
	  type: DataTypes.STRING(100),
	},
	FACULTY: {
	  type: DataTypes.STRING(10),
	  allowNull: false,
	},
  },
  {
	sequelize,
	modelName: 'PULPIT',
	tableName: 'PULPIT',
	timestamps: false,
  }
)

class TEACHER extends Model {}
TEACHER.init(
  {
	TEACHER: {
	  type: DataTypes.STRING(10),
	  allowNull: false,
	  primaryKey: true,
	},
	TEACHER_NAME: {
	  type: DataTypes.STRING(50),
	},
	PULPIT: {
	  type: DataTypes.STRING(10),
	  allowNull: false,
	},
  },
  {
	sequelize,
	modelName: 'TEACHER',
	tableName: 'TEACHER',
	timestamps: false,
  }
)
class SUBJECT extends Model {}
SUBJECT.init(
  {
	SUBJECT: {
	  type: DataTypes.STRING(10),
	  allowNull: false,
	  primaryKey: true,
	},
	SUBJECT_NAME: {
	  type: DataTypes.STRING(50),
	  allowNull: false,
	},
	PULPIT: {
	  type: DataTypes.STRING(10),
	  allowNull: false,
	},
  },
  {
	sequelize,
	modelName: 'SUBJECT',
	tableName: 'SUBJECT',
	timestamps: false,
  }
)
FACULTY.hasMany(PULPIT, {
	foreignKey: "FACULTY",
	as: "facultyToPulpit"
})
PULPIT.belongsTo(FACULTY, {
	foreignKey: 'FACULTY',
	as: 'pulpitToFaculty',
  })
PULPIT.hasMany(TEACHER, {
	foreignKey: "PULPIT",
	as: "pulpitToTeacher"
})
TEACHER.belongsTo(PULPIT, {
  foreignKey: 'PULPIT',
  as: 'teacherToPulpit',
})
PULPIT.hasMany(SUBJECT, {
	foreignKey: "PULPIT",
	as: "pulpitToSubject"
})
SUBJECT.belongsTo(PULPIT, {
  foreignKey: 'PULPIT',
  as: 'subjectToPulpit',
})

class AUDITORIUM_TYPE extends Model {}
AUDITORIUM_TYPE.init(
  {
	AUDITORIUM_TYPE: {
	  type: DataTypes.STRING(10),
	  allowNull: false,
	  primaryKey: true,
	},
	AUDITORIUM_TYPENAME: {
	  type: DataTypes.STRING(30),
	  allowNull: false,
	},
  },
  {
	sequelize,
	modelName: 'AUDITORIUM_TYPE',
	tableName: 'AUDITORIUM_TYPE',
	timestamps: false,
  }
)

class AUDITORIUM extends Model {}
AUDITORIUM.init(
  {
	AUDITORIUM: {
	  type: DataTypes.STRING(10),
	  allowNull: false,
	  primaryKey: true,
	},
	AUDITORIUM_NAME: {
	  type: DataTypes.STRING(200),
	},
	AUDITORIUM_CAPACITY: {
	  type: DataTypes.INTEGER,
	},
	AUDITORIUM_TYPE: {
	  type: DataTypes.STRING(10),
	  allowNull: false,
	},
  },
  {
	sequelize,
	modelName: 'AUDITORIUM',
	tableName: 'AUDITORIUM',
	timestamps: false,
  }
)
AUDITORIUM.belongsTo(AUDITORIUM_TYPE, {
  foreignKey: 'AUDITORIUM_TYPE',
  as: 'auditTypeToAudit',
})
AUDITORIUM_TYPE.hasMany(AUDITORIUM, {
	foreignKey: 'AUDITORIUM_TYPE',
	as: 'auditToAuditType',
  })

module.exports = {
  FACULTY,
  PULPIT,
  TEACHER,
  SUBJECT,
  AUDITORIUM_TYPE,
  AUDITORIUM,
}