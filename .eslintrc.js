/**
 * ESLint 配置文件
 * 中文起名MCP工具集代码质量检查配置
 */

module.exports = {
  env: {
    browser: false,
    es2021: true,
    node: true,
    jest: true
  },
  extends: [
    'eslint:recommended',
    'standard'
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  rules: {
    // 代码风格
    'indent': ['error', 2],
    'quotes': ['error', 'single'],
    'semi': ['error', 'always'],
    'comma-dangle': ['error', 'never'],
    'no-trailing-spaces': 'error',
    'eol-last': 'error',
    'no-multiple-empty-lines': ['error', { max: 2, maxEOF: 1 }],
    'object-curly-spacing': ['error', 'always'],
    'array-bracket-spacing': ['error', 'never'],
    'computed-property-spacing': ['error', 'never'],
    'space-before-function-paren': ['error', 'never'],
    'keyword-spacing': 'error',
    'space-infix-ops': 'error',
    'space-unary-ops': 'error',
    'spaced-comment': ['error', 'always'],
    
    // 变量和函数
    'no-unused-vars': ['error', { 
      argsIgnorePattern: '^_',
      varsIgnorePattern: '^_'
    }],
    'no-var': 'error',
    'prefer-const': 'error',
    'no-undef': 'error',
    'no-redeclare': 'error',
    'no-shadow': 'error',
    'camelcase': ['error', { properties: 'never' }],
    'func-names': ['error', 'as-needed'],
    'prefer-arrow-callback': 'error',
    'arrow-spacing': 'error',
    'arrow-parens': ['error', 'as-needed'],
    
    // 对象和数组
    'object-shorthand': 'error',
    'prefer-destructuring': ['error', {
      array: false,
      object: true
    }],
    'no-array-constructor': 'error',
    'array-callback-return': 'error',
    
    // 字符串
    'prefer-template': 'error',
    'template-curly-spacing': 'error',
    'no-useless-concat': 'error',
    
    // 控制流
    'no-else-return': 'error',
    'no-lonely-if': 'error',
    'no-unneeded-ternary': 'error',
    'no-nested-ternary': 'error',
    'consistent-return': 'error',
    'default-case': 'error',
    'no-fallthrough': 'error',
    
    // 错误处理
    'no-throw-literal': 'error',
    'prefer-promise-reject-errors': 'error',
    'no-return-await': 'error',
    
    // 性能
    'no-loop-func': 'error',
    'no-await-in-loop': 'warn',
    
    // 安全
    'no-eval': 'error',
    'no-implied-eval': 'error',
    'no-new-func': 'error',
    'no-script-url': 'error',
    
    // 最佳实践
    'eqeqeq': ['error', 'always'],
    'no-console': 'warn',
    'no-debugger': 'error',
    'no-alert': 'error',
    'no-empty': 'error',
    'no-empty-function': 'error',
    'no-magic-numbers': ['warn', {
      ignore: [-1, 0, 1, 2, 100, 1000],
      ignoreArrayIndexes: true,
      ignoreDefaultValues: true
    }],
    'complexity': ['warn', 10],
    'max-depth': ['warn', 4],
    'max-lines': ['warn', 500],
    'max-lines-per-function': ['warn', 50],
    'max-params': ['warn', 5],
    
    // JSDoc
    'valid-jsdoc': ['error', {
      requireReturn: false,
      requireReturnDescription: false,
      requireParamDescription: true
    }],
    'require-jsdoc': ['warn', {
      require: {
        FunctionDeclaration: true,
        MethodDefinition: true,
        ClassDeclaration: true
      }
    }]
  },
  
  overrides: [
    {
      // 测试文件特殊规则
      files: ['test/**/*.js', '**/*.test.js', '**/*.spec.js'],
      rules: {
        'no-magic-numbers': 'off',
        'max-lines-per-function': 'off',
        'require-jsdoc': 'off'
      }
    },
    {
      // 配置文件特殊规则
      files: ['*.config.js', 'config/**/*.js'],
      rules: {
        'no-magic-numbers': 'off',
        'require-jsdoc': 'off'
      }
    },
    {
      // 脚本文件特殊规则
      files: ['scripts/**/*.js', 'bin/**/*.js'],
      rules: {
        'no-console': 'off',
        'no-process-exit': 'off',
        'require-jsdoc': 'off'
      }
    },
    {
      // 示例文件特殊规则
      files: ['examples/**/*.js'],
      rules: {
        'no-console': 'off',
        'require-jsdoc': 'off'
      }
    }
  ],
  
  globals: {
    // 全局变量
    'process': 'readonly',
    'Buffer': 'readonly',
    '__dirname': 'readonly',
    '__filename': 'readonly',
    'module': 'readonly',
    'exports': 'readonly',
    'require': 'readonly',
    'global': 'readonly',
    'console': 'readonly'
  },
  
  ignorePatterns: [
    'node_modules/',
    'build/',
    'dist/',
    'coverage/',
    '.temp/',
    'logs/',
    '*.min.js',
    'vendor/',
    'public/'
  ]
};