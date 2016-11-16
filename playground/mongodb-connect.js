const {MongoClient, ObjectId} = require('mongodb');
const insertUser = require('./usersCollection.js').insertUser;
const insertTodo = require('./todosCollection.js').insertTodo;

console.log((new ObjectId()).getTimestamp());

MongoClient.connect('mongodb://localhost:27017/TodoApp', (error, database) => {
    if (error) {
        console.log('Unable to connect to database!');
        return;
    }

    console.log('Successfully connected to MongoDB database!');

    insertTodo(database, {
        text: 'task to be done by anyone!',
        completed: false
    });

    insertUser(database, {
        name: 'Willi',
        age: 45,
        location: 'Germany'
    });

    insertUser(database, {
        name: 'Heinz',
        age: 75,
        location: 'Netherlands'
    });

    database.close();
})