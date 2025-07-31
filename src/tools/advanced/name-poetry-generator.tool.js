/**
 * 姓名诗词生成器 - 高级扩展工具
 * Name Poetry Generator - Advanced Extension Tool
 * 
 * @author 鲁班 (PromptX工具开发大师)
 * @version 1.0.0
 */

const BaseTool = require('../../utils/base-tool.js');

class NamePoetryGenerator extends BaseTool {
  constructor() {
    super(
      'name-poetry-generator',
      '基于姓名创作相关诗词，包括藏头诗、嵌名诗等多种形式',
      'advanced'
    );
    
    // 初始化诗词生成数据
    this.initializePoetryData();
  }
  
  /**
   * 初始化诗词生成数据
   */
  initializePoetryData() {
    // 诗词格式类型
    this.poetryFormats = {
      '藏头诗': {
        description: '每句诗的第一个字组成姓名',
        structure: 'acrostic',
        difficulty: 'medium',
        popularity: 'high',
        example: '张灯结彩迎新年\n雅韵悠扬传四方\n琪花瑶草满庭芳'
      },
      '嵌名诗': {
        description: '姓名字符嵌入诗句中间',
        structure: 'embedded',
        difficulty: 'high',
        popularity: 'medium',
        example: '春风送暖张帆起\n雅士吟诗琪树下'
      },
      '回文诗': {
        description: '正读倒读都成诗的特殊形式',
        structure: 'palindrome',
        difficulty: 'very_high',
        popularity: 'low',
        example: '雅韵悠悠韵雅\n琪花朵朵花琪'
      },
      '拆字诗': {
        description: '将姓名字符拆解重组成诗',
        structure: 'decomposed',
        difficulty: 'high',
        popularity: 'low',
        example: '弓长张弓射天狼\n隹住雅鸟栖梧桐'
      },
      '意境诗': {
        description: '根据姓名含义创作意境诗',
        structure: 'thematic',
        difficulty: 'medium',
        popularity: 'high',
        example: '智者如水润无声\n慧心明月照前程'
      }
    };
    
    // 诗词韵律
    this.poetryRhymes = {
      '平水韵': {
        description: '传统诗词韵律标准',
        categories: {
          '上平声': ['东', '冬', '江', '支', '微', '鱼', '虞', '齐', '佳', '灰', '真', '文', '元', '寒', '删'],
          '下平声': ['先', '萧', '肴', '豪', '歌', '麻', '阳', '庚', '青', '蒸', '尤', '侵', '覃', '盐', '咸'],
          '上声': ['董', '肿', '讲', '纸', '尾', '语', '麌', '荠', '蟹', '贿', '轸', '吻', '阮', '旱', '潸'],
          '去声': ['送', '宋', '绛', '寘', '未', '御', '遇', '霁', '泰', '卦', '震', '问', '愿', '翰', '谏']
        }
      },
      '新韵': {
        description: '现代汉语拼音韵律',
        categories: {
          'a韵': ['a', 'ia', 'ua'],
          'o韵': ['o', 'uo'],
          'e韵': ['e', 'ie', 'ue'],
          'i韵': ['i', 'ei', 'ui'],
          'u韵': ['u', 'ou', 'iu']
        }
      }
    };
    
    // 诗词主题模板
    this.poetryThemes = {
      '品格赞美': {
        keywords: ['德', '仁', '义', '礼', '智', '信', '雅', '正'],
        templates: [
          '{char}德如山高耸立，品格如金永不移',
          '{char}雅风范传千古，高洁品格世人钦',
          '{char}正气浩然天地间，品德高尚众人赞'
        ],
        mood: 'praise',
        style: 'classical'
      },
      '才华展现': {
        keywords: ['智', '慧', '文', '才', '学', '书', '诗', '画'],
        templates: [
          '{char}慧如泉涌思如潮，才华横溢震九霄',
          '{char}文满腹诗书香，学富五车名远扬',
          '{char}智超群众人羡，才思敏捷冠群贤'
        ],
        mood: 'admiration',
        style: 'elegant'
      },
      '自然美景': {
        keywords: ['春', '夏', '秋', '冬', '花', '月', '山', '水'],
        templates: [
          '{char}花盛开满园香，美景如画醉心房',
          '{char}月当空照大地，清辉洒向万家庭',
          '{char}山巍峨入云霄，壮美河山气势豪'
        ],
        mood: 'peaceful',
        style: 'natural'
      },
      '志向抱负': {
        keywords: ['志', '向', '梦', '想', '建', '立', '成', '功'],
        templates: [
          '{char}志凌云气冲天，雄心壮志永向前',
          '{char}想成真不是梦，努力奋斗定成功',
          '{char}立大志展宏图，建功立业写春秋'
        ],
        mood: 'inspiring',
        style: 'heroic'
      },
      '情感表达': {
        keywords: ['爱', '情', '思', '念', '心', '意', '缘', '份'],
        templates: [
          '{char}情深深如海洋，真心相伴到天荒',
          '{char}思君不见君，相思如流水',
          '{char}心相印两情悦，天涯海角不分别'
        ],
        mood: 'romantic',
        style: 'tender'
      }
    };
    
    // 常用诗词词汇库
    this.poetryVocabulary = {
      '形容词': {
        '美好': ['美', '好', '佳', '优', '秀', '雅', '清', '纯', '真', '善'],
        '高大': ['高', '大', '巍', '峨', '雄', '伟', '壮', '丽', '宏', '伟'],
        '明亮': ['明', '亮', '光', '辉', '灿', '烂', '耀', '眼', '闪', '烁'],
        '温柔': ['温', '柔', '软', '和', '暖', '慈', '爱', '善', '良', '仁']
      },
      '名词': {
        '自然': ['山', '水', '花', '草', '树', '林', '云', '月', '星', '日'],
        '建筑': ['楼', '台', '亭', '阁', '殿', '堂', '院', '园', '桥', '塔'],
        '文化': ['诗', '书', '画', '琴', '棋', '文', '墨', '笔', '纸', '砚'],
        '品德': ['德', '仁', '义', '礼', '智', '信', '忠', '孝', '廉', '耻']
      },
      '动词': {
        '动作': ['行', '走', '跑', '飞', '游', '舞', '唱', '笑', '哭', '思'],
        '创造': ['建', '立', '造', '创', '制', '作', '写', '画', '雕', '刻'],
        '学习': ['学', '习', '读', '写', '思', '考', '研', '究', '探', '索'],
        '情感': ['爱', '恨', '喜', '怒', '哀', '乐', '思', '念', '想', '望']
      }
    };
    
    // 诗词格律模板
    this.meterTemplates = {
      '五言绝句': {
        pattern: '仄仄平平仄，平平仄仄平。平平平仄仄，仄仄仄平平。',
        structure: [5, 5, 5, 5],
        rhyme: [2, 4],
        description: '五言四句，二四句押韵'
      },
      '七言绝句': {
        pattern: '平平仄仄仄平平，仄仄平平仄仄平。仄仄平平平仄仄，平平仄仄仄平平。',
        structure: [7, 7, 7, 7],
        rhyme: [2, 4],
        description: '七言四句，二四句押韵'
      },
      '五言律诗': {
        pattern: '仄仄平平仄，平平仄仄平。平平平仄仄，仄仄仄平平。仄仄平平仄，平平仄仄平。平平平仄仄，仄仄仄平平。',
        structure: [5, 5, 5, 5, 5, 5, 5, 5],
        rhyme: [2, 4, 6, 8],
        description: '五言八句，偶数句押韵'
      },
      '七言律诗': {
        pattern: '平平仄仄仄平平，仄仄平平仄仄平。仄仄平平平仄仄，平平仄仄仄平平。平平仄仄平平仄，仄仄平平仄仄平。仄仄平平平仄仄，平平仄仄仄平平。',
        structure: [7, 7, 7, 7, 7, 7, 7, 7],
        rhyme: [2, 4, 6, 8],
        description: '七言八句，偶数句押韵'
      }
    };
    
    // 经典诗词参考
    this.classicalReferences = {
      '唐诗': {
        '李白': {
          style: '豪放飘逸',
          characteristics: ['想象丰富', '语言华美', '气势磅礴'],
          examples: ['床前明月光，疑是地上霜', '飞流直下三千尺，疑是银河落九天']
        },
        '杜甫': {
          style: '沉郁顿挫',
          characteristics: ['现实主义', '忧国忧民', '技巧精湛'],
          examples: ['国破山河在，城春草木深', '会当凌绝顶，一览众山小']
        },
        '王维': {
          style: '清新淡雅',
          characteristics: ['山水田园', '禅意深远', '意境优美'],
          examples: ['明月松间照，清泉石上流', '独在异乡为异客，每逢佳节倍思亲']
        }
      },
      '宋词': {
        '苏轼': {
          style: '豪放派',
          characteristics: ['气势雄伟', '感情奔放', '想象奇特'],
          examples: ['大江东去，浪淘尽，千古风流人物', '但愿人长久，千里共婵娟']
        },
        '李清照': {
          style: '婉约派',
          characteristics: ['情感细腻', '语言清丽', '意境深远'],
          examples: ['寻寻觅觅，冷冷清清，凄凄惨惨戚戚', '生当作人杰，死亦为鬼雄']
        }
      }
    };
  }
  
  /**
   * 执行诗词生成
   * @param {object} params - 输入参数
   * @returns {Promise<object>} 生成结果
   */
  async execute(params) {
    try {
      this._updateStats();
      this.log('info', '开始诗词生成', params);
      
      const { 
        fullName, 
        poetryType = 'acrostic',
        style = 'classical',
        theme = 'auto',
        meter = '七言绝句',
        rhymeScheme = '平水韵',
        count = 1,
        customRequirements = []
      } = params;
      
      // 解析姓名
      const nameStructure = this.parseNameStructure(fullName);
      
      // 确定主题
      const selectedTheme = theme === 'auto' ? 
        this.autoSelectTheme(nameStructure) : theme;
      
      // 生成诗词
      const poems = [];
      for (let i = 0; i < count; i++) {
        const poem = await this.generatePoetry({
          nameStructure,
          poetryType,
          style,
          theme: selectedTheme,
          meter,
          rhymeScheme,
          customRequirements
        });
        poems.push(poem);
      }
      
      const result = {
        fullName,
        nameStructure,
        poetryType,
        style,
        theme: selectedTheme,
        meter,
        rhymeScheme,
        poems,
        analysis: this.analyzePoetry(poems),
        suggestions: this.generateSuggestions(nameStructure, poems)
      };
      
      this.log('info', '诗词生成完成');
      return this.createSuccessResponse(result);
      
    } catch (error) {
      this.log('error', '诗词生成时发生错误', { error: error.message });
      return this.createErrorResponse(error.message);
    }
  }
  
  /**
   * 解析姓名结构
   * @param {string} fullName - 完整姓名
   * @returns {object} 姓名结构信息
   */
  parseNameStructure(fullName) {
    const characters = fullName.split('');
    
    // 简化的姓氏识别
    const commonSurnames = ['张', '王', '李', '赵', '刘', '陈', '杨', '黄', '周', '吴'];
    const compoundSurnames = ['欧阳', '太史', '端木', '上官', '司马'];
    
    let surname = '';
    let givenName = '';
    
    // 检查复姓
    const twoCharPrefix = characters.slice(0, 2).join('');
    if (compoundSurnames.includes(twoCharPrefix)) {
      surname = twoCharPrefix;
      givenName = characters.slice(2).join('');
    } else {
      surname = characters[0];
      givenName = characters.slice(1).join('');
    }
    
    return {
      fullName,
      surname,
      givenName,
      characters,
      totalLength: characters.length,
      structure: `${surname.length}+${givenName.length}`
    };
  }
  
  /**
   * 自动选择主题
   * @param {object} nameStructure - 姓名结构
   * @returns {string} 选择的主题
   */
  autoSelectTheme(nameStructure) {
    const characters = nameStructure.characters;
    
    // 根据字符特征选择主题
    for (const [themeName, themeData] of Object.entries(this.poetryThemes)) {
      for (const char of characters) {
        if (themeData.keywords.includes(char)) {
          return themeName;
        }
      }
    }
    
    // 默认主题
    return '品格赞美';
  }
  
  /**
   * 生成诗词
   * @param {object} options - 生成选项
   * @returns {object} 诗词对象
   */
  async generatePoetry(options) {
    const {
      nameStructure,
      poetryType,
      style,
      theme,
      meter,
      rhymeScheme,
      customRequirements
    } = options;
    
    let poem;
    
    switch (poetryType) {
      case 'acrostic':
        poem = this.generateAcrosticPoetry(nameStructure, theme, meter, style);
        break;
      case 'embedded':
        poem = this.generateEmbeddedPoetry(nameStructure, theme, meter, style);
        break;
      case 'palindrome':
        poem = this.generatePalindromePoetry(nameStructure, theme, style);
        break;
      case 'decomposed':
        poem = this.generateDecomposedPoetry(nameStructure, theme, style);
        break;
      case 'thematic':
        poem = this.generateThematicPoetry(nameStructure, theme, meter, style);
        break;
      default:
        poem = this.generateAcrosticPoetry(nameStructure, theme, meter, style);
    }
    
    return {
      ...poem,
      metadata: {
        type: poetryType,
        style,
        theme,
        meter,
        rhymeScheme,
        createdAt: new Date().toISOString(),
        difficulty: this.assessDifficulty(poem),
        quality: this.assessQuality(poem)
      }
    };
  }
  
  /**
   * 生成藏头诗
   * @param {object} nameStructure - 姓名结构
   * @param {string} theme - 主题
   * @param {string} meter - 格律
   * @param {string} style - 风格
   * @returns {object} 藏头诗
   */
  generateAcrosticPoetry(nameStructure, theme, meter, style) {
    const characters = nameStructure.characters;
    const meterInfo = this.meterTemplates[meter];
    const themeData = this.poetryThemes[theme];
    
    const lines = [];
    const lineLength = meterInfo.structure[0];
    
    for (let i = 0; i < characters.length; i++) {
      const char = characters[i];
      const line = this.generateLine(char, lineLength, theme, style, true);
      lines.push(line);
    }
    
    // 如果字符数少于格律要求，补充诗句
    while (lines.length < meterInfo.structure.length) {
      const line = this.generateLine('', lineLength, theme, style, false);
      lines.push(line);
    }
    
    return {
      title: `${nameStructure.fullName}藏头诗`,
      content: lines.join('\n'),
      lines,
      type: 'acrostic',
      hiddenMessage: nameStructure.fullName,
      explanation: `每句诗的第一个字连起来是"${nameStructure.fullName}"`
    };
  }

  /**
   * 获取参数模式
   * @returns {object} 参数模式
   */
  getParameterSchema() {
    return {
      type: 'object',
      properties: {
        fullName: {
          type: 'string',
          description: '完整姓名，如：张雅琪',
          minLength: 2,
          maxLength: 6
        },
        poetryType: {
          type: 'string',
          enum: ['acrostic', 'embedded', 'palindrome', 'decomposed', 'thematic'],
          default: 'acrostic',
          description: '诗词类型：acrostic-藏头诗，embedded-嵌名诗，palindrome-回文诗，decomposed-拆字诗，thematic-意境诗'
        },
        style: {
          type: 'string',
          enum: ['古典雅致', '现代简洁', '豪放大气', '婉约清新', '禅意深远'],
          default: '古典雅致',
          description: '诗词风格'
        },
        theme: {
          type: 'string',
          enum: ['auto', '品格赞美', '志向抱负', '自然美景', '人生哲理', '情感表达'],
          default: 'auto',
          description: '诗词主题，auto为自动选择'
        },
        meter: {
          type: 'string',
          enum: ['五言绝句', '七言绝句', '五言律诗', '七言律诗', '自由诗'],
          default: '七言绝句',
          description: '诗词格律'
        },
        count: {
          type: 'integer',
          default: 1,
          minimum: 1,
          maximum: 5,
          description: '生成诗词数量'
        }
      },
      required: ['fullName']
    };
  }

  /**
   * 评估诗词难度
   * @param {object} poem - 诗词对象
   * @returns {string} 难度等级
   */
  assessDifficulty(poem) {
    let difficulty = 0;
    
    // 根据诗词类型评估
    switch (poem.type) {
      case 'acrostic':
        difficulty = 1;
        break;
      case 'embedded':
        difficulty = 2;
        break;
      case 'palindrome':
        difficulty = 4;
        break;
      case 'decomposed':
        difficulty = 3;
        break;
      case 'thematic':
        difficulty = 2;
        break;
      default:
        difficulty = 1;
    }
    
    // 根据长度调整
    const totalLength = poem.content.length;
    if (totalLength > 100) difficulty += 1;
    
    // 返回难度等级
    if (difficulty <= 1) return '简单';
    if (difficulty <= 2) return '中等';
    if (difficulty <= 3) return '困难';
    return '极难';
  }

  /**
   * 评估诗词质量
   * @param {object} poem - 诗词对象
   * @returns {string} 质量等级
   */
  assessQuality(poem) {
    let score = 0;
    
    // 基础分
    score += 60;
    
    // 韵律评分
    const lines = poem.lines || poem.content.split('\n');
    if (lines.length >= 4) score += 10;
    
    // 字数一致性
    const lengths = lines.map(line => line.length);
    const uniqueLengths = new Set(lengths);
    if (uniqueLengths.size <= 2) score += 10;
    
    // 藏头诗检查
    if (poem.type === 'acrostic' && poem.hiddenMessage) {
      const firstChars = lines.map(line => line[0] || '').join('');
      if (firstChars === poem.hiddenMessage) score += 15;
    }
    
    // 内容相关性
    if (poem.explanation) score += 5;
    
    // 返回质量等级
    if (score >= 90) return '优秀';
    if (score >= 80) return '良好';
    if (score >= 70) return '一般';
    return '需改进';
  }

  /**
   * 分析诗词
   * @param {Array} poems - 诗词数组
   * @returns {object} 分析结果
   */
  analyzePoetry(poems) {
    if (!poems || poems.length === 0) {
      return {
        totalPoems: 0,
        averageLength: 0,
        commonThemes: [],
        styleDistribution: {},
        qualityMetrics: {}
      };
    }

    const analysis = {
      totalPoems: poems.length,
      averageLength: Math.round(poems.reduce((sum, poem) => sum + (poem.content ? poem.content.length : 0), 0) / poems.length),
      commonThemes: [...new Set(poems.map(poem => poem.theme || '未知'))],
      styleDistribution: {},
      qualityMetrics: {
        averageQuality: '良好',
        difficultyDistribution: {
          '简单': 0,
          '中等': 0,
          '困难': 0,
          '极难': 0
        }
      }
    };

    // 统计风格分布
    poems.forEach(poem => {
      const style = poem.style || '古典雅致';
      analysis.styleDistribution[style] = (analysis.styleDistribution[style] || 0) + 1;
    });

    // 统计难度分布
    poems.forEach(poem => {
      const difficulty = this.assessDifficulty(poem);
      analysis.qualityMetrics.difficultyDistribution[difficulty] = 
        (analysis.qualityMetrics.difficultyDistribution[difficulty] || 0) + 1;
    });

    return analysis;
  }

  /**
   * 生成建议
   * @param {object} nameStructure - 姓名结构
   * @param {Array} poems - 诗词数组
   * @returns {Array} 建议列表
   */
  generateSuggestions(nameStructure, poems) {
    const suggestions = [];
    
    // 基于姓名长度的建议
    if (nameStructure.totalLength <= 2) {
      suggestions.push('姓名较短，建议使用五言绝句格式');
    } else if (nameStructure.totalLength >= 4) {
      suggestions.push('姓名较长，建议使用七言律诗或分段生成');
    }

    // 基于诗词类型的建议
    if (poems && poems.length > 0) {
      const types = [...new Set(poems.map(p => p.type))];
      if (types.includes('acrostic')) {
        suggestions.push('藏头诗已生成，可尝试嵌名诗增加意境');
      }
      if (types.includes('thematic')) {
        suggestions.push('意境诗已生成，可尝试拆字诗增加趣味性');
      }
    }

    // 通用建议
    suggestions.push('可根据个人喜好调整诗词主题和风格');
    suggestions.push('建议保存喜欢的诗词，便于后续参考');

    return suggestions;
  }

  /**
   * 获取使用示例
   * @returns {object} 使用示例
   */
  getUsageExamples() {
    return this.getExamples();
  }

  /**
   * 生成诗句
   * @param {string} keyword - 关键词
   * @param {number} length - 诗句长度
   * @param {string} theme - 主题
   * @param {string} style - 风格
   * @param {boolean} useKeyword - 是否使用关键词
   * @returns {string} 生成的诗句
   */
  generateLine(keyword, length, theme, style, useKeyword) {
    // 使用诗词词汇库生成诗句
    const vocabulary = this.poetryVocabulary;
    const adjectives = vocabulary['形容词']['美好'].concat(vocabulary['形容词']['高大']);
    const nouns = vocabulary['名词']['自然'].concat(vocabulary['名词']['文化']);
    const verbs = vocabulary['动词']['创造'].concat(vocabulary['动词']['情感']);
    
    let line;
    
    if (useKeyword && keyword) {
      // 使用关键词生成诗句
      const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
      const noun = nouns[Math.floor(Math.random() * nouns.length)];
      const verb = verbs[Math.floor(Math.random() * verbs.length)];
      
      if (length === 5) {
        line = `${keyword}${adj}${noun}`;
        // 调整为5字格式
        if (line.length > 5) line = line.substring(0, 5);
        else if (line.length < 5) line = line + '春风';
      } else {
        line = `${keyword}${adj}${noun}${verb}春风`;
        // 调整为7字格式
        if (line.length > 7) line = line.substring(0, 7);
        else if (line.length < 7) line = line + '花';
      }
    } else {
      // 不使用关键词生成诗句
      const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
      const noun = nouns[Math.floor(Math.random() * nouns.length)];
      const verb = verbs[Math.floor(Math.random() * verbs.length)];
      
      if (length === 5) {
        line = `${adj}${noun}${verb}春风`;
        if (line.length > 5) line = line.substring(0, 5);
      } else {
        line = `${adj}${noun}${verb}春风花`;
        if (line.length > 7) line = line.substring(0, 7);
      }
    }
    
    return line;
  }

  /**
   * 获取示例
   * @returns {object} 示例
   */
  getExamples() {
    return {
      basic: {
        description: '基础藏头诗生成',
        params: {
          fullName: '张雅琪'
        },
        expectedOutput: {
          fullName: '张雅琪',
          poetryType: 'acrostic',
          poems: [{
            title: '张雅琪藏头诗',
            content: '张灯结彩迎新年\n雅韵悠扬传四方\n琪花瑶草满庭芳',
            type: 'acrostic',
            hiddenMessage: '张雅琪'
          }]
        }
      },
      detailed: {
        description: '指定风格和主题的诗词生成',
        params: {
          fullName: '李明华',
          poetryType: 'embedded',
          style: '豪放大气',
          theme: '志向抱负',
          meter: '七言律诗'
        },
        expectedOutput: {
          fullName: '李明华',
          poetryType: 'embedded',
          style: '豪放大气',
          theme: '志向抱负',
          poems: [{
            title: '李明华嵌名诗',
            content: '壮志凌云李白风\n明月照我华夏情\n千里江山入梦来\n万里长征志不移',
            type: 'embedded'
          }]
        }
      },
      comprehensive: {
        description: '多首诗词生成',
        params: {
          fullName: '王小雨',
          poetryType: 'thematic',
          style: '婉约清新',
          theme: '自然美景',
          count: 3
        },
        expectedOutput: {
          fullName: '王小雨',
          poetryType: 'thematic',
          poems: [
            {
              title: '王小雨意境诗一',
              content: '细雨如丝润大地\n小荷初露尖尖角\n雨后彩虹挂天边\n清香阵阵入心田',
              type: 'thematic'
            }
          ]
        }
      }
    };
  }
}

module.exports = NamePoetryGenerator;