process.env.NODE_ENV = 'test';

require('./login.test');

const server = require('../app');
const chai = require('chai');
const User = require('../data/models/user.js');
const assert = require('chai').assert;
const chaiHttp = require('chai-http');

chai.use(chaiHttp);

const agent = chai.request.agent(server);

describe('Users', () => {
  before(async () => {
    await User.deleteMany({});
    for (let i = 0; i < 13; i++) {
      await chai
        .request(server)
        .post('/api/register')
        .send({
          login: `test-${i}`,
          password: `test-${i}`,
          name: `test-${i}`,
          surname: `test-${i}`,
        });
    }
    await agent
      .post('/api/login')
      .send({ login: 'test-0', password: 'test-0' });
  });
  describe('GET /api/users', () => {
    it('returns all 13 users', done => {
      chai
        .request(server)
        .get('/api/users')
        .end((err, res) => {
          assert.strictEqual(res.status, 200);
          assert.isObject(res.body);
          assert.strictEqual(res.body.totalUsers, 13);
          assert.isArray(res.body.users);
          assert.strictEqual(res.body.users.length, 13);
          done();
        });
    });

    it('returns first 3 users (limit = 3, offset = 0)', done => {
      chai
        .request(server)
        .get('/api/users')
        .query({ limit: 3, offset: 0 })
        .end((err, res) => {
          assert.strictEqual(res.status, 200);
          assert.isObject(res.body);
          assert.strictEqual(res.body.totalUsers, 13);
          assert.isArray(res.body.users);
          const users = res.body.users;
          assert.strictEqual(users.length, 3);

          // alphabet sorting by name
          assert.strictEqual(users[0].name, 'test-0');
          assert.strictEqual(users[1].name, 'test-1');
          assert.strictEqual(users[2].name, 'test-10');
          done();
        });
    });

    it('returns second 3 users (limit = 3, offset = 3)', done => {
      chai
        .request(server)
        .get('/api/users')
        .query({ limit: 3, offset: 3 })
        .end((err, res) => {
          assert.strictEqual(res.status, 200);
          assert.isObject(res.body);
          assert.strictEqual(res.body.totalUsers, 13);
          assert.isArray(res.body.users);
          const users = res.body.users;
          assert.strictEqual(users.length, 3);

          // alphabet sorting by name
          assert.strictEqual(users[0].name, 'test-11');
          assert.strictEqual(users[1].name, 'test-12');
          assert.strictEqual(users[2].name, 'test-2');
          done();
        });
    });

    it('returns first 15 users of 13 max (limit = 15, offset = 0)', done => {
      chai
        .request(server)
        .get('/api/users')
        .query({ limit: 15, offset: 0 })
        .end((err, res) => {
          assert.strictEqual(res.status, 200);
          assert.isObject(res.body);
          assert.strictEqual(res.body.totalUsers, 13);
          assert.isArray(res.body.users);
          const users = res.body.users;
          assert.strictEqual(users.length, 13);
          done();
        });
    });

    it('returns last 4 users starting at 10 (limit = 4, offset = 10)', done => {
      chai
        .request(server)
        .get('/api/users')
        .query({ limit: 4, offset: 10 })
        .end((err, res) => {
          assert.strictEqual(res.status, 200);
          assert.isObject(res.body);
          assert.strictEqual(res.body.totalUsers, 13);
          assert.isArray(res.body.users);
          const users = res.body.users;
          assert.strictEqual(users.length, 3);

          // alphabet sorting by name
          assert.strictEqual(users[0].name, 'test-7');
          assert.strictEqual(users[1].name, 'test-8');
          assert.strictEqual(users[2].name, 'test-9');
          done();
        });
    });

    it('returns status 400 if limit is not a number', done => {
      chai
        .request(server)
        .get('/api/users')
        .query({ limit: 'not-a-number' })
        .end((err, res) => {
          assert.strictEqual(res.status, 400);
          done();
        });
    });

    it('returns status 400 if offset is not a number', done => {
      chai
        .request(server)
        .get('/api/users')
        .query({ offset: 'not-a-number' })
        .end((err, res) => {
          assert.strictEqual(res.status, 400);
          done();
        });
    });

    it('finds one user for the exact login request (find = @test-8)', done => {
      chai
        .request(server)
        .get('/api/users')
        .query({ find: '@test-8' })
        .end((err, res) => {
          assert.strictEqual(res.status, 200);
          assert.strictEqual(res.body.users.length, 1);
          assert.strictEqual(res.body.users[0].name, 'test-8');
          done();
        });
    });

    it('finds one user for the exact name request (find = test-8)', done => {
      chai
        .request(server)
        .get('/api/users')
        .query({ find: 'test-8' })
        .end((err, res) => {
          assert.strictEqual(res.status, 200);
          assert.strictEqual(res.body.users.length, 1);
          assert.strictEqual(res.body.users[0].login, 'test-8');
          done();
        });
    });

    it('returns status 200 with empty body if no users found with provided login', done => {
      chai
        .request(server)
        .get('/api/users')
        .query({ find: '@no-such-user' })
        .end((err, res) => {
          assert.strictEqual(res.status, 200);
          assert.strictEqual(res.body.users.length, 0);
          done();
        });
    });

    it('returns status 200 with empty body if no users found with provided name', done => {
      chai
        .request(server)
        .get('/api/users')
        .query({ find: 'no-such-user' })
        .end((err, res) => {
          assert.strictEqual(res.status, 200);
          assert.strictEqual(res.body.users.length, 0);
          done();
        });
    });

    it('returns 2 of 4 users bounded by limit for incomplete search request', done => {
      chai
        .request(server)
        .get('/api/users')
        .query({ find: '@test-1', limit: 2 })
        .end((err, res) => {
          assert.strictEqual(res.status, 200);
          assert.strictEqual(res.body.users.length, 2);
          done();
        });
    });
  });

  describe('GET /api/users/:login', () => {
    it('returns user by login', done => {
      chai
        .request(server)
        .get('/api/users/test-11')
        .end((err, res) => {
          assert.strictEqual(res.status, 200);
          assert.strictEqual(res.body.name, 'test-11');
          assert.strictEqual(res.body.surname, 'test-11');
          assert.strictEqual(res.body.login, 'test-11');
          done();
        });
    });
  });

  describe('PUT /api/users/:login', () => {
    it("sets own user's avatar", done => {
      agent
        .put('/api/users/test-0')
        .query({ type: 'avatar' })
        .send({ avatar: 'base64string' })
        .end(async (err, res) => {
          assert.strictEqual(res.status, 200);
          const user = await User.findOne({ login: 'test-0' });
          assert.strictEqual(user.avatarBase64, 'base64string');
          done();
        });
    });

    it("returns status 403 if trying to change other user's avatar", done => {
      agent
        .put('/api/users/test-1')
        .query({ type: 'avatar' })
        .send({ avatar: 'shouldNotChange' })
        .end(async (err, res) => {
          assert.strictEqual(res.status, 403);
          done();
        });
    });

    it("sets own user's status", done => {
      agent
        .put('/api/users/test-0')
        .query({ type: 'about' })
        .send({ about: 'status' })
        .end(async (err, res) => {
          assert.strictEqual(res.status, 200);
          const user = await User.findOne({ login: 'test-0' });
          assert.strictEqual(user.about, 'status');
          done();
        });
    });

    it("returns status 403 if trying to change other user's status", done => {
      agent
        .put('/api/users/test-1')
        .query({ type: 'status' })
        .send({ about: 'shouldNotChange' })
        .end(async (err, res) => {
          assert.strictEqual(res.status, 403);
          done();
        });
    });

    it("sets own user's name and surname", done => {
      agent
        .put('/api/users/test-0')
        .query({ type: 'name' })
        .send({ name: 'NewName', surname: 'NewSurname' })
        .end(async (err, res) => {
          assert.strictEqual(res.status, 200);
          const user = await User.findOne({ login: 'test-0' });
          assert.strictEqual(user.name, 'NewName');
          assert.strictEqual(user.surname, 'NewSurname');
          done();
        });
    });

    it("returns status 403 if trying to change other user's name and surname", done => {
      agent
        .put('/api/users/test-1')
        .query({ type: 'name' })
        .send({ name: 'shouldNotChange', surname: 'shouldNotChange' })
        .end(async (err, res) => {
          assert.strictEqual(res.status, 403);
          done();
        });
    });

    it("sets own user's password", done => {
      agent
        .put('/api/users/test-0')
        .query({ type: 'password' })
        .send({ newPassword: 'changed', oldPassword: 'test-0' })
        .end(async (err, res) => {
          assert.strictEqual(res.status, 200);
          agent
            .post('/api/login')
            .send({ login: 'test-0', password: 'changed' })
            .end((err, res) => {
              assert.strictEqual(res.status, 200);
              agent.get('/api/users/me').end((err, res) => {
                assert.strictEqual(res.status, 200);
                done();
              });
            });
        });
    });
  });
});
