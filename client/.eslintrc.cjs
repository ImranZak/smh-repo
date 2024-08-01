module.exports = {
<<<<<<< HEAD
=======
  root: true,
>>>>>>> main
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
  ],
<<<<<<< HEAD
=======
  ignorePatterns: ['dist', '.eslintrc.cjs'],
>>>>>>> main
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  settings: { react: { version: '18.2' } },
  plugins: ['react-refresh'],
  rules: {
<<<<<<< HEAD
    'react-refresh/only-export-components': 'warn',
=======
    'react/jsx-no-target-blank': 'off',
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
>>>>>>> main
  },
}
