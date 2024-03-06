const prisma = require('./prisma_init')

class AuditoriumType {
	static async create(auditoriumType, auditoriumTypeName) {
		return prisma.auditoriumType.create({
			data: {
				AUDITORIUM_TYPE: auditoriumType,
				AUDITORIUM_TYPENAME: auditoriumTypeName,
			},
		})
	}

	static async findByPk(auditoriumType) {
		return prisma.auditoriumType.findUnique({
			where: {
				AUDITORIUM_TYPE: auditoriumType,
			},
		})
	}
	static async upsert(jsonData) {
		await prisma.auditoriumType.upsert({
			where: {
				AUDITORIUM_TYPE: jsonData.AUDITORIUM_TYPE
			},
			update: jsonData,
			create: jsonData,
		})
	}
	static async delete(jsonData) {
		await prisma.auditoriumType.delete({
			where: {
				AUDITORIUM_TYPE: jsonData.AUDITORIUM_TYPE
			}
		})
	}
	static async getAll() {
		return prisma.auditoriumType.findMany()
	}
}

module.exports = AuditoriumType;