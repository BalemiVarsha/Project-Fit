// routes/projectManagerRoutes.js

const express = require('express');
const router = express.Router();
const { createProjectManager,projectManagerLogin } = require('../controllers/projectManagerController');

// Route for creating a project manager
router.post('/api/projectmanagercreation', createProjectManager);
router.post('/api/projectmanagerlogin', projectManagerLogin);

module.exports = router;
