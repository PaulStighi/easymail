const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    templateId: { type: mongoose.Schema.Types.ObjectId },
    batchId: { type: mongoose.Schema.Types.ObjectId },
    details: { type: Object },
    variableFields: { type: Object }
}, { collection: 'tasks' });

module.exports = mongoose.model('Task', taskSchema);