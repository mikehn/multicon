const keys = require('./keys');
const redis = require('redis');

const redisClient = redis.createClient({
    host: keys.REDIS_HOST,
    port: keys.REDIS_PORT,
    retry_strategy: () => 1000
})

const sub = redisClient.duplicate();

function fib(index) {
    console.log("fib:", index)
    if (index < 2) return 1;
    return fib(index - 1) + fib(index - 2);
}

function doWork(text) {
    return (new Date()) + " : " + text;
}

sub.on('message', (chanel, message) => {
    console.log("M:", chanel, message)
    if (chanel == "insert") {
        redisClient.hset('values', message, fib(parseInt(message)))
    } else {
        setTimeout(() => { doWork(message) }, 1000);
    }
})

sub.subscribe('insert');


