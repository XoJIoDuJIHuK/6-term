const prisma = require('../models/prisma_init')

module.exports = {
    basicHandler: async function (table, urlparts, request) {
        const model = prisma[table.name.toLowerCase()]
        const data = request.body
        await model.create({
            data: request.body
        })
        return request.body
    }
}