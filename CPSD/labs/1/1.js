const redis = require('redis')

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

client.connect()