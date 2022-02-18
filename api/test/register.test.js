process.env.NODE_ENV = 'test';

const server = require('../app');
const User = require('../data/models/user.js');
const chai = require('chai');
const assert = require('chai').assert;
const chaiHttp = require('chai-http');

chai.use(chaiHttp);

describe('Register', () => {
  before(async () => {
    await User.deleteMany({});
  });
  describe('POST /register', () => {
    it('creates new user', done => {
      const user = {
        login: 'Test User',
        password: 'Test Password',
        name: 'Test Name',
        surname: 'Test Surname',
      };
      chai
        .request(server)
        .post('/api/register')
        .send(user)
        .end(async (error, response) => {
          assert.strictEqual(response.status, 201);

          const createdUser = await User.findOne({ login: 'Test User' });
          assert.strictEqual(user.login, createdUser.login);
          assert.strictEqual('test user', createdUser.normalizedLogin);
          assert.strictEqual(user.name, createdUser.name);
          assert.strictEqual(user.surname, createdUser.surname);
        });
      done();
    });

    it('avoids creating user with non-unique login (case insensitive)', done => {
      const user = {
        login: 'TEST user',
        password: 'not important',
        name: 'not important',
        surname: 'not important',
      };
      chai
        .request(server)
        .post('/api/register')
        .send(user)
        .end(async (error, response) => {
          assert.strictEqual(response.status, 400);

          const duplicateUsers = await User.find({ login: 'Test User' });
          assert.strictEqual(duplicateUsers.length, 1);
        });
      done();
    });
  });
});
