const mongoose = require('mongoose');

const DB_URI =
  process.env.DB_URI ||
  `mongodb://localhost:27017/${
    process.env.NODE_ENV === 'test' ? 'vk-next-test' : 'vk-next'
  }`;

mongoose.connect(DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const connection = mongoose.connection;

module.exports = connection;
