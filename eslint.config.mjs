import coreWebVitals from 'eslint-config-next/core-web-vitals'
import typescript from 'eslint-config-next/typescript'

const deepDomainImports = {
  group: ['@/domains/*/**', '!@/domains/*/client', '!@/domains/*/config'],
  message:
    'Cross-domain imports must go through the domain public API: @/domains/<name> (or its client/config entry). Within a domain, use relative imports.',
}
const appImports = {
  group: ['@/app/**'],
  message: 'Nothing may import from app/ — routes are leaves that delegate to domains.',
}
const domainImports = {
  group: ['@/domains/*', '@/domains/*/**'],
  message: 'shared/ must not import from domains/ (dependency direction: domains -> shared).',
}

const eslintConfig = [
  ...coreWebVitals,
  ...typescript,
  {
    files: ['**/*.{js,jsx,mjs,ts,tsx,mts,cts}'],
    rules: {
      // react-hooks v6 rules (new in eslint-config-next 16) flag pre-existing
      // template code; keep as warnings until the template patterns are reworked.
      'react-hooks/set-state-in-effect': 'warn',
      'react-hooks/refs': 'warn',
    },
  },
  {
    files: ['**/*.{ts,tsx,mts,cts}'],
    rules: {
      '@typescript-eslint/ban-ts-comment': 'warn',
      '@typescript-eslint/no-empty-object-type': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          args: 'after-used',
          ignoreRestSiblings: false,
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^(_|ignore)',
        },
      ],
    },
  },
  // --- architecture boundaries (see .claude/skills/architecture/SKILL.md) ---
  {
    files: ['src/domains/**/*.ts', 'src/domains/**/*.tsx', 'src/app/**/*.ts', 'src/app/**/*.tsx'],
    rules: {
      'no-restricted-imports': ['error', { patterns: [deepDomainImports, appImports] }],
    },
  },
  {
    files: ['src/shared/**/*.ts', 'src/shared/**/*.tsx'],
    rules: {
      'no-restricted-imports': ['error', { patterns: [domainImports, appImports] }],
    },
  },
  {
    // payload/ assembles domain collection/plugin configs — deep domain imports
    // are allowed here (build-time registration, not runtime coupling).
    files: ['src/payload/**/*.ts', 'src/payload/**/*.tsx'],
    rules: {
      'no-restricted-imports': ['error', { patterns: [appImports] }],
    },
  },
  {
    ignores: [
      '.next/',
      'src/payload/payload-types.ts',
      'src/payload/payload-generated-schema.ts',
      'src/app/(payload)/admin/importMap.js',
      '.claude/',
    ],
  },
]

export default eslintConfig
