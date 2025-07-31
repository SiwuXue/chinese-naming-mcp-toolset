/**
 * Prettier 配置文件
 * 中文起名MCP工具集代码格式化配置
 */

module.exports = {
  // 基本格式化选项
  printWidth: 100,              // 每行最大字符数
  tabWidth: 2,                  // 缩进空格数
  useTabs: false,               // 使用空格而不是制表符
  semi: true,                   // 语句末尾添加分号
  singleQuote: true,            // 使用单引号
  quoteProps: 'as-needed',      // 对象属性引号：仅在需要时添加
  
  // JavaScript 特定选项
  jsxSingleQuote: true,         // JSX 中使用单引号
  trailingComma: 'none',        // 尾随逗号：不添加
  bracketSpacing: true,         // 对象字面量的括号间添加空格
  bracketSameLine: false,       // 多行元素的 > 放在下一行
  arrowParens: 'avoid',         // 箭头函数参数括号：仅在需要时添加
  
  // 范围格式化
  rangeStart: 0,                // 格式化范围开始
  rangeEnd: Infinity,           // 格式化范围结束
  
  // 解析器选项
  parser: undefined,            // 自动检测解析器
  filepath: undefined,          // 文件路径（用于解析器推断）
  requirePragma: false,         // 不需要 pragma 注释
  insertPragma: false,          // 不插入 pragma 注释
  
  // 换行选项
  proseWrap: 'preserve',        // Markdown 文本换行：保持原样
  
  // HTML 选项
  htmlWhitespaceSensitivity: 'css',  // HTML 空白敏感性
  
  // Vue 选项
  vueIndentScriptAndStyle: false,    // Vue 文件中不缩进 <script> 和 <style>
  
  // 行尾序列
  endOfLine: 'lf',              // 使用 LF 换行符
  
  // 嵌入语言格式化
  embeddedLanguageFormatting: 'auto',  // 自动格式化嵌入的代码
  
  // 单属性 HTML 元素不换行
  singleAttributePerLine: false,
  
  // 覆盖特定文件类型的配置
  overrides: [
    {
      files: '*.json',
      options: {
        printWidth: 80,
        tabWidth: 2
      }
    },
    {
      files: '*.md',
      options: {
        printWidth: 80,
        proseWrap: 'always',
        tabWidth: 2
      }
    },
    {
      files: '*.yml',
      options: {
        tabWidth: 2,
        singleQuote: false
      }
    },
    {
      files: '*.yaml',
      options: {
        tabWidth: 2,
        singleQuote: false
      }
    },
    {
      files: '*.html',
      options: {
        printWidth: 120,
        tabWidth: 2,
        htmlWhitespaceSensitivity: 'ignore'
      }
    },
    {
      files: '*.css',
      options: {
        printWidth: 120,
        singleQuote: false
      }
    },
    {
      files: '*.scss',
      options: {
        printWidth: 120,
        singleQuote: false
      }
    },
    {
      files: '*.less',
      options: {
        printWidth: 120,
        singleQuote: false
      }
    },
    {
      files: 'package.json',
      options: {
        printWidth: 80,
        tabWidth: 2
      }
    },
    {
      files: '*.config.js',
      options: {
        printWidth: 120,
        singleQuote: true
      }
    },
    {
      files: 'test/**/*.js',
      options: {
        printWidth: 120
      }
    },
    {
      files: 'scripts/**/*.js',
      options: {
        printWidth: 120
      }
    }
  ]
};