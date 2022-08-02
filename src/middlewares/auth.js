const TokenController = require('@src/core/token/tokenController')
const User = require('@src/core/user/userModel')
const { http } = require('@src/shared/helpers')

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const decoded = await TokenController.verifyToken(token, 'access')
        const user = await User.findById(decoded.user)

        if( !user ) {
            throw new Error()
        }

        req.token = token
        req.user = user
        next()
    } catch (e) {
        return http.fail({
            message: 'Unauthenticated', 
            res,
            httpStatus: 401
        })
    }
}

module.exports = auth