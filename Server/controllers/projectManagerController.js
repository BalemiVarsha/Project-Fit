// controllers/projectManagerController.js

const ProjectManager = require('../models/projectmanager');

const createProjectManager = async (req, res) => {
    try {
        await ProjectManager.create({
            username: req.body.username,
            password: req.body.password,
        });
        res.json({ status: 'ok' });
    } catch (err) {
        res.json({ status: 'error', error: 'Duplicate email' });
    }
};

const jwt = require('jsonwebtoken');


const projectManagerLogin = async (req, res) => {
    try {
        const user = await ProjectManager.findOne({
            username: req.body.username,
            password: req.body.password,
        });

        if (user) {
            const token = jwt.sign(
                { username: user.username ,password:user.password},
                'server123'
            );
            console.log('Token generated:', token);
            const expiration = 3 * 60 * 60 * 1000; // 3 hours
            res.cookie('token', token, { maxAge: expiration });
            return res.json({ status: 'ok', user: token });
        } else {
            return res.json({ status: 'error', user: false });
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({ status: 'error', error: 'Internal Server Error' });
    }
};
module.exports = { createProjectManager,projectManagerLogin };
