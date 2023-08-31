const Knex = require("knex")
console.log("process.env.db_hostname",process.env.db_password)
const knex = Knex({
    client: 'pg',
    connection: {
        host: process.env.db_hostname,
        user: process.env.db_username,
        password: process.env.db_password,
        port: process.env.database_port,
        ssl: false,
        database: process.env.servicename
    },
    acquireConnectionTimeout: process.env.CONNECTION_TIMEOUT || 6000,
    pool: {
        min: 1,
        max: 10

    }
})

const bookshelf = require('bookshelf')(knex)

module.exports={
    bookshelf,
    knex
}