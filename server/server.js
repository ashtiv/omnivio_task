const express = require('express')
const bodyParser = require('body-parser')
const db = require('./queries')
const app = express()
const port = 5000

app.use(bodyParser.json())
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
)
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "*");
    next();
})
app.get('/', (request, response) => {
    response.json({ info: 'Node.js, Express, and Postgres API' })
})
app.get('/users', db.getUsers)
app.get('/users/:id/:s', db.getUserById)
app.post('/p', db.changeplotbyid)
app.get('/p/:id', db.getplotbyid)
app.post('/users', db.createUser)
app.get('/d/:id', db.deleteUser)
app.listen(port, () => {
    console.log(`App running on port ${port}.`)
})