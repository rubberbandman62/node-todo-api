const {MongoClient, ObjectId} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (error, database) => {
    if (error) {
        return console.log('Unable to connect to database!');
    }
    console.log('Successfully connected to MongoDB database!');

    database.collection('Todos').findOneAndUpdate({
        text: /tsk/
    }, {
        $set: {text: "Another task to be done."}
    }, {
        returnOriginal: false
    }).then((result) => {
        console.log(result);
    })

    database.collection('Users').findOneAndUpdate({
        name: 'Hartwig'
    }, {
        $inc: {age: 1}
    }, {
        returnOriginal: false
    }).then((result) => {
        console.log(result);
    })

    database.close();
    console.log('Connection closed!');
})