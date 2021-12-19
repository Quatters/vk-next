const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const app = express();

const host = 'localhost';
const port = 3001;
require('dotenv').config();

/* --- Database --- */

const connection = require('./config/db.config');
connection.once('open', () =>
  console.log('Database connected successfully.\n')
);
connection.on('error', () => console.log('Database connection error.\n'));

/* --- Middleware --- */

app.use(cookieParser());
app.use(express.json({ limit: '50mb' }));
app.use(
  cors({
    credentials: true,
    origin: [
      'http://localhost:3001',
      'http://localhost:3000',
      process.env.SERVER_NAME || '',
    ],
  })
);
app.use(express.static(__dirname + '/client/'));

/* --- Routes --- */

app.use('/api/login', require('./routes/login.js'));
app.use('/api/logout', require('./routes/logout.js'));
app.use('/api/register', require('./routes/register.js'));
app.use('/api/users', require('./routes/users.js'));
app.use('/', require('./routes/get-client.js'));

/* --- Starting point --- */

app.listen(port, host, () => {
  console.log(`Server listens http://${host}:${port}`);
});
