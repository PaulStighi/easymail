const mongoose = require('mongoose');

const templateSchema = new mongoose.Schema({
    content: { type: mongoose.Schema.Types.String },
    details: { type: Object },
    locals: { type: Object }

}, { collection: 'templates' });

module.exports = mongoose.model('Template', templateSchema);