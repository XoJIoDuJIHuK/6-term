const prisma = require('./prisma_init')

class Faculty {
	static async create(faculty, facultyName) {
		return prisma.faculty.create({
			data: {
				FACULTY: faculty,
				FACULTY_NAME: facultyName,
			},
		})
	}

	static async findByPk(faculty) {
		return prisma.faculty.findUnique({
			where: {
				FACULTY: faculty,
			},
		})
	}
	static async upsert(jsonData) {
		await prisma.faculty.upsert({
			where: {
				FACULTY: jsonData.FACULTY
			},
			update: jsonData,
			create: jsonData,
		})
	}
	static async delete(jsonData) {
		await prisma.faculty.delete({
			where: {
				FACULTY: jsonData.FACULTY
			}
		})
	}
	static async getAll() {
		return prisma.faculty.findMany()
	}
}

module.exports = Faculty