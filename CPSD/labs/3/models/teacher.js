const prisma = require('./prisma_init')

class Teacher {
	static async create(teacher, teacherName, pulpit) {
		return prisma.teacher.create({
			data: {
				TEACHER: teacher,
				TEACHER_NAME: teacherName,
				PULPIT: pulpit,
			},
		})
	}

	static async findByPk(teacher) {
		return prisma.teacher.findUnique({
			where: {
				TEACHER: teacher,
			},
		})
	}
	static async upsert(jsonData) {
		await prisma.teacher.upsert({
			where: {
				TEACHER: jsonData.TEACHER
			},
			update: jsonData,
			create: jsonData,
		})
	}
	static async delete(jsonData) {
		await prisma.teacher.delete({
			where: {
				TEACHER: jsonData.TEACHER
			}
		})
	}
	static async getAll() {
		return prisma.teacher.findMany()
	}
}

module.exports = Teacher;