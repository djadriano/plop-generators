const fs = require('fs');
const path = require('path');
const cwd = path.resolve('.');

let config = {
    componentsDir: `src/components`,
    scssFilePath: `src/static/scss/all.scss`,
    relativeComponentsPath: '../../../components'
}

const configFilePath = `${cwd}/.mbgrc.json`;

/**
 * Check if the name is valid
 * @returns {Boolean}
 */
const validName = (type, name) => value => (/.+/.test(value)) ? true : `${type} ${name} is required`;

/**
 * Check if exists a config file
 * @returns {Boolean}
 */
const hasConfigFile = () => fs.existsSync(configFilePath);

/**
 * Load config file
 * @returns {JSON}
 */
const loadConfigFile = () => {
    let rawJsonFile = fs.readFileSync(configFilePath);
    return JSON.parse(rawJsonFile);
}

/**
 * Get the config data
 * @returns {Object}
 */
const getConfig = () => {
    if(hasConfigFile()) {
        config = {...config, ...loadConfigFile()};
    }

    return config;
}

module.exports = { getConfig, validName };
