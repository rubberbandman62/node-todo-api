require('./config/config');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');
const bcrypt = require('bcryptjs');

var {mongoose} = require('./db/mongoose');
var {User} = require('./schemas/user');
var {Todo} = require('./schemas/todo');
var {authenticate} = require('./middleware/authenticate');

const port = process.env.PORT;

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

app.delete('/todos/:id', (req, res) => {
    var id = req.params.id;

    if (!ObjectID.isValid(id)) {
        return res.status(400).send();
    }

    Todo.findByIdAndRemove(id).then((todo) => {
        if (!todo) {
            return res.status(404).send();
        }

        res.send({todo});
    }, (error) => {
        res.status(400).send(error);
    })
});

app.patch('/todos/:id', (req, res) => {
    var id = req.params.id;
    var body = _.pick(req.body, ['text', 'completed']);

    if (!ObjectID.isValid(id)) {
        return res.status(400).send;
    }

    if (_.isBoolean(body.completed) && body.completed) {
        body.completedAt = new Date().getTime();
    } else {
        body.completed = false;
        body.completedAt = null;
    }

    Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then((todo) => {
        if (!todo) {
            return res.status(404).send();
        }
        res.send({todo});

    }).catch((error) => {
        res.status(400).send();
    })
})

app.post('/users', (req, res) => {
    // console.log(req.body);
    var body = _.pick(req.body, ['email', 'password']);
    var newUser = new User(body);

    newUser.generateAuthTokenAndSave().then((token) => {
        res.header('x-auth', token).send({user: newUser});
    }).catch((error) => {
        res.status(400).send(error);
    })

});

app.get('/users/me', authenticate, (req, res) => {
    res.send({user: req.user});
});

app.get('/users', (req, res) => {
    User.find().then((users) => {
        res.send({users});
    }).catch((error) => {
        res.status(400).send(error);
    })
});

app.post('/users/login', (req, res) => {
    var {email, password} = req.body;

    User.findByCredentials(email, password).then((user) => {
        return user.generateAuthTokenAndSave().then((token) => {
            res.set('x-auth', token).send();
        })
    }).catch((err) => {
        return res.status(401).send();
    })

});

app.listen(port, () => {
    console.log(`Started server on port ${port}`);
});

module.exports = {app};