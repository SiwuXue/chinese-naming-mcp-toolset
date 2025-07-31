/**
 * 中文起名参数验证器
 * Chinese Naming Parameter Validator
 *
 * @author 鲁班 (PromptX工具开发大师)
 * @version 1.0.0
 */

const CONSTANTS = {
  DEFAULT_COUNT: 10,
  MAX_COUNT: 50
};

/**
 * 验证并提取参数
 * @param {object} params - 输入参数
 * @param {Function} createErrorResponse - 错误响应创建函数
 * @returns {object} 验证结果
 */
function validateAndExtractParams(params, createErrorResponse) {
  const {
    surname,
    gender = 'neutral',
    style = 'modern',
    elements = [],
    avoidChars = [],
    count = CONSTANTS.DEFAULT_COUNT,
    nameLength
  } = params;

  if (!surname || surname.trim() === '') {
    return { error: createErrorResponse('姓氏不能为空') };
  }

  const validGenders = ['male', 'female', 'neutral'];
  if (!validGenders.includes(gender)) {
    return { error: createErrorResponse('性别参数无效') };
  }

  const validStyles = ['traditional', 'modern', 'poetic', 'simple'];
  if (!validStyles.includes(style)) {
    return { error: createErrorResponse('风格参数无效') };
  }

  if (count <= 0 || count > CONSTANTS.MAX_COUNT) {
    return { error: createErrorResponse(`生成数量必须在1-${CONSTANTS.MAX_COUNT}之间`) };
  }

  return { surname, gender, style, elements, avoidChars, count, nameLength };
}

/**
 * 获取参数模式
 * @returns {object} 参数模式
 */
function getParameterSchema() {
  return {
    type: 'object',
    properties: {
      surname: {
        type: 'string',
        description: '姓氏，如：张、李、王',
        minLength: 1,
        maxLength: 2
      },
      gender: {
        type: 'string',
        enum: ['male', 'female', 'neutral'],
        default: 'neutral',
        description: '性别偏向'
      },
      style: {
        type: 'string',
        enum: ['traditional', 'modern', 'poetic', 'simple'],
        default: 'modern',
        description: '起名风格'
      },
      elements: {
        type: 'array',
        items: { type: 'string' },
        description: '希望体现的元素，如：智慧、美丽、勇敢'
      },
      avoidChars: {
        type: 'array',
        items: { type: 'string' },
        description: '避免使用的字符'
      },
      count: {
        type: 'integer',
        default: 10,
        min: 1,
        max: 50,
        description: '生成名字数量'
      },
      nameLength: {
        type: 'integer',
        min: 1,
        max: 2,
        description: '名字长度（1为单字名，2为双字名）'
      }
    },
    required: ['surname']
  };
}

/**
 * 获取使用示例
 * @returns {array} 示例数组
 */
function getExamples() {
  return [
    {
      title: '基础用法',
      input: {
        surname: '张',
        gender: 'female',
        style: 'traditional'
      },
      description: '为张姓女性生成传统风格的名字'
    },
    {
      title: '高级定制',
      input: {
        surname: '李',
        gender: 'male',
        style: 'modern',
        elements: ['智慧', '勇敢'],
        avoidChars: ['病', '死'],
        count: 15
      },
      description: '为李姓男性生成现代风格名字，体现智慧和勇敢，避免不吉利字符'
    },
    {
      title: '诗意风格',
      input: {
        surname: '王',
        style: 'poetic',
        nameLength: 2,
        count: 8
      },
      description: '为王姓生成诗意风格的双字名'
    }
  ];
}

module.exports = {
  validateAndExtractParams,
  getParameterSchema,
  getExamples
};
