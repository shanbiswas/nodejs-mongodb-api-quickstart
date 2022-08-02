const express = require('express')
const router = new express.Router()
const { auth } = require('@src/middlewares')

const UserController = require('./userController')

router.get('/api/users/me', auth, UserController.profile)
router.post('/api/users/avatar', auth, UserController.uploadAvatar)

module.exports = router