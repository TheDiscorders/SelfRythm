module.exports = {
    env: {
        es6: true,
        node: true,
        browser: true
    },
    parserOptions: {
        ecmaVersion: 8,
        sourceType: 'module',
        ecmaFeatures: {
            experimentalObjectRestSpread: true
        }
    },
    extends: ['eslint:recommended', '@hellomouse'],
    rules: {
        'indent': ['error', 4],
        'curly': ['error', 'multi'],
        'padded-blocks': [
            'error',
            {
                blocks: 'never'
            }
        ],
        'one-var': 'off',
        'space-unary-ops': [
            'error',
            {
                words: true,
                nonwords: false
            }
        ],
        'padding-line-between-statements': [
            'error',
            { blankLine: 'any', prev: '*', next: 'return' },
            { blankLine: 'any', prev: ['const', 'let'], next: '*' },
            { blankLine: 'any', prev: ['const', 'let'], next: ['const', 'let'] }
        ],
        'no-shadow': 'error',
        'no-useless-return': 'error',
        'block-scoped-var': 'error',
        'no-else-return': 'error',
        'no-undef-init': 'error'
    }
};
