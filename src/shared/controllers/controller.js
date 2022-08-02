const mongoose = require('mongoose')
const { helper } = require('../helpers/index')
const coreDirectory = '@src/core/'

class Controller {
    constructor(model) {
        const module = model.charAt(0).toLowerCase() + model.slice(1)
        const modelName = coreDirectory + module + '/' + module + 'Model'
        const Models = require(modelName)
        this.model = eval(Models)
        
        this.create = this.create.bind(this)
        this.update = this.update.bind(this)
        this.list = this.list.bind(this)
        this.view = this.view.bind(this)
    }


    async create(req) {
        req.body.createdBy = req.user.id
        return await this.model(req.body).save()
    }

    async update(req) {
        req.body.updatedBy = req.user.id

        let filter = {
            _id: req.params.id,
            createdBy: req.user._id
        }

        return await this.model.findOneAndUpdate(
                                    filter, 
                                    req.body, 
                                    {
                                        returnDocument: 'after'
                                    }
                                )
    }

    async list(req, filter = {}) {
        const limit = req.query.limit || 10
        const page = req.query.page || 1
        const offset = parseInt(page - 1) * parseInt(limit)
        
        filter.createdBy = helper.isAdmin(req.user.roles) ? '' : req.user._id
        filter.active = filter.active || true
        filter.deleted = filter.deleted || false

        const result = await this.model.find(filter)
                                .limit(limit)
                                .skip(offset)
                                .exec()
                                // .lean()

        return result
    }

    async view(req) {
        if( !mongoose.Types.ObjectId.isValid(req.params.id) ) {
            return false
        }

        let filter = {
            _id: req.params.id,
            createdBy: helper.isAdmin(req.user.roles) ? '' : req.user._id,
            active: true,
            deleted: false
        }

        const data = await this.model.findOne(filter).lean()
        if( data ) {
            return data
        }

        return false
    }
}

module.exports = Controller;