const mongoose = require('mongoose');

const templateSchema = new mongoose.Schema({
    content: { type: mongoose.Schema.Types.String }
}, { collection: 'templates' });

module.exports = mongoose.model('Template', templateSchema);