const {ObjectID} = require('mongodb');

const {mongoose} = require('../server/db/mongoose');
const {Todo} = require('../server/schemas/todo');
const {User} = require('../server/schemas/user');

// Todo.remove({}).then( (result) => {
//     console.log(result);
// });

Todo.findByIdAndRemove('0000006504e5382b5ca658b3').then((todo) => {
    console.log(todo);
})