const {MongoClient, ObjectId} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (error, database) => {
    if (error) {
        return console.log('Unable to connect to database!');
    }
    console.log('Successfully connected to MongoDB database!');

    database.collection('Todos').find({completed: true}).toArray().then((documents) => {
        console.log('Todos:')
        console.log(JSON.stringify(documents, undefined, 4));
    }, (error) => {
       console.log('unable to find todos.', error);
        });

    var userCursor = database.collection('Users').find({name: 'Hartwig'});
    userCursor.toArray().then((users) => {
        console.log('Users:');
        console.log(JSON.stringify(users, undefined, 4));
    }, (error) => {
        console.log('unable to find users.')
    });
    // userCursor.rewind();
    userCursor.count().then((count) => {
        console.log(`Users count: ${count}`);
    }, (error) => {
        console.log('unable to read the count of users.')
    });

    database.close();
    console.log('Connection closed!');
})