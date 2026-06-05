const redis = require("redis");
const redisHost = process.env.REDIS_HOST || "localhost";
const redisPort = process.env.REDIS_PORT || 6379;

const client = redis.createClient({
    // el principio de The Twelve-Factor 
    url: `redis://${redisHost}:${redisPort}`

});

client.on("connect", () => {

    console.log(`Conectado exitosamente a Redis en ${redisHost}:${redisPort}`);
});

client.on("error", (err) => {

    console.error("Redis Error Critico:", err);

});

module.exports = client;