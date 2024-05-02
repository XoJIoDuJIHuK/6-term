const { where, Op } = require('sequelize')
const { sql } = require('@sequelize/core')
const { STAFF, ROLE, TEST_DATA, COMMITS, sequelize, GetSubordinates, InsertTestData } = require('./msModels')
// const { STAFF, ROLE, TEST_DATA, COMMITS, sequelize, GetSubordinates, InsertTestData } = require('./oraModels')

async function renameTesters() {
	const regex = /dev((1[1-9])|20)/
	const testers = (await STAFF.findAll({
		attributes: ['NAME'],
		where: {
			NAME: {
				[Op.like]: 'dev%'
			}
		}
	})).map(e => e.dataValues.NAME).filter(e => regex.test(e))
	for (let name of testers) {
		STAFF.update({ NAME: `tester${name.slice(3)}`, ROLE: 5 }, {
			where: {
				NAME: name
			}
		})
	}
}

function getDataValues(e) {
	return e.dataValues
}

async function getDevelopers() {
	const regex = /^dev[0-9]/
	const ret = (await STAFF.findAll()).map(getDataValues)
	return ret.filter(e => regex.test(e.NAME))
}

async function printDevelopers() {
	console.log(await getDevelopers())
}

async function getTesters() {
	const regex = /^tester[0-9]/
	const ret = (await STAFF.findAll()).map(getDataValues)
	return ret.filter(e => regex.test(e.NAME))
}

async function printTesters() {
	console.log(await getTesters())
}

async function InsertCommits() {
	async function InsertCommit(developer) {
		const startTimestamp = startDate.getTime()
		const endTimestamp = endDate.getTime()
		const commitDate = new Date(Math.random() * (endTimestamp - startTimestamp) + startTimestamp)
		try {
			await sequelize.query(`DECLARE @developer HIERARCHYID = (select node from staff where name = N'${developer.NAME}');
			INSERT INTO COMMITS (DEVELOPER, COMMIT_DATE) VALUES (@developer, '${commitDate.getFullYear()}-${commitDate.getMonth() + 1}-${commitDate.getDate()}');`)
		} catch (err) {
			console.log(err)
		}
	}

	const startDate = new Date('2023-01-01')
	const endDate = new Date('2024-01-01')
	const developers = await getDevelopers()
	for (let developer of developers) {
		const commitsNumber = Math.random() * 50 + 25
		for (let i = 0; i < commitsNumber; i++) {
			await InsertCommit(developer)
		}
	}
}

async function InsertTests() {
	async function InsertTest(commit, tester, testData) {
		try {
			const passed = Math.random() < 0.5 ? 'Y' : 'N'
			await sequelize.query(`DECLARE @tester HIERARCHYID = (SELECT NODE FROM STAFF WHERE NAME = N'${tester.NAME}');
				INSERT INTO TESTS (TESTER, COMMIT_ID, DATA_ID, PASSED) VALUES (@tester, ${commit.ID}, ${testData.ID}, '${passed}');`)
		} catch (err) {
			console.log(err)
		}
	}

	const testers = await getTesters()
	const testDataArr = (await TEST_DATA.findAll()).map(getDataValues)
	const commits = (await COMMITS.findAll()).map(getDataValues)
	for (let commit of commits) {
		for (let testData of testDataArr) {
			const tester = testers[Math.floor(Math.random() * testers.length)]
			await InsertTest(commit, tester, testData)
		}
	}
}

renameTesters()
printDevelopers()
// printTesters()
// GetSubordinates('dev_manager1')
const jsonDataArr = ['{"xd":"kek"}', JSON.stringify({someData:[1,2,3]}), JSON.stringify(['mama', 'mia'])]
// for (let jsonData of jsonDataArr) {InsertTestData(jsonData)}
// InsertCommits()
// InsertTests()