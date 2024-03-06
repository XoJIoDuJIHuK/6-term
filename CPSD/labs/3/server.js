const { faculty, pulpit, subject, teacher, auditorium, auditoriumType } = require('./models/exports')
const getHandlers = require('./handlers/getHandler')
const postHandlers = require('./handlers/postHandler')
const putHandlers = require('./handlers/putHandler')
const deleteHandlers = require('./handlers/deleteHandler')
const express = require('express')
const fs = require('fs')
const prisma = require('./models/prisma_init')

const app = express()
app.use(express.json())

function getTable(tableName) {
	switch (tableName) {
		case 'faculties':
			return faculty
		case 'pulpits':
			return pulpit
		case 'subjects':
			return subject
		case 'teachers':
			return teacher
		case 'auditoriums':
			return auditorium
		case 'auditoriumtypes':
			return auditoriumType
		default:
			throw new Error('no such model')
	}
}
async function writeJson(request, response, handler, table, urlparts) {
	const data = await handler(table, urlparts, request)
	response.contentType('json').send(JSON.stringify(data))
}
function getUrlParts(url) {
	return url.split('/').filter(e => e !== '').slice(1)
}
app.all('/', async (request, response) => {
	const queryParams = request.query
	const page = +queryParams.page || 1
	const pulpitsOnPage = 10
	const pulpitsCount = await prisma.pulpit.count()
	const totalPages = Math.ceil(pulpitsCount / pulpitsOnPage)
	if (page > totalPages || page < 1) {
		response.status(404).send()
		return
	}
	const pulpits = await prisma.pulpit.findMany({
		skip: (page - 1) * pulpitsOnPage,
		take: pulpitsOnPage
	})
	const htmlPage = String(fs.readFileSync('./page.html')).replace('###', pulpits.reduce((str, pulpit) => {
		return str + JSON.stringify(pulpit) + '<br/>'
	}, '')).replace('%%%', Array.from({length: totalPages}).map((el, index) =>  {
		return `<a href="http://localhost:3000?page=${index + 1}">${index + 1}</a>`
	}).join(''))
	response.contentType('html').send(htmlPage)
})

app.all('/api/*', async (request, response) => {
	try {
		const urlparts = getUrlParts(decodeURIComponent(request.originalUrl.split('?')[0]))
		if (request.method === 'GET') {
			switch (urlparts[0]) {
				case 'auditoriumsWithComp1':
					await writeJson(undefined, response, getHandlers.auditoriumsWithComp1)
					return
				case 'puplitsWithoutTeachers':
					await writeJson(undefined, response, getHandlers.puplitsWithoutTeachers)
					return
				case 'pulpitsWithVladimir':
					await writeJson(undefined, response, getHandlers.pulpitsWithVladimir)
					return
				case 'auditoriumsSameCount':
					await writeJson(undefined, response, getHandlers.auditoriumsSameCount)
					return
			}
		}
		const table = getTable(urlparts[0])
		switch (request.method) {
			case 'GET':
				await writeJson(undefined, response, getHandlers.basicHandler, table, urlparts.slice(1))
				break
			case 'POST':
				await writeJson(request, response, postHandlers.basicHandler, table)
				break
			case 'PUT':
				await writeJson(request, response, putHandlers.basicHandler, table)
				break
			case 'DELETE':
				await writeJson(request, response, deleteHandlers.basicHandler, table)
				break
			default:
				response.status(405).send('xd')
				break
		}
	} catch (err) {
		response.send(JSON.stringify(err))
	}
})

app.listen(3000, async () => {
	console.log('Server is running on port 3000')

	try {
		await prisma.$transaction(async () => {
			console.log('transaction start')
			await prisma.auditorium.updateMany({
				data: {
					AUDITORIUM_CAPACITY: {
						increment: 100
					}
				}
			})
			console.log('incremented')
			throw new Error('rollback xd')
			console.log('commit xd')
		})
	} catch (err) {
		console.error(err)
	}
})

//The default number of connections (pool size) is calculated with the following formula:
//num_physical_cpus * 2 + 1 - то есть пул соединений применяется

//fluentAPI - стиль написания кода через цепочки методов для улучшения читаемости
