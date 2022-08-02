const mongoose = require('mongoose')
const mongoose_delete = require('mongoose-delete')
const validator = require('validator')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if( !validator.isEmail(value) ) {
                throw new Error('Email is invalid')
            }
        }
    },
    phone: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    image: {
        type: String,
        default: null,
        get: (image) => {
            if( image ) {
                return process.env.URI + process.env.USER_PROFILE_IMAGE_UPLOAD_DIR + image
            }
            return image
        }
    },
    password: {
        type: String,
        required: true
    },
    active: {
        type: Boolean,
        default: true
    },
    roles: {
        type: Array,
        default: null
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


userSchema.set('toJSON', {getters: true, virtuals: true})
userSchema.set('toObject', {getters: true, virtuals: true})
userSchema.plugin(mongoose_delete, { deletedAt : true, deletedBy : true, deletedByType: String, overrideMethods: 'all' })


// Hash the plain text password before saving
userSchema.pre('save', async function () {
    const user = this

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }
})

userSchema.methods.toJSON = function () {
    const user = this
    const userObject = user.toObject()

    delete userObject.password
    // delete userObject.tokens

    return userObject
}

// Check user email and password
userSchema.statics.findByCredentials = async function(email, password) {
    const user = await this.findOne({ email })
    if (!user) {
        throw new Error('Unable to login')
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
        throw new Error('Unable to login')
    }

    return user
}

userSchema.methods.isPasswordMatch = async function(password) {
    const user = this;
    return bcrypt.compare(password, user.password)
}

userSchema.statics.isEmailTaken = async function(email) {
    const user = await this.findOne({ email })
    return !!user;
};

userSchema.statics.isPhoneTaken = async function(phone) {
    const user = await this.findOne({ phone })
    return !!user;
};

const User = mongoose.model("User", userSchema)
module.exports = User