const isFunction = require('lodash/isFunction');

const getConfigValue = (val, ...args) => (isFunction(val) ? val(...args) : val);

module.exports = getConfigValue;
