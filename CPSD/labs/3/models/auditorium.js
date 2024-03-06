const prisma = require('./prisma_init')

class Auditorium {
	static async create(auditorium, auditoriumName, auditoriumCapacity, auditoriumType) {
		return prisma.auditorium.create({
			data: {
				AUDITORIUM: auditorium,
				AUDITORIUM_NAME: auditoriumName,
				AUDITORIUM_CAPACITY: auditoriumCapacity,
				AUDITORIUM_TYPE: auditoriumType,
			},
		})
	}

	static async findByPk(auditorium) {
		return prisma.auditorium.findUnique({
			where: {
				AUDITORIUM: auditorium,
			},
		})
	}
	static async upsert(jsonData) {
		await prisma.auditorium.upsert({
			where: {
				AUDITORIUM: jsonData.AUDITORIUM
			},
			update: jsonData,
			create: jsonData,
		})
	}
	static async delete(jsonData) {
		await prisma.auditorium.delete({
			where: {
				AUDITORIUM: jsonData.AUDITORIUM
			}
		})
	}
	static async getAll() {
		return prisma.auditorium.findMany()
	}
}

module.exports = Auditorium;