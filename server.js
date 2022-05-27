const express = require('express')
const app = express()

app.get('/',(req,res) => {

    res.json({TestResult:"success!"})
    console.log('hi')
})

const weatherRouter = require('./routes/weather')
const recordRouter = require('./routes/record')

app.use('/weather',weatherRouter)
app.use('/record',recordRouter)

app.listen(3000)

