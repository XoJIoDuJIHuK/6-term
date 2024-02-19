const {redisClient, resultHandler, testPerformance} = require('./lib.js')

const client = redisClient()
const key = 'incr'

function increment() {
    client.incr(key, resultHandler)
}
function decrement() {
    client.decr(key, resultHandler)
}

const functions = [increment, decrement]
client.connect().then(() => {
    client.set(key, 0)
    testPerformance(functions, 1e4)
})

client.quit()