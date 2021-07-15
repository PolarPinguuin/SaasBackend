"use strict"
const express = require('express');
const router = express.Router();
const userController = require('../controllers/users');
const {getUsers,getUsersById, getFile, createUser, uploadFile} = userController;
const {responseToJson} = require('../helpers');

router.post('/users', createUser, responseToJson('users'));
router.post('/upload', uploadFile, responseToJson('upload'));
router.get('/upload', getFile, responseToJson('upload'));
module.exports = router;
