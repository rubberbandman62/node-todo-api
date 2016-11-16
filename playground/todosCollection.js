module.exports.insertTodo = (database, todo) => {

    database.collection('Todos').insertOne(todo, (error, result) => {
        if (error) {
            return console.log('Unable to insert todo: ', error);
        }

        console.log(JSON.stringify(result.ops, undefined, 4));
    })

};