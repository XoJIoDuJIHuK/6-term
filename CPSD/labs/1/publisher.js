const {redisClient, channelName, interval} = require('./lib.js')
const publisher = redisClient()
let messagesPublished = 0
publisher.connect().then(() => {
    setInterval(() => {
        publisher.publish(channelName, `message ${++messagesPublished}`)
        console.log(messagesPublished)
    }, interval)
})