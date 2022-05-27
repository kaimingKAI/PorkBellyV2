const express = require('express')
const app = express()



const weatherRouter = require('./routes/weather')
const recordRouter = require('./routes/record')
const dcRouter = require('./routes/dc')
app.use('/weather',weatherRouter)
app.use('/record',recordRouter)
app.use('/dc',dcRouter)

app.on('listening', function () {
    console.log("server on!")
});

app.listen(3000)

