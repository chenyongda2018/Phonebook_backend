const personsRouter = require('express').Router()
const Person = require('../models/person')
const logger = require('../utils/logger')

/**
 * 获取所有联系人
 */
personsRouter.get('/', (req, rsp) => {
    Person.find({}).then(result => {
        if (!result) {
            return rsp.status(400).json({ error: 'There is no any data.' })
        }
        return rsp.status(200).json(result)
    })
})

/**
 * 获取总体描述
 */
//  personsRouter.get('/api/infos', (req, rsp) => {
//     const curTime = new Date()
//     Person.find({}).then(result => {
//         logger.info('person infos:', result)
//         rsp.send(
//             `Phonebook has info for ${result.length} people.<br/>
//             ${curTime}`
//         )
//     })
// })

/**
 * 根据id查询
 */
personsRouter.get('/:id', (req, rsp, next) => {
    logger.info('get person id: ', req.params.id)
    Person
        .findById(req.params.id)
        .then(person => {
            if (person) {
                rsp.json(person)
            } else {
                rsp.status(404).end()
            }
        })
        .catch(error => next(error))
})

/**
 * 创建新的记录
 */
personsRouter.post('/', (req, rsp, next) => {
    const body = req.body
    if (!body.name) {
        return rsp.status(400).json({ error: 'Name must not be empty' })
    }
    if (!body.number) {
        return rsp.status(400).json({ error: 'Number must not be empty' })
    }
    const person = new Person({
        name: body.name,
        number: body.number
    })
    person.save()
        .then(result => {
            rsp.json(result)
        })
        .catch(error => { next(error) })
})

personsRouter.put('/:id', (req, rsp, next) => {
    const person = {
        name: req.body.name,
        number: req.body.number
    }
    //new:true 决定返回新对象还是旧对象
    Person
        .findByIdAndUpdate(req.params.id, person, { new: true })
        .then(updatePerson => {
            if (updatePerson) {
                rsp.json(updatePerson)
            } else {
                rsp.status(404).end()
            }
        })
        .catch(error => next(error))
})

personsRouter.delete('/:id', (req, rsp, next) => {
    Person
        .findByIdAndRemove(req.params.id)
        .then(result => {
            logger.info(result)
            return rsp.status(204).end()
        })
        .catch(error => {
            next(error)
        })
})

module.exports = personsRouter