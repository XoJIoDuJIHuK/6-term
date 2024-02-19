const {redisClient, resultHandler, testPerformance} = require('./lib.js')

const client = redisClient()

function hset(n) {
    client.hSet(n, `id:n,val:"val-${n}"`, resultHandler)
}
function hget(n) {
    client.hGet(n, resultHandler)
}

const functions = [hset, hget]
client.connect().then(() => {
    testPerformance(functions, 1e4)
})

client.quit()