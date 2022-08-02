/**
 * Basic/Non-module routes only
 * Module related routes to be there in the module directory under /src/core/
 */

const express = require('express')
const router = new express.Router()

// Middlewares
const { auth } = require('../middlewares/')

const AuthController = require('../shared/controllers/authController')

// Auth routes
router.post('/api/register', AuthController.register)
router.post('/api/login', AuthController.login)
router.get('/api/logout', auth, AuthController.logout)

router.post('/api/test', function(req, res) {
    res.send('working')
})

module.exports = router