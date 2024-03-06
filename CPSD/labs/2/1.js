const express = require('express')
const fs = require('fs')
const { FACULTY, PULPIT, SUBJECT, TEACHER, AUDITORIUM, AUDITORIUM_TYPE, task6 } = require('./models.js')

const app = express();
app.use(express.json())

function getTable(tableName) {
	switch (tableName) {
		case 'faculties':
			return FACULTY
		case 'pulpits':
			return PULPIT
		case 'subjects':
			return SUBJECT
		case 'teachers':
			return TEACHER
		case 'auditoriumtypes':
			return AUDITORIUM_TYPE
		case 'auditorium':
			return AUDITORIUM
		default:
			throw new Error("no such model")
	}
}

function getHandler(table, urlParts, response) {
	if (urlParts.length === 0) {
		table.findAll().then(data => {
			response.json(data)
		}).catch(err => {
			response.status(500)
			response.json(err)
		})
	} else if (urlParts.length === 2) {

		switch (table) {
			case FACULTY: {
				const [facultyId, subjects] = urlParts
				if (subjects !== 'subjects') {
					response.status(404)
				} else {
					sendSubjectsOfFaculty(facultyId)
				}
				break
			}
			case AUDITORIUM_TYPE: {
				const [typeCode, auditoriums] = urlParts
				if (auditoriums !== 'auditoriums') {
					response.status(404)
				} else {
					sendAuditoriumOfType(typeCode)
				}
				break
			}
		}
	} else {
		response.status(404)
	}

	function handleErrors(err) {
		response.status(500)
		response.json(err)
	}
	function sendSubjectsOfFaculty(facultyId) {
		FACULTY.findOne({
			where: { FACULTY: facultyId }
		}).then(async (foundFaculty) => {
			if (!foundFaculty) {
				response.status(404)
				return
			}
			SUBJECT.findAll({
				include: [{
					model: PULPIT,
					as: 'subjectToPulpit',
					include: [{
						model: FACULTY,
						as: 'pulpitToFaculty',
						where: {
							FACULTY: foundFaculty.FACULTY
						}
					}]
				}]
			}).then(data => {
				response.json(data)
			}).catch(handleErrors)
		}).catch(handleErrors)
	}
	function sendAuditoriumOfType(typeCode) {
		AUDITORIUM_TYPE.findByPk(typeCode).then(foundType => {
			if (!foundType) {
				response.status(404)
				return
			}
			AUDITORIUM.findAll({
				include: [{
					model: AUDITORIUM_TYPE,
					as: "auditToAuditType",
					where: { AUDITORIUM_TYPE: foundType.AUDITORIUM_TYPE }
				}]
			}).then(data => {
				response.json(data)
			}).catch(handleErrors)
		}).catch(handleErrors)
	}
}

async function postHandler(table, request, response) {
	const data = request.body
	await table.create(data)
	response.json(data)
}

async function putHandler(table, request, response) {
	const data = request.body
	const primaryKeyField = table.primaryKeyField
	const where = {}
	where[primaryKeyField] = data[primaryKeyField]
	await table.update(data, {where})
	response.json(data)
}

async function deleteHandler(table, request, response) {
	const pk = request.body[table.primaryKeyField]
	const deletedData = (await table.findByPk(pk)).dataValues
	await table.destroy({
		where: {
			[table.primaryKeyField]: pk
		}
	})
	response.json(deletedData)
}

app.all('/', (request, response) => {
	response.contentType('.html')
	response.send(fs.readFileSync('./3.html'))
})

app.all('/api/*', async (request, response) => {
	const clearedUrl = decodeURIComponent(request.originalUrl.split('?')[0])
	const urlParts = clearedUrl.split('/').slice(1).filter(e => e !== '')
	if (urlParts[0] !== 'api') {
		response.status(404)
		return
	}
	try {
		const table = getTable(urlParts[1])
		switch (request.method) {
			case 'GET': {
				getHandler(table, urlParts.slice(2), response)
				break
			}
			case 'POST': {
				if (urlParts.length !== 2) {
					throw new Error("invalid url")
				}
				await postHandler(table, request, response)
				break
			}
			case 'PUT': {
				if (urlParts.length !== 2) {
					throw new Error("invalid url")
				}
				await putHandler(table, request, response)
				break
			}
			case 'DELETE': {
				if (urlParts.length > 3) {
					throw new Error("invalid url")
				}
				deleteHandler(table, request, response)
				break
			}
		}
	} catch(err) {
		response.status(404)
		response.json(err)
	}
})

app.listen(3000, async () => {
	console.log('Server is running on port 3000')

	console.log('task 4 - scope')
	AUDITORIUM.scope('capacityRange').findAll().then(auditoriums => {
		console.log(auditoriums)
	}).catch(err => {
		console.error('Ошибка при выполнении запроса:', err)
	})

	console.log('task 5 - hooks')
	try {
		await FACULTY.destroy({
			where: {
				FACULTY: 'ФКП'
			}
		})
		const faculty = await FACULTY.create({ FACULTY: 'ФКП', FACULTY_NAME: 'Факультет приколов' });
		console.log('Создан факультет:', faculty.FACULTY_NAME);
	} catch (error) {
		console.error('Ошибка при создании факультета:', error);
	}

	await task6();
})