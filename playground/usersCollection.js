module.exports.insertUser = (database, user) => {

    database.collection('Users').insertOne(user, (error, result) => {
        if (error) {
            return console.log('Unable to insert user: ', error);
        }

        console.log(JSON.stringify(result.ops, undefined, 4));
    })

};