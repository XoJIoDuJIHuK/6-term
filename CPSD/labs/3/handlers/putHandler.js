const prisma = require('../models/prisma_init')

module.exports = {
    basicHandler: async function (table, urlparts, request) {
        await table.upsert(request.body)
        return request.body
    }
}