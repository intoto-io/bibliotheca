module.exports = {
  plugins: ['jest', 'react', 'react-hooks', 'prettier'],
  extends: [
    // Only for React projects
    // 'plugin:react/recommended',
    // 'plugin:react-hooks/recommended',
    'plugin:jest/recommended',
    'airbnb',
    'prettier',
  ],
  rules: {
    'max-len': [
      'warn',
      {
        code: 120,
      },
    ],
    'max-classes-per-file': 'off',
    'prefer-promise-reject-errors': ['off'],
    'react/require-default-props': ['off'],
    'react/jsx-filename-extension': ['off'],
    'react/prop-types': ['off'],
    'no-return-assign': ['off'],
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        ts: 'never',
        tsx: 'never',
        js: 'never',
        jsx: 'never',
      },
    ],
    'prettier/prettier': [
      'error',
      {
        singleQuote: true,
        printWidth: 120,
        trailingComma: 'all',
      },
    ],
  },
  overrides: [
    {
      files: ['**/*.ts?(x)'],
      rules: {
        'react/react-in-jsx-scope': 'off',
        'react/prop-types': 'off',
        'react/jsx-filename-extension': [
          'error',
          {
            extensions: ['.tsx'],
          },
        ],
      },
    },
    {
      files: ['**/*.stories.ts?(x)'],
      rules: {
        'react/jsx-props-no-spreading': 'off',
      },
    },
    {
      extends: ['plugin:@typescript-eslint/eslint-recommended', 'plugin:@typescript-eslint/recommended'],
      files: ['**/*.ts?(x)'],
      rules: {
        'no-shadow': 'off',
        '@typescript-eslint/no-shadow': 'error',
        'no-debugger': 'warn',
        'import/prefer-default-export': 'off',
      },
    },
  ],
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
      },
    },
  },
};
