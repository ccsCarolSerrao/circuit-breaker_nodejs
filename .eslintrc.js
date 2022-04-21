module.exports = {
    parser: '@typescript-eslint/parser',
    parserOptions: {
        project: 'tsconfig.json',
        sourceType: 'module',
    },
    plugins: ['@typescript-eslint/eslint-plugin'],
    extends: ['plugin:@typescript-eslint/recommended', 'prettier'],
    root: true,
    env: {
        node: true,
        jest: true,
    },
    rules: {
        quotes: ['error', 'single'],
        semi: ['error', 'always'],
        curly: ['error', 'all'],
        indent: ['error', 4, { SwitchCase: 1 }],
        'max-len': ['error', { code: 150 }],
        'import/prefer-default-export': 'off',
        'import/no-extraneous-dependencies': 'off',
        'lines-between-class-members': 'off',
        'no-unused-vars': 'off',
        'no-console': ['off'],
        'no-buffer-constructor': 'error',
        '@typescript-eslint/no-empty-interface': 'off',
        '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
        '@typescript-eslint/naming-convention': [
            'warn',
            {
                selector: 'enumMember',
                format: ['camelCase', 'UPPER_CASE'],
            },
            {
                selector: 'default',
                format: ['camelCase'],
            },
            {
                selector: 'method',
                format: ['camelCase'],
            },
            {
                selector: 'variable',
                format: ['camelCase', 'UPPER_CASE'],
            },
            {
                selector: 'parameter',
                format: ['camelCase'],
                leadingUnderscore: 'allow',
            },
            {
                selector: 'memberLike',
                modifiers: ['private'],
                format: ['camelCase'],
                leadingUnderscore: 'require',
            },
            {
                selector: 'typeLike',
                format: ['PascalCase'],
            },
            {
                selector: 'interface',
                format: ['PascalCase'],
                custom: {
                    regex: '^I[A-Z][A-Za-z]+',
                    match: true,
                },
            },
        ],
        '@typescript-eslint/interface-name-prefix': 'off',
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        'no-use-before-define': 'off',
        '@typescript-eslint/no-use-before-define': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/ban-types': 'off',
    },
    settings: {
        'import/parsers': {
            '@typescript-eslint/parser': ['.ts', '.tsx'],
        },
        'import/resolver': {
            typescript: {},
        },
    },
};
