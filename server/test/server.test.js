const expect = require('expect');
const request = require('supertest');
const {ObjectId} = require('mongodb');

var {app} = require('../server');
var {Todo} = require('../schemas/todo');
var {User} = require('../schemas/user');
var {todos, populateTodos, users, populateUsers} = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateTodos);

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
            .get(`/todos/${new ObjectId(999)}`)
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
        var id = new ObjectId();
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

describe('GET /users/me', () => {
    it('should return user if authenticated', (done) => {
        request(app)
            .get('/users/me')
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body.user).toExist();
                expect(res.body.user._id).toBe(users[0]._id.toHexString());
                expect(res.body.user.email).toBe(users[0].email);
            })
            .end(done);
    });

    it('should return 401 if not authenticated', (done) => {
        request(app)
            .get('/users/me')
            .expect(401)
            .expect((res) => {
                expect(res.body.user).toNotExist();
            })
            .end(done)
    });
});

describe('POST /users', () => {
    it('should create a user', (done) => {
        var email = 'some@any.de';
        var password = 'abcdef';

        request(app)
            .post('/users')
            .send({email, password})
            .expect(200)
            .expect((res) => {
                expect(res.get('x-auth')).toExist();
                expect(res.body.user._id).toExist();
                expect(res.body.user.email).toBe(email);
                expect(res.body.user.password).toNotBe(password);
            })
            .end((error) => {
                if (error) {
                    return done(error);
                }

                User.findOne({email}).then((user) => {
                    expect(user).toExist();
                    expect(user.email).toBe(email);
                    expect(user.password).toNotBe(password);
                    done();
                }).catch((error) => done(error));
            });
    });

    it('should return validation errors if the eamil is invalid', (done) => {
        request(app)
            .post('/users')
            .send({
                email: 'next@web.de',
                password: 'abcde'
            })
            .expect(400)
            .end(done);
    });

    it('should return validation errors if the pasword is invalid', (done) => {
        request(app)
            .post('/users')
            .send({
                email: 'nextweb.de',
                password: 'abcdef'
            })
            .expect(400)
            .end(done);
    });

    it('should not create a user if email is in use', (done) => {
        request(app)
            .post('/users')
            .send({
                email: users[0].email,
                password: users[0].password
            })
            .expect(400)
            .end(done);
    });

});

describe('POST users/login', () => {
    it('should accept email and password and respone with a token', (done) => {
        request(app)
            .post('/users/login')
            .send({
                email: users[0].email,
                password: users[0].password
            })
            .expect(200)
            .expect((res) => {
                expect(res.get('x-auth')).toExist();
            })
            .end((error, res) => {
                if (error) {
                    return done(error);
                }
                User.findOne({email: users[0].email}).then((user) => {
                    expect(user).toExist();
                    expect(user.tokens[1]).toExist();
                    expect(user.tokens[1]).toInclude({
                        access: 'auth',
                        token: res.headers['x-auth']
                    });
                    done();
                }).catch((error) => done(error));
            })
    });

    it('should reject invalid emails or password with a 401', (done) => {
        request(app)
            .post('/users/login')
            .send({
                email: users[1].email,
                password: users[1].password + 'a'
            })
            .expect(401)
            .expect((res) => {
                expect(res.get('x-auth')).toNotExist();
            })
            .end((error, res) => {
                if (error) {
                    return done(error);
                }
                User.findOne({email: users[1].email}).then((user) => {
                    expect(user).toExist();
                    expect(user.tokens.length).toBe(0);
                    done();
                }).catch((error) => done(error));
            })
    })
})