module.exports = {
  plugins: ['jest', 'react', 'react-hooks'],
  extends: [
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:jest/recommended',
    'airbnb',
  ],
  rules: {
    'max-len': [
      'error',
      {
        code: 100,
      },
    ],
    'max-classes-per-file': 'off',
    'prefer-promise-reject-errors': [
      'off',
    ],
    'react/require-default-props': [
      'off',
    ],
    'react/jsx-filename-extension': [
      'off',
    ],
    'react/prop-types': [
      'off',
    ],
    'no-return-assign': [
      'off',
    ],
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
  },
  overrides: [
    {
      extends: [
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended',
      ],
      files: [
        '**/*.ts?(x)',
      ],
      rules: {
        'no-shadow': 'off',
        '@typescript-eslint/no-shadow': 'error',
        'no-debugger': 'warn',
        'react/react-in-jsx-scope': 'off',
        'react/prop-types': 'off',
        'react/jsx-filename-extension': [
          'error',
          {
            extensions: [
              '.tsx',
            ],
          },
        ],
        'import/prefer-default-export': 'off',
      },
    },
    {
      files: [
        '**/*.stories.ts?(x)',
      ],
      rules: {
        'react/jsx-props-no-spreading': 'off',
      },
    },
  ],
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': [
        '.ts',
        '.tsx',
      ],
    },
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
      },
    },
  },
};
