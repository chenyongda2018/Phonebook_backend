const personsRouter = require('./controllers/persons')
const middleWare = require("./utils/middleware")
const express = require('express')
const config = require('./utils/config')
const logger = require('./utils/logger')
const cors = require('cors')
const mongoose = require('mongoose')

const app = express()

mongoose.connect(config.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: false
}).then(result => {
    logger.info('Connected to MongoDB')
}).catch(error => {
    logger.error('Error connect to MongoDB',error.message)
})

app.use(cors())
app.use(express.static('build'))
app.use(express.json())
app.use(middleWare.requestLogger)
app.use('/api/persons',personsRouter)
app.use(middleWare.unknownEndpoint)
app.use(middleWare.errorHandler)

app.listen(config.PORT, () => {
    logger.info('Server is listenning port:' + config.PORT)
})