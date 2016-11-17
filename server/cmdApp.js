const yargs = require('yargs');

var mongoose = require('mongoose');
var User = require('./schemas/user').User;
var Todo = require('./schemas/todo').Todo;

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/TodoApp');

const argv = yargs
    .command('todo', 'Add a new todo', {
        text: {
            describe: 'description of the new task',
            demand: true
        },
        completed: {
            describe: 'is the task already completed?',
            demand: false
        },
        completedAt: {
            describe: 'when was the task completed?',
            demand: false
        }
    })
    .command('user', 'Add a new user', {
        email: {
            describe: 'email to identify the new user',
            demand: true
        }
    })
    .help()
    .argv;

const type = argv._[0];
console.log(`type to add: ${type}`);
console.log('arguments: ', argv);

if (type === 'todo') {
    var newTodo = new Todo({
        text: argv.text
    });

    newTodo.save().then((doc) => {
        console.log('New todo saved!', doc)
    }, (error) => {
        console.log('Unable to save todo.', error)
    });
} else if (type === 'user') {
    var newUser = new User({
        email: argv.email
    })

    newUser.save().then((doc) => {
        console.log('New User saved!', JSON.stringify(doc, undefined, 4))
    }, (error) => {
        console.log('User could not be saved!', error)
    });
} else {
    console.log('Unknown type to save!')
}

