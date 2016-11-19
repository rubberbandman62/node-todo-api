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
    });
});

app.get('/todos', (req, res) => {
    // console.log(req.body);
    Todo.find().then((todos) => {
        res.send({todos});
    }, (err) => {
        console.log('Error while fetching all the todos.', err);
        res.status(400).send(e);
    });
});

app.get('/todos/:id', (req, res) => {
    // console.log(`url received on the server: ${req.url}`);
    var id = req.params.id;
    Todo.findById(id).then((todo) => {
        if (todo) {
            res.send({todo});
        } else {
            res.status(404).send({message: "Todo not found!"});
        }
    }).catch((error) => {
        res.status(400).send(error);
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
    });
});

app.listen(port, () => {
    console.log(`Started server on port ${port}`);
});

module.exports = {app};