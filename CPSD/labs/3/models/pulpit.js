const prisma = require('./prisma_init')

class Pulpit {
  static async create(pulpit, pulpitName, faculty) {
		return prisma.pulpit.create({
			data: {
				PULPIT: pulpit,
				PULPIT_NAME: pulpitName,
				FACULTY: faculty,
			},
		})
	}

	static async findByPk(pulpit) {
		return prisma.pulpit.findUnique({
			where: {
				PULPIT: pulpit,
			},
		})
	}
	static async upsert(jsonData) {
		await prisma.pulpit.upsert({
			where: {
				PULPIT: jsonData.PULPIT
			},
			update: jsonData,
			create: jsonData,
		})
	}
	static async delete(jsonData) {
		await prisma.pulpit.delete({
			where: {
				PULPIT: jsonData.PULPIT
			}
		})
	}
	static async getAll() {
		return prisma.pulpit.findMany()
	}
}

module.exports = Pulpit;