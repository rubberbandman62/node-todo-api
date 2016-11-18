const expect = require('expect');
const request = require('supertest');

var {app} = require('../server');
var {Todo} = require('../schemas/todo');

const todos = [{
    text: "first todo"
}, {
    text: "second todo"
}]

beforeEach((done) => {
    Todo.remove({}).then(() => {
        Todo.insertMany(todos);
    }).then(() => done());
})

describe('POST /todos', () => {
    it('should insert a todo into the database', (done) => {
        var text = "Test POST /todo.";

        request(app)
            .post('/todos')
            .send({text})
            .expect(200)
            .expect((res) => {
                expect(res.body.text).toBe(text)
            })
            .end((err, res) => {
                if(err) {
                    return done(err);
                }

                Todo.find({text})
                    .then((docs) => {
                        expect(docs.length).toBe(1);
                        expect(docs[0].text).toBe(text);
                        done();
                    })
                    .catch(err => done(err));
            });
    });

    it('should not insert todo into the database with invalid data', (done) => {
        request(app)
            .post('/todos')
            .send({text: ''})
            .expect(400)
            .end((err, res) => {
                if(err) {
                    return done(err);
                }

                Todo.find({})
                    .then((docs) => {
                        expect(docs.length).toBe(2);
                        done();
                    })
                    .catch(err => done(err));
            })
    });
});

describe('GET /todos', () => {
    it('should return all todos', (done) => {
        request(app)
            .get('/todos')
            .expect(200)
            .expect((res) => {
                expect(res.body.todos.length).toBe(2)
            })
            .end(done);
    })
})