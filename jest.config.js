module.exports = {
    ...require('@yarnaimo/tss/jest.config.js'),

    moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json', 'node'],
    setupFilesAfterEnv: [
        '<rootDir>/node_modules/@yarnaimo/tss/jest.setup.js',
        '<rootDir>/jest.setup.js',
        // '<rootDir>/src/__tests__/setup-enzyme.ts',
    ],
    globals: {
        'ts-jest': {
            diagnostics: false,
            tsConfig: 'tsconfig.test.json',
        },
    },
}
