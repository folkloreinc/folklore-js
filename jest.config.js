module.exports = {
    setupFiles: [
        '<rootDir>/__tests__/shim.js',
        '<rootDir>/__tests__/setup.js',
    ],
    testPathIgnorePatterns: [
        '<rootDir>/packages/[^/]+/lib/',
        '<rootDir>/packages/[^/]+/es/',
        '<rootDir>/packages/[^/]+/dist/',
        '<rootDir>/packages/generator-folklore/lib/',
        '<rootDir>/packages/generator-folklore/src/generators/[^/]+/templates/',
        '<rootDir>/__tests__/shim.js',
        '<rootDir>/__tests__/setup.js',
        '<rootDir>/__tests__/storyshots.test.js',
    ],
    modulePathIgnorePatterns: [
        '<rootDir>/packages/[^/]+/lib/',
        '<rootDir>/packages/[^/]+/es/',
        '<rootDir>/packages/[^/]+/dist/',
        '<rootDir>/packages/generator-folklore/lib/generators/[^/]+/templates/',
        '<rootDir>/packages/generator-folklore/src/generators/[^/]+/templates/',
    ],
    moduleNameMapper: {
        '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': '<rootDir>/__mocks__/fileMock.js',
        '\\.(css|less|scss)$': '<rootDir>/__mocks__/styleMock.js',
        '^@folklore/(.*)': '<rootDir>/packages/$1/src/index.js',
    },
    transformIgnorePatterns: [
        'node_modules/(?!(@folklore|react-intl)/)',
    ],
    collectCoverage: true,
    collectCoverageFrom: [
        'packages/*/src/**/*.{js,jsx}',
        '!packages/*/src/generators/*/templates/**',
        '!**/node_modules/**',
        '!**/vendor/**',
        '!**/__tests__/**',
        '!**/__stories__/**',
    ],
};
