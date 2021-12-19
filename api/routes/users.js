const express = require('express');
const router = express.Router();
const authenticateToken = require('../auth/authenticate-token');
const User = require('../data/models/user');
const changePassword = require('../auth/change-password');

// Get all users
router.get('/', async (req, res) => {
  try {
    const offset = parseInt(req.query?.offset) || 0;
    const limit = parseInt(req.query?.limit) || 0;
    let query = req.query?.find;
    const fields = 'name surname about avatarBase64 login';

    let users = [];

    if (!query) {
      users = await User.find({}, fields, {
        skip: offset,
        limit,
        sort: { name: 'asc', surname: 'asc' },
      });
    } else {
      if (query.startsWith('@')) {
        query = query.substr(1);
        users = await User.find(
          { normalizedLogin: { $regex: `.*${query}.*` } },
          fields,
          { skip: offset, limit }
        );
      } else {
        users = await User.find(
          {
            $or: [
              { name: { $regex: `.*${query}.*`, $options: 'i' } },
              { surname: { $regex: `.*${query}.*`, $options: 'i' } },
            ],
          },
          fields,
          { skip: offset, limit }
        );
      }
    }

    const totalUsers = await User.countDocuments({});

    return res.status(200).json({ totalUsers, users: [...users] });
  } catch (error) {
    console.log(error);
  }
});

// Get user by login
router.get('/:login', async (req, res) => {
  try {
    let normalizedLogin = req.params.login.toLowerCase();
    if (normalizedLogin === 'me') {
      authenticateToken(req, res);
      normalizedLogin = req.user.login.toLowerCase();
    }

    const user = await User.findOne(
      { normalizedLogin },
      'login name surname avatarBase64 about posts'
    );

    if (!user) return res.sendStatus(404);

    user.posts.reverse();
    const totalPostsLength = user.posts.length;

    const limit = parseInt(req.query?.limit) || 0;
    if (limit) user.posts = user.posts.slice(0, limit);

    return res.status(200).json({ totalPostsLength, ...user._doc });
  } catch (error) {
    console.log(error);
  }
});

// Change user's avatar/name/about/password
router.put('/:login', authenticateToken, async (req, res) => {
  try {
    const normalizedLogin = req.params.login.toLowerCase();
    if (req.user.login.toLowerCase() !== normalizedLogin) {
      return res.status(403).send('Cannot modify another user.');
    }

    const user = await User.findOne({ normalizedLogin });

    if (req.query?.type === 'avatar') user.avatarBase64 = req.body.avatar;
    else if (req.query?.type === 'name') {
      user.name = req.body.name;
      user.surname = req.body.surname;
    } else if (req.query?.type === 'about') user.about = req.body.about;
    else if (req.query?.type === 'password') {
      req.normalizedLogin = normalizedLogin;
      const { status, message, error } = await changePassword(req, res);
      if (error) throw error;
      return res.status(status).send(message);
    } else return res.sendStatus(400);

    await user.save();

    return res.sendStatus(200);
  } catch (error) {
    console.log(error);
  }
});

// Create post
router.post('/:login/posts', authenticateToken, async (req, res) => {
  try {
    const normalizedLogin = req.params.login.toLowerCase();
    const user = await User.findOne({ normalizedLogin });

    const post = {
      name: req.body.name,
      surname: req.body.surname,
      avatarBase64: req.body.avatarBase64,
      login: req.body.login,
      body: req.body.body,
      added: new Date(),
    };

    user.posts.push(post);
    await user.save();

    return res.sendStatus(200);
  } catch (error) {
    console.log(error);
  }
});

// Delete post by id
router.delete('/:login/posts/:id', authenticateToken, async (req, res) => {
  try {
    const normalizedLogin = req.params.login.toLowerCase();
    if (req.user.login.toLowerCase() !== normalizedLogin) {
      return res.status(403).send('Cannot modify another user.');
    }

    const user = await User.findOne({ normalizedLogin });
    const post = await user.posts.id(req.params.id);
    if (!post) {
      return res.status(404).send('Post not found.');
    }

    await post.remove();
    await user.save();

    return res.sendStatus(200);
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
