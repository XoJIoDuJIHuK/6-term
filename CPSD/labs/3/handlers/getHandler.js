const { faculty, auditoriumType } = require("../models/exports")
const prisma = require('../models/prisma_init')

async function getAuditoriumsByType(type) {
	const auditoriums = await prisma.auditorium.findMany({
		where: {
			AUDITORIUM_TYPE: type,
		},
		select: {
			AUDITORIUM: true,
		},
	})
  
	return {
		auditorium_type: type,
		Auditorium: auditoriums.map((auditorium) => ({
			auditorium: auditorium.AUDITORIUM,
		})),
	}
}
async function getSubjectsByFaculty(pk) {
	const facultyData = await prisma.faculty.findUnique({
		where: { FACULTY: pk },
		include: {
			pulpits: {
				include: { subjects: true },
			},
		},
	});

	return {
		faculty: facultyData.FACULTY,
		Pulpit: facultyData.pulpits.map((pulpit) => ({
			pulpit: pulpit.PULPIT,
			Subject: pulpit.subjects.map((subject) => ({
				subject_name: subject.SUBJECT_NAME,
			})),
		})),
	}
}

module.exports = {
	basicHandler: async function(table, urlparts) {
		if (urlparts.length === 0) {
			return table.getAll()
		} else {
			const [pk, checkWord] = urlparts
			switch (table) {
				case faculty:
					if (checkWord !== 'subjects') throw new Error('not found')
					return getSubjectsByFaculty(pk)
				case auditoriumType:
					if (checkWord !== 'auditoriums') throw new Error('not found')
					return getAuditoriumsByType(pk)
				default:
					throw new Error('not found')
			}
		}
	},
	auditoriumsWithComp1: function() {
		return prisma.auditorium.findMany({
			where: {
				AUDITORIUM: {
					endsWith: '-1'
				}
			}
		})
	},
	puplitsWithoutTeachers: function() {
		return prisma.pulpit.findMany({
			where: {
				teachers: {
					none: {},
				},
			},
		})
	},
	pulpitsWithVladimir: function() {
		return prisma.pulpit.findMany({
			where: {
				teachers: {
					some: {
						TEACHER_NAME: {
							contains: 'Vladimir'
						}
					}
				},
			},
		})
	},
	auditoriumsSameCount: function() {

	}
}