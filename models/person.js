const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const url = process.env.MONGO_URI;

console.log('Connect to: ',url);

mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: false
}).then(result => {
    console.log('Connected to MongoDB');
}).catch(error => {
    console.log('Error connect to MongoDB',error.message);
});

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
});
personSchema.plugin(uniqueValidator);
//格式化mongoose返回的对象
personSchema.set('toJSON',{
    transform:(document,returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    }
})

module.exports = mongoose.model('Person', personSchema)
