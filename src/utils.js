const validName = (type, name) => {
    return value => (/.+/.test(value)) ? true : `${type} ${name} is required`;
};

module.exports = { validName };
