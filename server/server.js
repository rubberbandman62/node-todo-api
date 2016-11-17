var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/TodoApp');

var Todo = mongoose.model('Todo', {
    text: {
        type: String
    },
    completed: {
        type: Boolean
    },
    completedAt: {
        type: Number
    }
});

// var newTodo = new Todo({
//     text: 'Cook dinner'
// });
//
// newTodo.save().then((doc) => {
//     console.log('New todo saved!', doc)
// }, (error) => {
//     console.log('Unable to save todo.', error)
// });

var anotherTodo = new Todo({
    text: 'Do something totally wrong!',
    completed: '123',
    completedAt: 'einszweidrei'
})

anotherTodo.save().then((doc) => {
    console.log('Todo saved', doc)
}, (error) => {
    console.log('Unable to save todo', error)
});