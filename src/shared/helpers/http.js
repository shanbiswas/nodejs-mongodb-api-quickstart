const logger = require('@src/utils/logger')

module.exports = {
    success: function (obj) {
        const {message, data, res} = obj

        res
            .status(200)
            .send({
                status: true,
                message,
                data
            })
    },

    fail: function (obj) {
        const {message, res} = obj
        // const httpStatus = obj.httpStatus || 400

        res
            .status(200)
            .send({
                status: false,
                message,
                error: obj.error || {}
            })
    },

    handleError: function (obj) {
        const error = obj.err
        const res = obj.res || ''

        logger.error({
            level: 'error',
            date: new Date(),
            message: error.message,
            error: error.stack
        });

        if( res ) {
            res.status(500)
                .send({
                    status: false,
                    message: error.message,
                    error: error.stack
                })
        }
        
    },
}

