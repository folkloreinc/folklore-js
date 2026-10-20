const config = {
    testEnvironment: 'jsdom',
    testPathIgnorePatterns: ['/node_modules/', '/templates/'],
    transformIgnorePatterns: ['/node_modules/(?!lodash-es/)'],
};

module.exports = config;
