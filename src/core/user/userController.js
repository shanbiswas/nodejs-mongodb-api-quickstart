const _ = require('lodash')
const { unlink } = require('fs')

const http = require('@src/shared/helpers/http')
const User = require('./userModel')
const Controller = require('@src/shared/controllers/controller')
const fileUploader = require('@src/shared/helpers/fileUploader')

class UserController extends Controller {
    constructor() {
        super('User')
        this.profile = this.profile.bind(this)
        this.uploadAvatar = this.uploadAvatar.bind(this)
    }

    async profile(req, res) {
        try {
            return http.success({
                message: 'Success',
                data: req.user,
                res
            })
        } catch (err) {
            return http.handleError({err, res})
        }
    }

    async uploadAvatar(req, res) {
        try {
            if( req.files ) {
                const uploadedFile = fileUploader.upload(req.files.file, process.env.USER_PROFILE_IMAGE_UPLOAD_DIR)
                req.body.image = uploadedFile.fileName

                // Remove the existing image if it exists
                if( uploadedFile.fileName ) {
                    const id = req.user.id || 0
                    const existingImage = await User.findById(id, 'image').exec()

                    if( !_.isNil(existingImage.image) ) {
                        const imageName = existingImage.image.split('/').pop()
                        const existingImagePath = process.env.USER_PROFILE_IMAGE_UPLOAD_DIR + imageName
                        
                        unlink(existingImagePath, (err) => {
                            if (err) {
                                http.handleError({err})
                            }
                        })
                    }
                    
                    req.params.id = req.user.id
                    const result = await super.update(req)
                    return http.success({
                        message: 'Profile image uploaded', 
                        data: result,
                        res
                    })
                }
                else {
                    return http.fail({
                        message: 'Something went wrong',
                        res
                    })
                }
            }
            else {
                return http.fail({
                    message: 'No file selected',
                    res
                })
            }
        } catch (err) {
            return http.handleError({err, res})
        }
    }
}
module.exports = new UserController()