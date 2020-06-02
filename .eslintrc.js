module.exports = {
    extends: [
        'eslint:recommended',
        'plugin:react/recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:prettier/recommended',
        'prettier/@typescript-eslint',
    ],
    plugins: ['@typescript-eslint', 'react'],
    parser: '@typescript-eslint/parser',
    env: {
        browser: true,
        node: true,
    },
    parserOptions: {
        sourceType: 'module',
        ecmaFeatures: {
            jsx: true,
        },
    },
    rules: {
        'react/prop-types': 'off',
        // 'react/react-in-jsx-scope': 'off',

        '@typescript-eslint/camelcase': 'off',
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/no-empty-function': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-namespace': 'off',
        '@typescript-eslint/no-unused-vars': 'off',

        'no-undef': 'off',

        'no-restricted-imports': [
            'error',
            {
                paths: [
                    'unfurl.js/src',
                    'signale',
                    'got',
                    'ky',
                    'ky-universal',
                    'dayjs',
                    'firebase',
                    'remeda',
                    'runtypes',
                    '@sindresorhus/is',
                    'type-fest',
                ],
                patterns: ['**/__mocks__/**'],
            },
        ],
    },
}
