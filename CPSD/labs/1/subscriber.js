const {redisClient, channelName} = require('./lib.js')
const subscriber = redisClient()
let messagesReceived = 0
subscriber.connect().then(() => {
    subscriber.subscribe(channelName, message => {
        console.log(`got message #${++messagesReceived} '${message}'`)
    })
})