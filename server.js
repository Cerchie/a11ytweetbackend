'use strict'

const app = require('./app')
const { PORT } = require('./config')

app.listen(PORT, function () {
    console.log(`Started on http://localhost:${PORT}`)
})

//borrowed server setup from Springboard bootcamp setup https://www.springboard.com/workshops/software-engineering-career-track
