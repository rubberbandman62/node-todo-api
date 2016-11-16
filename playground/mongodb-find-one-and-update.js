var MongoClient = require('mongodb').MongoClient,
    test = require('assert');
MongoClient.connect('mongodb://localhost:27017/test', function(err, db) {
    // Get the collection
    var col = db.collection('find_one_and_update');
    col.insertMany([{a:1, b:1}], {w:1}, function(err, r) {
        test.equal(null, err);
        test.equal(1, r.result.n);

        col.findOneAndUpdate({a:1}
            , {$set: {d:1}}
            , {
                projection: {b:1, d:1}
                , sort: {a:1}
                , returnOriginal: false
                , upsert: true
            }
            , function(err, r) {
                test.equal(null, err);
                test.equal(1, r.lastErrorObject.n);
                test.equal(1, r.value.b);
                test.equal(1, r.value.d);

                db.close();
            });
    });
});