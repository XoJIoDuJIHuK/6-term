const redis = require('redis')

const redisClient = function() {
    const host = 'localhost'
    const port = 6379
    
    const client = redis.createClient({
        host: host,
        port: port
    })
    
    client.on('connect', function() {
        console.log('Connected to Redis')
    })
    
    client.on('error', function(err) {
        console.log('Redis connection error: ', err)
    })
    return client
}

function resultHandler(err, result) {
    (err, result) => {
        if (err) {
            console.error('err', err)
        } else {
            console.log('result', result)
        }
    }
}

function testPerformance(functions, iterations) {
    for (let func of functions) {
        const startTime = performance.now()
        console.log(func.name)
        for (let i = 0; i < iterations; i++) {
            func(i)
        }
        const endTime = performance.now()
        console.log(`time diff: ${Math.round(endTime - startTime, 2)}ms`)
    }
}
module.exports = {
    redisClient,
    testPerformance,
    resultHandler,
    channelName: 'xd',
    interval: 1e3
}