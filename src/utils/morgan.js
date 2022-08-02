const morgan = require('morgan')
const logger = require('./logger')

const errorResponseFormat = `:method :url :status - :response-time ms - message: :message`;

const errorHandler = morgan('combined', {
    skip: (req, res) => res.statusCode < 402,       // skip logging if status code is less than 402
    stream: { write: (message) => logger.error(message) },
});

module.exports = {
    errorHandler
}