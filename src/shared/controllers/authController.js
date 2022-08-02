const http = require('../http')
const User = require('../../core/user/userModel')
const Token = require('../../core/token/tokenModel')
const TokenController = require('../../core/token/tokenController')

const register = async (req, res) => {
    try {
        const userBody = req.body
        if (await User.isEmailTaken(userBody.email)) {
            return http.fail({
                message: 'Email ID is taken', 
                res
            })
        }
    
        if (await User.isPhoneTaken(userBody.phone)) {
            return http.fail({
                message: 'Phone number is already registered', 
                res
            })
        }

        if( !userBody.role ) {
            return http.fail({
                message: 'Please select user role', 
                res
            })
        }
        if( !['user', 'admin'].includes(userBody.role) ) {
            return http.fail({
                message: 'Invalid role', 
                res
            })
        }

        userBody.roles = userBody.role
        
        const user = new User(userBody)
    
        const userObj = {}
        userObj.user = await user.save()

        user.createdBy = user.id
        await user.save()
        
        userObj.token = await TokenController.createAccessToken(user)
        return http.success({
            message: 'Registration success', 
            data: userObj,
            res
        })
    } catch (err) {
        return http.handleError({err, res})
    }
}

const login = async(req, res) => {
    try {
        const { username, password } = req.body

        const user = await User.findOne({ email: username }).exec()
        if (!user) {
            return http.fail({
                message: 'Email is not registered with us', 
                res
            })
        }

        const isMatch = await user.isPasswordMatch(password)
        if (!isMatch) {
            return http.fail({
                message: 'You have entered a wrong password', 
                res
            })
        }

        // check if in-active
        if( !user.active ) {
            return http.fail({
                message: 'Your account is active, please contact support', 
                res
            })
        }

        const token = await TokenController.createAccessToken(user)
        const userObj = {user, token}

        return http.success({
            message: 'Login success', 
            data: userObj,
            res
        })
    } catch (err) {
        return http.handleError({err, res})
    }
}

const logout = async (req, res) => {
    try {
        const token = await Token.findOne({ token: req.token, type: 'access', blacklisted: false })
        if (!token) {
            return http.fail({
                message: '"Not found', 
                res
            })
        }
        await token.remove()
        return http.success({
            message: 'Logged out successfuly', 
            data: {},
            res
        })
    } catch (err) {
        return http.handleError({err, res})
    }
};



module.exports = {
    register,
    login,
    logout
}