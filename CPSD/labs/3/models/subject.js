const prisma = require('./prisma_init')

class Subject {
	static async create(subject, subjectName, pulpit) {
		return prisma.subject.create({
			data: {
				SUBJECT: subject,
				SUBJECT_NAME: subjectName,
				PULPIT: pulpit,
			},
		})
	}

	static async findByPk(subject) {
		return prisma.subject.findUnique({
			where: {
				SUBJECT: subject,
			},
		})
	}
	static async upsert(jsonData) {
		await prisma.subject.upsert({
			where: {
				SUBJECT: jsonData.SUBJECT
			},
			update: jsonData,
			create: jsonData,
		})
	}
	static async delete(jsonData) {
		await prisma.subject.delete({
			where: {
				SUBJECT: jsonData.SUBJECT
			}
		})
	}
	static async getAll() {
		return prisma.subject.findMany()
	}
}

module.exports = Subject;