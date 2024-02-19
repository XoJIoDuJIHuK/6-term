const {redisClient, resultHandler, testPerformance} = require('./lib.js')

const client = redisClient()

function set(n) {
    //console.log(`set ${n}`)
    client.set(n, `set${n}`, resultHandler)
}

function del(n) {
    //console.log(`del ${n}`)
    client.del(n, resultHandler)
}

function get(n) {
    //console.log(`get ${n}`)
    client.get(n, resultHandler)
}

const functions = [set, get, del]
client.connect().then(() => {
    testPerformance(functions, 1e4)
})

client.quit()