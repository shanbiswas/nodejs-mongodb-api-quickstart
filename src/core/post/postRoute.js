const express = require('express')
const router = new express.Router()
const { auth } = require('@src/middlewares')

const PostController = require('./postController')

router.get('/api/posts', auth, PostController.list)
router.post('/api/posts', auth, PostController.create)
router.get('/api/posts/:id', auth, PostController.view)
router.patch('/api/posts/:id/update', auth, PostController.update)


module.exports = router