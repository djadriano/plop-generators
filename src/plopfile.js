const { component, template } = require('./generators');

module.exports = plop => {
    plop.setGenerator('component', component);
    plop.setGenerator('template', template);
};