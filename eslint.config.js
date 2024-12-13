import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import react from 'eslint-plugin-react'
import importPlugin from 'eslint-plugin-import';
import denoPlugin from 'eslint-plugin-deno'

export default tseslint.config(
  { ignores: ['dist', 'capacitor.config.ts', 'android', 'ios', 'src/router.ts', 'src/domains/db/supabaseTypes.ts'] },
  {
    extends: [
      js.configs.recommended,
      importPlugin.flatConfigs.recommended,
      ...tseslint.configs.strictTypeChecked,
    ],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json', './deno.tsconfig.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
    settings: {
      react: { version: '18.3' },
      "import/parsers": {
        "@typescript-eslint/parser": [".ts", ".tsx"],
      },
      "import/resolver": {
        "typescript": {
          "alwaysTryTypes": true, // always try to resolve types under `<root>@types` directory even it doesn't contain any source code, like `@types/unist`

          // Choose from one of the "project" configs below or omit to use <root>/tsconfig.json by default

          // use <root>/path/to/folder/tsconfig.json
          "project": "./",
          "typescript": true,
        }
      }
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      react,
      importPlugin,
      denoPlugin
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      ...react.configs.recommended.rules,
      ...react.configs['jsx-runtime'].rules,
      "@typescript-eslint/no-unsafe-assignment": "off",
      "@typescript-eslint/no-unsafe-call": "off",
      'import/no-dynamic-require': 'warn',
      'import/no-nodejs-modules': 'warn',
      "import/named": "error",
      "import/namespace": "error",
      "import/default": "error",
      "import/export": "error",
      'import/no-duplicates': 'error',
      'import/order': [
        'error',
        {
          groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
          'newlines-between': 'always-and-inside-groups',
          alphabetize: { order: 'asc', caseInsensitive: true },
        },
      ],
      'max-len': ['error', { code: 100, tabWidth: 2, ignoreComments: true }],
    },
  },
)
