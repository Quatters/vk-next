const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const dbConnection = require('./data/db.config');
const dotenv = require('dotenv');

const app = express();

const port = process.env.PORT || 3001;
dotenv.config();

/* --- Database --- */

dbConnection.once('open', () =>
  console.log('Database connected successfully.\n')
);
dbConnection.on('error', () => console.log('Database connection error.\n'));
dbConnection.on('close', () =>
  console.log('Database connection has been closed.')
);

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

app.listen(port, () => {
  console.log(`Server listens port ${port}`);
});

module.exports = app;
