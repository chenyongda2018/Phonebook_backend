const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
const config = require('../utils/config')

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        minLength: 3,
        required: true,
    },
    number: {
        type: String,
        unique: true,
        minLength: 5,
        required: true
    }
})
personSchema.plugin(uniqueValidator)
//格式化mongoose返回的对象
personSchema.set('toJSON',{
    transform:(document,returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Person', personSchema)
