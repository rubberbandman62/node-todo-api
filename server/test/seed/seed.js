const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');

const {Todo} = require('../../schemas/todo');
const {User} = require('../../schemas/user');

const privateKey = '123abc';

const userOneID = new ObjectID();
const userTwoID = new ObjectID();

const users = [{
    _id: userOneID,
    email: 'abc@gmx.de',
    password: 'userOnePassword',
    tokens: [{
        access: 'auth',
        token: jwt.sign({_id: userOneID, access: 'auth'}, privateKey).toString()
    }]
}, {
    _id: userTwoID,
    email: 'abc@web.de',
    password: 'userTwoPassword',
    tokens: [{
        access: 'auth',
        token: jwt.sign({_id: userTwoID, access: 'auth'}, privateKey).toString()
    }]
}];

const populateUsers = (done) => {
    User.remove({}).then(() => {
        var userOnePromise = new User(users[0]).save();
        var userTwoPromise = new User(users[1]).save();

        return Promise.all([userOnePromise, userTwoPromise]);
    }).then(() => done());
};

const todos = [{
    _id: new ObjectID(),
    text: "first todo",
    _creator: userOneID
}, {
    _id: new ObjectID(),
    text: "second todo",
    _creator: userTwoID
}];

const populateTodos = (done) => {
    Todo.remove({}).then(() => {
        Todo.insertMany(todos);
    }).then(() => done());
};

module.exports = {todos, populateTodos, users, populateUsers};