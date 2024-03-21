const oracledb = require('oracledb');


async function getDevelopers() {
	const regex = /^developer [0-9]/
	const ret = (await connection.execute(`SELECT NAME FROM STAFF`)).rows.map(e => e[0])
	return ret.filter(e => regex.test(e))
}

async function printDevelopers() {
	console.log(await getDevelopers())
}

async function getTesters() {
	const regex = /^tester [0-9]/
	const ret = (await connection.execute(`SELECT NAME FROM STAFF`)).rows.map(e => e[0])
	return ret.filter(e => regex.test(e))
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
			const script = `DECLARE
			developer INT;
		BEGIN
			SELECT id INTO developer FROM staff WHERE name = '${developer}';
		
			INSERT INTO COMMITS (DEVELOPER, COMMIT_DATE)
			VALUES (developer, DATE '${commitDate.getFullYear()}-${commitDate.getMonth() + 1}-${commitDate.getDate()}');
			commit;
			END;`
			await connection.execute(script)
		} catch (err) {
			console.log(err)
		}
	}

	const startDate = new Date('2023-01-01')
	const endDate = new Date('2024-03-19')
	const developers = await getDevelopers()
	for (let developer of developers) {
		const commitsNumber = Math.random() * 5 + 3
		for (let i = 0; i < commitsNumber; i++) {
			await InsertCommit(developer)
		}
	}
}

async function InsertTests() {
	async function InsertTest(commit, tester, testData) {
		try {
			const passed = Math.random() < 0.5 ? 'Y' : 'N'
			const script = `
				DECLARE tester INT;
				BEGIN
					SELECT ID INTO tester FROM STAFF WHERE NAME = '${tester}';
					INSERT INTO TESTS (TESTER, COMMIT, DATA_ID, PASSED) VALUES (tester, ${commit}, ${testData}, '${passed}');
					commit;
				END;
			`
			await connection.execute(script)
		} catch (err) {
			console.log(err)
		}
	}

	const testers = await getTesters()
	const testDataArr = (await connection.execute('SELECT ID FROM TEST_DATA')).rows.map(e => e[0])
	const commits = (await connection.execute('SELECT ID FROM COMMITS')).rows.map(e => e[0])
	for (let commit of commits) {
		for (let testData of testDataArr) {
			const tester = testers[Math.floor(Math.random() * testers.length)]
			await InsertTest(commit, tester, testData)
		}
	}
}

let connection
(async function() {
	
	try {
		connection = await oracledb.getConnection({
			user: 'SYS',
			password: 'password',
			connectString: '127.0.0.1/SEPDB',
			privilege: oracledb.SYSDBA
		})	
		// await printDevelopers()
		// await printTesters()
		// await InsertCommits()
		await InsertTests()
	} catch (err) {
		console.error("Error:", err)
	} finally {
		if (connection) {
			try {
				await connection.close()
				console.log("Database connection closed.")
			} catch (err) {
				console.error("Error when closing the database connection:", err)
			}
		}
	}
})()

// module.exports = {
// 	STAFF,
// 	ROLE,
// 	TEST_DATA,
// 	COMMITS,
// 	TESTS,
// 	sequelize,
// 	GetSubordinates: async function(principalName) {
// 		try {
// 			const ret = (await sequelize.query(`EXEC GetSubordinatesByName @parentName = N'${principalName}'`))[0].map(e => e.NAME)
// 			console.log(ret)
// 		} catch (err) {
// 			errorHandler(err)
// 		}
// 	},
// 	GenerateGeoData,
// 	InsertTestData: async function(jsonData) {
// 		try {
// 			const point = GenerateGeoData()
// 			await sequelize.query(`INSERT INTO TEST_DATA (GEO_DATA, JSON_DATA) VALUES (geometry::STGeomFromText('POINT (${point.coordinates[0]} ${point.coordinates[1]})', 0), '${jsonData}')`)
// 		} catch (err) {
// 			errorHandler(err)
// 		}
// 	}
// }