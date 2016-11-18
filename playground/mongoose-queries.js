const {ObjectId} = require('mongodb');

const {mongoose} = require('../server/db/mongoose');
const {Todo} = require('../server/schemas/todo');
const {User} = require('../server/schemas/user');

var userId = '582dbea745075b4c2c57218c';

if (!ObjectId.isValid(userId)) {
    console.log('The specified user id is invalid:', userId);
    return;
}

User.findById(userId)
    .then((user) => {
        if (user) {
            console.log('User found:',
                JSON.stringify(user, undefined, 4));
        } else {
            console.log('User not found')
        }
    })
    .catch((error) => {
        console.log('An error occured:',
            err);
    })


// var id = '582f39b0b63eaf340c670b50';
//
// Todo.find({_id: id}).then((todos) => {
//     console.log(JSON.stringify(todos, undefined, 4));
// }, (error) => {
//     console.log(err);
// });
//
// Todo.findOne({_id: id}).then((todo) => {
//     console.log(JSON.stringify(todo, undefined, 4));
// }, (error) => {
//     console.log(err);
// });
//
// Todo.findById(id).then((todos) => {
//     console.log(JSON.stringify(todos, undefined, 4));
// }, (error) => {
//     console.log(err);
// })