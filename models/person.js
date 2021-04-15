const mongoose = require('mongoose');

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
    name: String,
    number: String
});
//格式化mongoose返回的对象
personSchema.set('toJSON',{
    transform:(document,returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    }
})

module.exports = mongoose.model('Person', personSchema)
