const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    scheduledFor: { type: mongoose.Schema.Types.Date },
    templateId: { type: mongoose.Schema.Types.ObjectId },
    batchlistId: { type: mongoose.Schema.Types.ObjectId },
    details: { type: Object },
    locals: { type: Object }
}, { collection: 'tasks' });

module.exports = mongoose.model('Task', taskSchema);