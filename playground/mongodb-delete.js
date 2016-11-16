const {MongoClient, ObjectId} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (error, database) => {
    if (error) {
        return console.log('Unable to connect to database!');
    }
    console.log('Successfully connected to MongoDB database!');

    // delete many
    // database.collection('Todos').deleteMany({text: 'task to do by anyone!'}).then((result) => {
    //     console.log(result.deletedCount);
    // })
    database.collection('Users').deleteMany({name: 'Klaus'}).then((result) => {
        console.log(JSON.stringify(result.result, undefined, 4));
    })

    // delete one

    // find and delete one
    database.collection('Users')
        .findOneAndDelete({_id: new ObjectId('582c68b1373a390b0874eba6')})
        .then((result) => {
            console.log(JSON.stringify(result, undefined, 4));
        })

    database.close();
    console.log('Connection closed!');
})