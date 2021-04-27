const logger = require('./logger')
// const morgan = require('morgan')

// morgan.token('body', (req, rsp) => JSON.stringify(req.body))
// app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

const requestLogger = (req,rsp,next) => {
    logger.info('Method:',req.method)
    logger.info('Path:',req.path)
    logger.info('Body:',req.body)
    next()
}

/**
 * 对未知页面处理
 * @param {*} req
 * @param {*} rsp
 */
 const unknownEndpoint = (req, rsp, next) => {
    logger.info('path: ', req.path)
    if (!req.path.startsWith('/api/')) {
        return rsp.status(404).send({ error: 'uknown error.' })
    }
    next()
}

const errorHandler = (error, req, rsp, next) => {
    logger.error(error)
    if (error.name === 'CastError' && error.kind === 'ObjectId') {
        return rsp.status(400).send({ error: 'malformatted id' })
    }
    if (error.name === 'ValidationError' ) {
        return rsp.status(400).json({ error: error.message })
    }
    next(error)
}

module.exports = {
    requestLogger,
    unknownEndpoint,
    errorHandler,
}