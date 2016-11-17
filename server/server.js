var express = require('express');
var bodyParser = require('body-parser');

var {mongoose} = require('./db/mongoose');
var {User} = require('./schemas/user');
var {Todo} = require('./schemas/todo');

const port = process.env.PORT || 3000;

var app = express();

app.use(bodyParser.json());

app.post('/todos', (req, res) => {
    // console.log(req.body);
    var newTodo = new Todo({
        text: req.body.text,
        completed: req.body.completed,
        completedAt: req.body.completedAt
    });

    newTodo.save().then((doc) => {
        // console.log('Todo saved:', JSON.stringify(doc, undefined, 4));
        res.send(doc)
    }, (err) => {
        // console.log('Todo could not be saved:', err);
        res.status(400).send(err)
    })
})

app.post('/users', (req, res) => {
    // console.log(req.body);
    var newUser = new User({
        email: req.body.email
    });

    newUser.save().then((doc) => {
        // console.log('User saved:', JSON.stringify(doc, undefined, 4));
        res.send(doc)
    }, (err) => {
        // console.log('User could not be saved:', err);
        res.status(400).send(err)
    })
})

app.listen(port, () => {
    console.log(`Started server on port ${port}`);
})

module.exports = {app};