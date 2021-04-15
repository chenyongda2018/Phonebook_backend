require('dotenv').config()
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const Person = require('./models/person')

morgan.token('body', (req, rsp) => JSON.stringify(req.body))
/**
 * 对未知页面处理
 * @param {*} req 
 * @param {*} rsp 
 */
const unknownEndpoint = (req, rsp, next) => {
    console.log('path: ', req.path);
    if (!req.path.startsWith('/api/')) {
        return rsp.status(404).send({ error: 'uknown error.' });
    }
    next();
}

const errorHandler = (error, req, rsp, next) => {
    console.error(error);
    if (error.name === 'CastError' && error.kind === 'ObjectId') {
        return rsp.status(400).send({ error: 'malformatted id' })
    }
    next(error)
}

const app = express();
app.use(cors());
app.use(express.static('build'))
app.use(express.json());
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));
app.use(unknownEndpoint);

/**
 * 获取所有联系人
 */
app.get('/api/persons', (req, rsp) => {
    Person.find({}).then(result => {
        if (!result) {
            return rsp.status(400).json({ error: 'There is no any data.' })
        }
        return rsp.status(200).json(result);
    })
})

/**
 * 获取总体描述
 */
app.get('/api/infos', (req, rsp) => {
    const curTime = new Date();
    Person.find({}).then(result => {
        console.log('person infos:', result);
        rsp.send(
            `Phonebook has info for ${result.length} people.<br/>
            ${curTime}`
        )
    })
})

/**
 * 根据id查询
 */
app.get('/api/persons/:id', (req, rsp, next) => {
    console.log('get person id: ', req.params.id);
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
app.post('/api/persons', (req, rsp) => {
    const body = req.body;
    if (!body.name) {
        return rsp.status(400).json({ error: 'Name must not be empty' });
    }
    if (!body.number) {
        return rsp.status(400).json({ error: 'Number must not be empty' });
    }
    const person = new Person({
        name: body.name,
        number: body.number
    })
    person.save().then(result => {
        rsp.json(person);
    })
})

app.put('/api/persons/:id', (req, rsp, next) => {
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

app.delete('/api/persons/:id', (req, rsp) => {
    Person
        .findByIdAndRemove(req.params.id)
        .then(result => {
            return rsp.status(204).end();
        })
        .catch(error => {
            next(error)
        })
})

app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log('Server is listenning port:' + PORT);
})