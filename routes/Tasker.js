const express = require('express');
const router = express.Router();
const _ = require('lodash');
const Task = require('../models/Task');
const importFile = require('../scripts/importFile');

router.get('/', async function (req, res) {
    res.send('Task!');
});

// Create
router.post('/save', async function (req, res) {
    console.log('[' + new Date().toLocaleString() + '] Task in saving...');

    try {
        const task = new Task(JSON.parse(importFile.importFile(req.body.path)));
    
        if(task) {
            try {
                const doc = await task.save();
                res.status(200).json({ 'success': true, 'message': 'Task details saved', result: doc });
            } catch (err) {
                res.status(400).json({ 'success': false, 'message': 'Error in saving Task details: ' + err });
            }
        }
        else {
            res.status(400).json({ 'success': false, 'message': 'Error in saving Task details: file not found' });
        }
    } catch (err) {
        res.status(400).json({ 'success': false, 'message': 'Error in saving Task details: ' + err });
    }
});

// Read one
router.get('/findById', async function (req, res) {
    console.log('[' + new Date().toLocaleString() + '] Task in finding...');

    try {
        const task = await Task.findById(req.query.taskId).exec();
        
        res.status(200).json(task);
    } catch (err) {
        res.status(400).json({ 'success': false, 'message': 'Error in finding Task details: ' + err });
    } 
});

// Read all
router.get('/read', async function (req, res) {
    console.log('[' + new Date().toLocaleString() + '] Task in finding all with condition...');

    try {
        const tasks = await Task.find(req.query.condition ? JSON.parse(req.query.condition) : {}).exec();
    
        res.status(200).json(tasks);
    } catch (err) {
        res.status(400).json({ 'success': false, 'message': 'Error in finding all with condition Task details: ' + err });
    }
});

// Update one
router.post('/updateById', async function (req, res) {
    console.log('[' + new Date().toLocaleString() + '] Task in updating...');

    try {
        
        Task.findByIdAndUpdate(req.body.taskId, JSON.parse(req.body.updated))
            .then((doc) => {
                if (!doc) {
                    res.status(400).json({ 'success': false, 'message': 'No task matching the id: ' + req.body.taskId });
                }
                else { 
                    Task.findById(req.body.taskId)
                        .then((updatedDoc) => res.status(200).json({ updatedDoc, 'message': 'Task updated successfully!' }))
                        .catch((err) => res.status(400).json({ 'success': false, 'message': 'Error in updating Task details: ' + err }));
                }
            })
            .catch((err) => {
                res.status(500).send({ 'message': 'Error in updating Task details: ' + err });
            });
    } catch (err) { 
        res.status(500).send({ 'message': 'Error in updating Task details: ' + err });
    }
});

// Delete one
router.post('/deleteById', async function (req, res) {
    console.log('[' + new Date().toLocaleString() + '] Task in deleting...');

    Task.findOneAndDelete({ '_id': req.body.taskId })
        .then((doc) => {
            if (!doc) {
                res.status(400).json({ 'success': false, 'message': 'No task matching the id: ' + req.body.taskId });
            }
            else {
                res.status(200).json({ doc, 'message': 'Task deleted successfully!' });
            }
        })
        .catch((err) => {
            res.status(500).send({ 'message': 'Error in deleting Task details: ' + err });
        });
});

module.exports = router;