const keys = require("./keys");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json())


console.log("connecting to PG DB:", keys.PGUSER, keys.PGHOST, keys.PG_DATABASE, keys.PG_PASSWORD, keys.PG_PORT);
// Postgres Client Setup
const { Pool } = require('pg');
const pgClient = new Pool({
    user: keys.PGUSER,
    host: keys.PGHOST,
    database: keys.PG_DATABASE,
    password: keys.PG_PASSWORD,
    port: keys.PG_PORT
});

pgClient.connect();



pgClient.on('error', () => console.log("PG Connection Lost"))

pgClient.on("connect", (client) => {
    console.log("connection to PG")
    client
        .query("CREATE TABLE IF NOT EXISTS values (number INT)")
        .catch((err) => console.error("Failed to connect:", err));
});

//Redis Client Setup
const redis = require('redis');
const redisClient = redis.createClient({
    host: keys.REDIS_HOST,
    port: keys.REDIS_PORT,
    retry_strategy: () => 1000
})

const redisPublisher = redisClient.duplicate();

// express routes:
app.get('/', (req, res) => {
    res.send('Hi')
})

app.get('/values/all', async (req, res) => {
    console.log("Getting values")
    const values = await pgClient.query('SELECT * FROM values');
    console.log("VALUES:", values.rows);
    res.send(values.rows);
})

app.get('/values/current', async (req, res) => {
    const values = redisClient.hgetall('values', (err, values) => {
        res.send(values);
    });
})

app.post('/values', async (req, res) => {
    const index = req.body.index;
    if (parseInt(index) > 40) {
        return res.status(422).send('Index too high');
    }
    redisClient.hset('values', index, 'Nothing yet!');
    redisPublisher.publish('insert', index);
    pgClient.query('INSERT INTO values(number) values($1)', [index]);
    res.send({ working: true });
})


setTimeout(() =>
    app.listen(5000, err => {
        console.log("Listening .. on port 5000", err ? err : ".");
    }), 100);
