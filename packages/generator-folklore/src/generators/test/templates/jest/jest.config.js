module.exports = {
    globals: {
        __DEV__: true,
    },
    setupFiles: [
        '<rootDir>/__tests__/shim.js',
        '<rootDir>/__tests__/setup.js',
    ],
    testPathIgnorePatterns: [
        '<rootDir>/(lib|es|dist)/',
        '<rootDir>/__tests__/shim.js',
        '<rootDir>/__tests__/setup.js',
        '<rootDir>/__tests__/storyshots.test.js',
    ],
    modulePathIgnorePatterns: [
        '<rootDir>/(lib|es|dist)/',
    ],
    moduleNameMapper: {
        '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': '<rootDir>/__mocks__/fileMock.js',
        '\\.(css|less|scss)$': '<rootDir>/__mocks__/styleMock.js',
    },
    collectCoverage: true,
    collectCoverageFrom: [
        '<rootDir>/src/**/*.{js,jsx}',
        '!**/node_modules/**',
        '!**/vendor/**',
        '!**/templates/**',
        '!**/__tests__/**',
        '!**/__stories__/**',
    ],
};
