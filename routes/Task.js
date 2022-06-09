const express = require('express');
const router = express.Router();
const _ = require('lodash');
const Task = require('../models/Task');

router.get('/', async function (req, res) {
    res.send('Task!');
});

// Create
router.post('/saveTask', async function (req, res) {
    console.log('[' + new Date().toUTCString() + '] Task in saving...');

    const task = new Task(Object.assign(
        // { 'scheduledFor': req.body.scheduledFor },
        { 'templateId': req.body.templateId },
        { 'batchlistId': req.body.batchlistId },
        { 'details': _.get(req.body, 'details') },
        { 'locals': _.get(req.body, 'locals') },
    ));

    try {
        const doc = await task.save();
        res.status(200).json({ 'success': true, 'message': 'Task details saved', result: doc });
    } catch (err) {
        res.status(400).json({ 'success': false, 'message': 'Error in saving Task details: ' + err });
    }
});

// Read one
router.get('/findById', async function (req, res) {
    console.log('[' + new Date().toUTCString() + '] Task in finding...');

    const task = await Task.findById(req.body.id).exec();
    res.status(200).json(task);
});

// Read all
router.get('/read', async function (req, res) {
    console.log('[' + new Date().toUTCString() + '] Task in finding all with condition...');

    const tasks = await Task.find(req.body.condition ? JSON.parse(req.body.condition) : {}).exec();

    res.status(200).json(tasks);
});

// Delete one
router.delete('/deleteById', async function (req, res) {
    console.log('[' + new Date().toUTCString() + '] Task in deleting...');

    Task.findOneAndDelete({ '_id': req.body.id })
        .then((doc) => {
            if (!doc) {
                res.status(400).json({ 'success': false, 'message': 'No task matching the id: ' + req.body.id });
            }
            else {
                res.status(200).json({ doc, 'message': 'Task deleted successfully!' });
            }
        })
        .catch((err) => {
            res.status(500).send({ 'message': 'Error in saving Task details: ' + err });
        })
});

module.exports = router;