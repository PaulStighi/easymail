const Template = require('../models/Template');
const pug = require('pug');
const _ = require('lodash');

async function compileTemplate(task, target) {
    const templateId = _.get(task, 'templateId');

    return Template.findById(templateId).exec().then((template) => {
        const T_content = _.pick(template, 'content');

        const compiledFunction = pug.compile(T_content.content);

        const details = Object.assign(
            _.get(task, 'details'),
            { 'to': target },
            { 'html': compiledFunction(_.get(task, 'variableFields')) }
        );

        return details;
    });
}

module.exports.compileTemplate = compileTemplate;