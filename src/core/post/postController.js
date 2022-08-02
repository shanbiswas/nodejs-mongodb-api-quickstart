const _ = require('lodash')
const mongoose = require('mongoose')
const { unlink } = require('fs')

const http = require('@src/shared/helpers/http')
const Post = require('./postModel')
const Controller = require('@src/shared/controllers/controller')
const fileUploader = require('@src/shared/helpers/fileUploader')

class PostController extends Controller {

    constructor() {
        super('Post')
    }

    async create(req, res) {
        try {
            if( !req.body.name ) {
                return http.fail({
                    message: 'Post name is required', 
                    res
                })
            }

            if( req.files ) {
                const uploadedFile = fileUploader.upload(req.files.file, process.env.POST_IMAGE_UPLOAD_DIR)
                req.body.image = uploadedFile.fileName
            }

            let targetedMuscles = req.body.targetedMuscles || []
            if( typeof targetedMuscles == 'string' ) {
                targetedMuscles = targetedMuscles.replace(/[!\/[\]$'"]+/g, '')
                targetedMuscles = targetedMuscles.split(',')
                targetedMuscles = targetedMuscles.map(val => val.trim())
            }
            req.body.targetedMuscles = targetedMuscles

            const result = await super.create(req)
            return http.success({
                message: 'Post created successfully', 
                data: result,
                res
            })
        } catch (err) {
            return http.handleError({err, res})
        }
    }

    async list(req, res) {
        try {
            const result = await super.list(req)
            return http.success({
                message: 'Posts found', 
                data: result,
                res
            })
        } catch (err) {
            return http.handleError({err, res})
        }
    }

    async update(req, res){
        try {
            const filter = {
                _id: req.params.id,
                createdBy: req.user._id
            }
            const doc = await Post.findOne(filter).exec()
            if( doc ) {
                // Process image
                if( req.files ) {
                    const uploadedFile = fileUploader.upload(req.files.file, process.env.POST_IMAGE_UPLOAD_DIR)
                    req.body.image = uploadedFile.fileName

                    // Remove the existing image if it exists
                    if( uploadedFile.fileName ) {
                        const id = req.params.id || 0
                        const existingImage = await Post.findById(id, 'image').exec()

                        if( !_.isNil(existingImage.image) ) {
                            const imageName = existingImage.image.split('/').pop()
                            const existingImagePath = process.env.POST_IMAGE_UPLOAD_DIR + imageName
                            
                            unlink(existingImagePath, (err) => {
                                if (e) {
                                    http.handleError({err})
                                }
                            })
                        }
                    }
                }

                let targetedMuscles = req.body.targetedMuscles || []
                if( typeof targetedMuscles == 'string' ) {
                    targetedMuscles = targetedMuscles.replace(/[!\/[\]$'"]+/g, '')
                    targetedMuscles = targetedMuscles.split(',')
                    targetedMuscles = targetedMuscles.map(val => val.trim())
                }
                req.body.targetedMuscles = targetedMuscles

                const result = await super.update(req)
                return http.success({
                    message: 'Posts updated', 
                    data: result,
                    res
                })
            }

            return http.fail({
                message: 'No post found', 
                res
            })
            
        } catch (err) {
            return http.handleError({err, res})
        }
    }

    async view(req, res) {
        try {
            if( !req.params.id || !mongoose.Types.ObjectId.isValid(req.params.id) ) {
                return http.fail({
                    message: 'No/invalid post reference provided', 
                    res
                })
            }

            const data = await super.view(req)
            if( data ) {
                return http.success({
                    message: 'Post found', 
                    data,
                    res
                })
            }

            return http.fail({
                message: 'No post found', 
                res
            })
        } catch (err) {
            return http.handleError({err, res})
        }
    }
}

module.exports = new PostController()