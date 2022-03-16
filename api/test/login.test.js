process.env.NODE_ENV = 'test';

require('./register.test');

const server = require('../app');
const chai = require('chai');
const assert = require('chai').assert;
const chaiHttp = require('chai-http');

chai.use(chaiHttp);

const agent = chai.request.agent(server);

describe('Login', () => {
  describe('POST /api/login', () => {
    it('logs in and gets token in cookie', done => {
      const user = { login: 'Test-User', password: 'Test Password' };
      agent
        .post('/api/login')
        .send(user)
        .end((err, res) => {
          assert.strictEqual(res.status, 200);
          assert.exists(res.header['set-cookie']);
          const setCookieValue = String(res.header['set-cookie']);
          assert.strictEqual(setCookieValue.substring(0, 6), 'token=');
          done();
        });
    });

    it('has access to personal page after login', done => {
      agent.get('/api/users/me').end((err, res) => {
        assert.strictEqual(res.status, 200);
        done();
      });
    });
  });
});
