const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

var {app} = require('../server');
var {Todo} = require('../schemas/todo');

const todos = [{
    _id: new ObjectID(),
    text: "first todo"
}, {
    _id: new ObjectID(),
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
                if (err) {
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
                if (err) {
                    return done(err);
                }

                Todo.find({})
                    .then((docs) => {
                        expect(docs.length).toBe(2);
                        done();
                    })
                    .catch(err => done(err));
            });
    });
});

describe('GET /todos', () => {
    it('should return all todos', (done) => {
        request(app)
            .get('/todos')
            .expect(200)
            .expect((res) => {
                expect(res.body.todos.length).toBe(2);
            })
            .end(done);
    });
});

describe('GET /todos/:id', () => {
    it(`should return one todo`, (done) => {
        request(app)
            .get(`/todos/${todos[0]._id}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toEqual(todos[0].text)
            })
            .end(done);
    });

    it(`should return an http code of 404 if the todo cannot be found`, (done) => {
        request(app)
            .get(`/todos/${new ObjectID(999)}`)
            .expect(404)
            .end(done);
    });

    it(`should return an http code of 400 if the id is invalid`, (done) => {
        request(app)
            .get(`/todos/123`)
            .expect(400)
            .end(done);
    });
});

describe('DELETE /todos/:id', () => {
    it(`should remove one todo`, (done) => {
        var id = todos[1]._id;
        var text = todos[1].text;
        request(app)
            .delete(`/todos/${id}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(text);
            })
            .end((error, resp) => {
                if (error) {
                    return done(error);
                }

                Todo.findById(id)
                    .then((todo) => {
                        expect(todo).toNotExist();
                        done();
                    })
                    .catch(error => done(error));
            });
    });

    it(`should return a 404 if the todo is not found`, (done) => {
        var id = new ObjectID();
        request(app)
            .delete(`/todos/${id}`)
            .expect(404)
            .end(done)
    });

    it(`should return a 400 if the id is invalid`, (done) => {
        request(app)
            .delete(`/todos/123`)
            .expect(400)
            .end(done)
    });
});

describe('PATCH /todos/:id', () => {

    it('should update just the text', (done) => {
        var id = todos[1]._id;
        var text = "Just another todo instead second todo";

        request(app)
            .patch(`/todos/${id}`)
            .send({text})
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(text);
            })
            .end((err, res) => {
                Todo.findById(id)
                    .then((todo) => {
                        expect(todo).toExist();
                        expect(todo.text).toBe(text);
                        done();
                    })
                    .catch((err) => done(err));
            });
    });

    it('should update the completed status', (done) => {
        var id = todos[1]._id;
        var text = "Just another todo instead second todo";

        request(app)
            .patch(`/todos/${id}`)
            .send({completed: true})
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.completed).toBe(true);
                expect(res.body.todo.completedAt).toBeA('number');
            })
            .end((err, res) => {
                Todo.findById(id)
                    .then((todo) => {
                        expect(todo).toExist();
                        expect(todo.completed).toBe(true);
                        expect(todo.completedAt).toBeA('number');
                        done();
                    })
                    .catch((err) => done(err));
            });
    })

    it('should not update any other attributes than text and completed', (done) => {
        var id = todos[1]._id;

        request(app)
            .patch(`/todos/${id}`)
            .send({
                completedAt: 123456789,
                name: 'Willi'
            })
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.completed).toBe(false);
                expect(res.body.todo.completedAt).toNotExist();
                expect(res.body.todo.name).toNotExist();
            })
            .end((err, res) => {
                Todo.findById(id)
                    .then((todo) => {
                        expect(todo).toExist();
                        expect(todo.completed).toBe(false);
                        expect(todo.completedAt).toNotExist();
                        expect(todo.name).toNotExist();
                        done();
                    })
                    .catch((err) => done(err));
            });
    })
});