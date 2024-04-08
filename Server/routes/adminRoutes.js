// adminRoutes.js

const express = require('express');
const router = express.Router();
const { createAdmin,adminLogin } = require('../controllers/adminController');
const { authenticateToken } = require('../middlewares/auth');

// Routes
router.post('/api/admincreation', createAdmin);
router.post('/api/adminlogin', adminLogin);

module.exports = router;
