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

app.post('/todos', authenticate, (req, res) => {
    var newTodo = new Todo({
        text: req.body.text,
        _creator: req.user._id
    });

    newTodo.save().then((doc) => {
        res.send(doc)
    }, (err) => {
        res.status(400).send(err)
    });
});

app.get('/todos', authenticate, (req, res) => {
    Todo.find({
        _creator: req.user._id
    }).then((todos) => {
        res.send({todos});
    }, (err) => {
        res.status(400).send(e);
    });
});

app.get('/todos/:id', authenticate, (req, res) => {
    var id = req.params.id;
    Todo.findOne({
        _id: id,
        _creator: req.user._id
    }).then((todo) => {
        if (todo) {
            res.send({todo});
        } else {
            res.status(404).send({message: "Todo not found!"});
        }
    }).catch((error) => {
        res.status(400).send(error);
    })
})

app.delete('/todos/:id', authenticate, (req, res) => {
    var id = req.params.id;

    if (!ObjectID.isValid(id)) {
        return res.status(400).send();
    }

    Todo.findOneAndRemove({
        _id: id,
        _creator: req.user._id
    }).then((todo) => {
        if (!todo) {
            return res.status(404).send();
        }

        res.send({todo});
    }, (error) => {
        res.status(400).send(error);
    })
});

app.patch('/todos/:id', authenticate, (req, res) => {
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

    Todo.findOneAndUpdate({
        _id: id,
        _creator: req.user._id
    }, {$set: body}, {new: true}).then((todo) => {
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

app.delete('/users/me/token', authenticate, (req, res) => {
    var user = req.user;
    var token = req.header('x-auth');

    user.removeToken(token).then((user) => {
        return res.send();
    }).catch((err) => {
        return res.status(400).send(err);
    })
});

app.listen(port, () => {
    console.log(`Started server on port ${port} at ${new Date()}`);
});

module.exports = {app};