const mongoose = require('mongoose')
const mongoose_delete = require('mongoose-delete')

const postSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        default: null
    },
    image: {
        type: String,
        default: null,
        get: (image) => {
            if( image ) {
                return process.env.URI + process.env.POST_IMAGE_UPLOAD_DIR + image
            }
            return image
        }
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    }
}, { timestamps: true })

postSchema.set('toJSON', {getters: true, virtuals: true})
postSchema.set('toObject', {getters: true, virtuals: true})
postSchema.plugin(mongoose_delete, { deletedAt : true, deletedBy : true, deletedByType: String, overrideMethods: 'all' })

const Post = mongoose.model("Post", postSchema)
module.exports = Post