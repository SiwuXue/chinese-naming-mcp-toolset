/**
 * 基础工具类 - 所有MCP工具的父类
 * Base Tool Class - Parent class for all MCP tools
 *
 * @author 鲁班 (PromptX工具开发大师)
 * @version 1.0.0
 */

class BaseTool {
  constructor(name, description, category = 'general') {
    this.name = name;
    this.description = description;
    this.category = category;
    this.version = '1.0.0';
    this.author = '鲁班 (PromptX工具开发大师)';
  }

  /**
   * 验证输入参数
   * @param {object} params - 输入参数
   * @returns {object} 验证结果 {valid: boolean, errors: string[]}
   */
  validateParams(params) {
    const schema = this.getParameterSchema();
    const errors = [];

    // 检查必需参数
    if (schema.required) {
      for (const requiredParam of schema.required) {
        if (!(requiredParam in params)) {
          errors.push(`缺少必需参数: ${requiredParam}`);
        }
      }
    }

    // 检查参数类型
    if (schema.properties) {
      for (const [paramName, paramSchema] of Object.entries(schema.properties)) {
        if (paramName in params) {
          const value = params[paramName];
          const expectedType = paramSchema.type;

          if (!this._validateType(value, expectedType)) {
            errors.push(`参数 ${paramName} 类型错误，期望 ${expectedType}`);
          }

          // 检查枚举值
          if (paramSchema.enum && !paramSchema.enum.includes(value)) {
            errors.push(`参数 ${paramName} 值无效，可选值: ${paramSchema.enum.join(', ')}`);
          }

          // 检查数值范围
          if (expectedType === 'integer' || expectedType === 'number') {
            if (paramSchema.min !== undefined && value < paramSchema.min) {
              errors.push(`参数 ${paramName} 值过小，最小值: ${paramSchema.min}`);
            }
            if (paramSchema.max !== undefined && value > paramSchema.max) {
              errors.push(`参数 ${paramName} 值过大，最大值: ${paramSchema.max}`);
            }
          }

          // 检查字符串长度
          if (expectedType === 'string') {
            if (paramSchema.minLength !== undefined && value.length < paramSchema.minLength) {
              errors.push(`参数 ${paramName} 长度过短，最小长度: ${paramSchema.minLength}`);
            }
            if (paramSchema.maxLength !== undefined && value.length > paramSchema.maxLength) {
              errors.push(`参数 ${paramName} 长度过长，最大长度: ${paramSchema.maxLength}`);
            }
          }
        }
      }
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * 验证数据类型
   * @private
   */
  _validateType(value, expectedType) {
    switch (expectedType) {
      case 'string':
        return typeof value === 'string';
      case 'number':
        return typeof value === 'number' && !isNaN(value);
      case 'integer':
        return Number.isInteger(value);
      case 'boolean':
        return typeof value === 'boolean';
      case 'array':
        return Array.isArray(value);
      case 'object':
        return typeof value === 'object' && value !== null && !Array.isArray(value);
      default:
        return true;
    }
  }

  /**
   * 执行工具逻辑 - 子类必须实现
   * @param {object} params - 输入参数
   * @returns {Promise<object>} 执行结果
   */
  async execute(params) {
    throw new Error(`工具 ${this.name} 必须实现 execute 方法`);
  }

  /**
   * 获取参数模式 - 子类必须实现
   * @returns {object} JSON Schema格式的参数定义
   */
  getParameterSchema() {
    throw new Error(`工具 ${this.name} 必须实现 getParameterSchema 方法`);
  }

  /**
   * 获取使用示例 - 子类可选实现
   * @returns {array} 使用示例数组
   */
  getExamples() {
    return [];
  }

  /**
   * 获取工具信息
   * @returns {object} 工具基本信息
   */
  getInfo() {
    return {
      name: this.name,
      description: this.description,
      category: this.category,
      version: this.version,
      author: this.author,
      parameters: this.getParameterSchema(),
      examples: this.getExamples()
    };
  }

  /**
   * 记录日志
   * @param {string} level - 日志级别 (info, warn, error)
   * @param {string} message - 日志消息
   * @param {object} data - 附加数据
   */
  log(level, message, data = {}) {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      tool: this.name,
      level,
      message,
      ...data
    };

    switch (level) {
      case 'error':
        console.error(`[${timestamp}] [${this.name}] ERROR: ${message}`, data);
        break;
      case 'warn':
        console.warn(`[${timestamp}] [${this.name}] WARN: ${message}`, data);
        break;
      default:
        console.log(`[${timestamp}] [${this.name}] INFO: ${message}`, data);
    }
  }

  /**
   * 创建标准化的成功响应
   * @param {any} data - 响应数据
   * @param {string} message - 成功消息
   * @returns {object} 标准化响应
   */
  createSuccessResponse(data, message = '执行成功') {
    return {
      success: true,
      message,
      data,
      tool: this.name,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * 创建标准化的错误响应
   * @param {string} message - 错误消息
   * @param {string} code - 错误代码
   * @param {any} details - 错误详情
   * @returns {object} 标准化错误响应
   */
  createErrorResponse(message, code = 'EXECUTION_ERROR', details = null) {
    return {
      success: false,
      error: {
        code,
        message,
        details
      },
      tool: this.name,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * 格式化输出结果
   * @param {any} result - 原始结果
   * @returns {object} 格式化后的结果
   */
  formatResult(result) {
    return result;
  }

  /**
   * 获取工具统计信息
   * @returns {object} 统计信息
   */
  getStats() {
    return {
      name: this.name,
      category: this.category,
      version: this.version,
      lastUsed: this.lastUsed || null,
      usageCount: this.usageCount || 0
    };
  }

  /**
   * 更新使用统计
   * @private
   */
  _updateStats() {
    this.lastUsed = new Date().toISOString();
    this.usageCount = (this.usageCount || 0) + 1;
  }

  /**
   * 初始化工具（异步方法，子类可选实现）
   * @returns {Promise<void>}
   */
  async initialize() {
    // 默认实现，子类可以重写
    return Promise.resolve();
  }
}

module.exports = BaseTool;
