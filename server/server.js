var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/TodoApp');
var Schema = mongoose.Schema;

var Todo = mongoose.model('Todo', {
    text: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    completedAt: {
        type: Number,
        default: 0
    }
});

var UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        validate: {
            validator: (value) => /^[a-z0-9]([a-z0-9.]+[a-z0-9])?\@[a-z0-9.-]+$/.test(value),
            message: '{VALUE} is not a valid email address!'
        },
        minlength: 3,
        trim: true
    }
})

var User = mongoose.model('User', UserSchema);

// var newTodo = new Todo({
//     text: 'Cook dinner'
// });
//
// newTodo.save().then((doc) => {
//     console.log('New todo saved!', doc)
// }, (error) => {
//     console.log('Unable to save todo.', error)
// });

// var anotherTodo = new Todo({
//     text: ' Have breakfast tomorrow!  '
// })
//
// anotherTodo.save().then((doc) => {
//     console.log('Todo saved', JSON.stringify(doc, undefined, 4))
// }, (error) => {
//     console.log('Unable to save todo', error)
// });

var firstUser = new User({
    email: ' hto@iks.gmbh.com  '
})

firstUser.save().then((doc) => {
    console.log('New User saved!', JSON.stringify(doc, undefined, 4))
}, (error) => {
    console.log('User could not be saved!', error)
});