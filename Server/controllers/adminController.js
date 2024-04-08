// adminController.js

const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');
const createAdmin = async (req, res) => {
  try {
    await Admin.create({
      username: req.body.username,
      password: req.body.password,
    });
   
    res.json({ status: 'ok' });
  } catch (err) {
    res.json({ status: 'error', error: 'Duplicate email' });
  }
};
const adminLogin = async (req, res) => {
  try {
      console.log('Received login request:', req.body);

      const user = await Admin.findOne({
          username: req.body.username,
          password: req.body.password,
      });

      if (user) {
          const token = jwt.sign(
              { username: user.username, password: user.password },
              'server123'
          );

          console.log('Token generated:', token);
          return res.json({ status: 'ok', user: token });
      } else {
          console.log('Login failed: Invalid username or password');
          return res.status(401).json({ status: 'error', error: 'Unauthorized' });
      }
  } catch (err) {
      console.error('Error occurred:', err);
      return res.status(500).json({ status: 'error', error: 'Internal Server Error' });
  }
};

module.exports = { createAdmin,adminLogin };

