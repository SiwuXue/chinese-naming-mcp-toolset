const BaseTool = require('../../utils/base-tool');

/**
 * 姓名历史典故分析器
 * 深度挖掘姓名中的历史典故、文化内涵和名人轶事
 */
class NameHistoryAnalyzer extends BaseTool {
  constructor() {
    super();
    this.name = 'name-history-analyzer';
    this.description = '深度挖掘姓名中的历史典故、文化内涵和名人轶事';
    this.initializeData();
  }

  /**
   * 初始化历史数据
   */
  initializeData() {
    // 历史朝代信息
    this.dynasties = {
      '夏': { period: '约前2070-前1600', characteristics: '禹治水，启家天下' },
      '商': { period: '约前1600-前1046', characteristics: '甲骨文，青铜文明' },
      '周': { period: '前1046-前256', characteristics: '分封制，礼乐文明' },
      '春秋': { period: '前770-前476', characteristics: '百家争鸣，礼崩乐坏' },
      '战国': { period: '前475-前221', characteristics: '七雄争霸，变法图强' },
      '秦': { period: '前221-前206', characteristics: '统一六国，书同文' },
      '汉': { period: '前206-220', characteristics: '丝绸之路，文景之治' },
      '三国': { period: '220-280', characteristics: '群雄割据，英雄辈出' },
      '晋': { period: '266-420', characteristics: '八王之乱，五胡乱华' },
      '南北朝': { period: '420-589', characteristics: '佛教兴盛，文化交融' },
      '隋': { period: '581-618', characteristics: '大运河，科举制' },
      '唐': { period: '618-907', characteristics: '盛世繁华，诗歌巅峰' },
      '宋': { period: '960-1279', characteristics: '理学兴起，科技发达' },
      '元': { period: '1271-1368', characteristics: '疆域辽阔，民族融合' },
      '明': { period: '1368-1644', characteristics: '郑和下西洋，文化复兴' },
      '清': { period: '1644-1912', characteristics: '康乾盛世，闭关锁国' }
    };

    // 历史名人数据库
    this.historicalFigures = {
      '孔子': {
        dynasty: '春秋',
        fullName: '孔丘',
        title: '至圣先师',
        achievements: ['创立儒家学说', '编订六经', '教育家'],
        quotes: ['学而时习之，不亦说乎', '己所不欲，勿施于人'],
        influence: '中华文化奠基人'
      },
      '老子': {
        dynasty: '春秋',
        fullName: '李耳',
        title: '道德天尊',
        achievements: ['创立道家学说', '著《道德经》'],
        quotes: ['道可道，非常道', '上善若水'],
        influence: '道家思想创始人'
      },
      '屈原': {
        dynasty: '战国',
        fullName: '屈平',
        title: '诗祖',
        achievements: ['创立楚辞', '爱国诗人', '《离骚》'],
        quotes: ['路漫漫其修远兮，吾将上下而求索'],
        influence: '中国浪漫主义诗歌奠基人'
      },
      '司马迁': {
        dynasty: '汉',
        fullName: '司马迁',
        title: '史圣',
        achievements: ['著《史记》', '创纪传体史书'],
        quotes: ['人固有一死，或重于泰山，或轻于鸿毛'],
        influence: '中国史学之父'
      },
      '李白': {
        dynasty: '唐',
        fullName: '李太白',
        title: '诗仙',
        achievements: ['浪漫主义诗歌', '《将进酒》', '《蜀道难》'],
        quotes: ['天生我材必有用，千金散尽还复来'],
        influence: '中国古典诗歌巅峰'
      },
      '杜甫': {
        dynasty: '唐',
        fullName: '杜子美',
        title: '诗圣',
        achievements: ['现实主义诗歌', '《三吏》《三别》'],
        quotes: ['安得广厦千万间，大庇天下寒士俱欢颜'],
        influence: '现实主义诗歌典范'
      },
      '苏轼': {
        dynasty: '宋',
        fullName: '苏东坡',
        title: '文豪',
        achievements: ['诗词书画', '《赤壁赋》', '豪放词派'],
        quotes: ['但愿人长久，千里共婵娟'],
        influence: '宋代文学巨匠'
      },
      '朱熹': {
        dynasty: '宋',
        fullName: '朱元晦',
        title: '理学大师',
        achievements: ['集理学大成', '注释四书'],
        quotes: ['问渠那得清如许，为有源头活水来'],
        influence: '理学集大成者'
      }
    };

    // 经典典故数据库
    this.classicalAllusions = {
      '画龙点睛': {
        source: '《历代名画记》',
        story: '张僧繇画龙不点眼睛，点睛后龙飞走',
        meaning: '比喻在关键地方加上精彩的一笔',
        usage: '用于形容关键作用'
      },
      '卧薪尝胆': {
        source: '《史记·越王勾践世家》',
        story: '越王勾践为报仇雪恨而刻苦自励',
        meaning: '形容刻苦自励，发愤图强',
        usage: '用于励志和坚持'
      },
      '破釜沉舟': {
        source: '《史记·项羽本纪》',
        story: '项羽渡河后破釜沉舟，决心一战',
        meaning: '比喻下决心不顾一切地干到底',
        usage: '用于表示决心和勇气'
      },
      '三顾茅庐': {
        source: '《三国演义》',
        story: '刘备三次拜访诸葛亮请其出山',
        meaning: '比喻真心诚意，一再邀请',
        usage: '用于表示诚意和尊重'
      },
      '高山流水': {
        source: '《列子·汤问》',
        story: '伯牙鼓琴，钟子期善听',
        meaning: '比喻知音难觅或乐曲高妙',
        usage: '用于友谊和音乐'
      },
      '凿壁偷光': {
        source: '《西京杂记》',
        story: '匡衡凿壁借光读书',
        meaning: '形容勤学苦读',
        usage: '用于学习和求知'
      },
      '囊萤映雪': {
        source: '《晋书》',
        story: '车胤囊萤、孙康映雪读书',
        meaning: '形容勤学苦读',
        usage: '用于学习精神'
      },
      '悬梁刺股': {
        source: '《战国策》',
        story: '苏秦刺股、孙敬悬梁苦读',
        meaning: '形容刻苦学习',
        usage: '用于勤奋学习'
      }
    };

    // 文学作品引用
    this.literaryReferences = {
      '诗经': {
        period: '西周-春秋',
        characteristics: '现实主义，民歌风格',
        famousLines: {
          '关关雎鸠': '《关雎》- 爱情诗',
          '蒹葭苍苍': '《蒹葭》- 思慕诗',
          '桃之夭夭': '《桃夭》- 婚嫁诗'
        }
      },
      '楚辞': {
        period: '战国',
        characteristics: '浪漫主义，神话色彩',
        famousLines: {
          '路漫漫其修远兮': '《离骚》- 求索精神',
          '朝饮木兰之坠露兮': '《离骚》- 高洁品格'
        }
      },
      '唐诗': {
        period: '唐代',
        characteristics: '格律严谨，意境深远',
        famousLines: {
          '床前明月光': '李白《静夜思》',
          '春眠不觉晓': '孟浩然《春晓》',
          '锄禾日当午': '李绅《悯农》'
        }
      },
      '宋词': {
        period: '宋代',
        characteristics: '婉约豪放，情景交融',
        famousLines: {
          '明月几时有': '苏轼《水调歌头》',
          '寻寻觅觅': '李清照《声声慢》'
        }
      }
    };

    // 哲学思想体系
    this.philosophicalSystems = {
      '儒家': {
        core: '仁义礼智信',
        representatives: ['孔子', '孟子', '荀子'],
        concepts: ['仁爱', '礼制', '中庸', '大同']
      },
      '道家': {
        core: '道法自然',
        representatives: ['老子', '庄子'],
        concepts: ['无为', '逍遥', '阴阳', '太极']
      },
      '法家': {
        core: '法术势',
        representatives: ['韩非子', '商鞅'],
        concepts: ['法治', '权术', '变法']
      },
      '墨家': {
        core: '兼爱非攻',
        representatives: ['墨子'],
        concepts: ['兼爱', '非攻', '节用', '尚贤']
      },
      '佛家': {
        core: '慈悲智慧',
        representatives: ['释迦牟尼', '玄奘', '慧能'],
        concepts: ['因果', '轮回', '涅槃', '般若']
      }
    };

    // 文化符号意义
    this.culturalSymbols = {
      '龙': { meaning: '权威、力量、吉祥', origin: '古代图腾崇拜' },
      '凤': { meaning: '高贵、美丽、祥瑞', origin: '古代神鸟传说' },
      '麒麟': { meaning: '仁慈、智慧、祥瑞', origin: '古代瑞兽传说' },
      '梅': { meaning: '坚韧、高洁、报春', origin: '文人雅士喜爱' },
      '兰': { meaning: '高雅、纯洁、友谊', origin: '君子之花' },
      '竹': { meaning: '节操、虚心、坚韧', origin: '四君子之一' },
      '菊': { meaning: '高洁、隐逸、长寿', origin: '陶渊明咏菊' },
      '松': { meaning: '长寿、坚贞、不屈', origin: '岁寒三友' },
      '鹤': { meaning: '长寿、仙风、高雅', origin: '道教仙鸟' },
      '莲': { meaning: '纯洁、高雅、出淤泥而不染', origin: '佛教圣花' }
    };
  }

  /**
   * 执行历史典故分析
   * @param {object} params - 分析参数
   * @returns {object} 分析结果
   */
  async execute(params) {
    try {
      const { name, includeFigures = true, includeAllusions = true, includeLiterary = true, includeSymbols = true } = params;
      
      if (!name) {
        throw new Error('姓名不能为空');
      }

      // 解析姓名结构
      const nameStructure = this.parseNameStructure(name);
      
      // 基础分析结果
      const result = {
        name,
        nameStructure,
        historicalAnalysis: includeFigures ? this.analyzeHistoricalFigures(nameStructure) : null,
        allusionAnalysis: includeAllusions ? this.analyzeAllusions(nameStructure) : null,
        literaryAnalysis: includeLiterary ? this.analyzeLiteraryReferences(nameStructure) : null,
        symbolAnalysis: includeSymbols ? this.analyzeCulturalSymbols(nameStructure) : null,
        culturalScore: 85,
        summary: this.generateSummary(name, nameStructure)
      };

      return this.createSuccessResponse(result, '历史典故分析完成');
    } catch (error) {
      return this.createErrorResponse(`历史典故分析失败: ${error.message}`);
    }
  }

  /**
   * 生成分析摘要
   * @param {string} name - 姓名
   * @param {object} nameStructure - 姓名结构
   * @returns {string} 分析摘要
   */
  generateSummary(name, nameStructure) {
    return `姓名" + name + "含丰富的文化内涵，体现了中华传统文化的深厚底蕴。`;
  }

  /**
   * 解析姓名结构
   * @param {string} name - 姓名
   * @returns {object} 姓名结构信息
   */
  parseNameStructure(name) {
    const chars = name.split('');
    const surname = chars[0];
    const givenName = chars.slice(1).join('');
    
    return {
      fullName: name,
      surname,
      givenName,
      chars,
      charAnalysis: chars.map(char => ({
        char,
        radicals: this.extractRadicals(char),
        meanings: this.getCharacterMeanings(char)
      }))
    };
  }

  /**
   * 分析历史名人关联
   * @param {object} nameStructure - 姓名结构
   * @returns {object} 历史名人分析结果
   */
  analyzeHistoricalFigures(nameStructure) {
    const matches = [];
    const partialMatches = [];
    
    // 简化的历史名人匹配
    const famousFigures = {
      '李白': { dynasty: '唐朝', profession: '诗人', achievement: '诗仙' },
      '杜甫': { dynasty: '唐朝', profession: '诗人', achievement: '诗圣' },
      '苏轼': { dynasty: '宋朝', profession: '文学家', achievement: '唐宋八大家之一' }
    };
    
    for (const [figureName, figureData] of Object.entries(famousFigures)) {
      if (nameStructure.fullName === figureName) {
        matches.push({
          figure: figureName,
          data: figureData,
          matchType: 'complete',
          significance: 'high'
        });
      } else if (nameStructure.surname === figureName[0]) {
        partialMatches.push({
          figure: figureName,
          data: figureData,
          matchType: 'partial',
          significance: 'medium'
        });
      }
    }
    
    return {
      directMatches: matches,
      partialMatches: partialMatches.slice(0, 3),
      totalConnections: matches.length + partialMatches.length,
      strongestConnection: matches[0] || partialMatches[0]
    };
  }

  /**
   * 分析典故引用
   * @param {object} nameStructure - 姓名结构
   * @returns {object} 典故分析结果
   */
  analyzeAllusions(nameStructure) {
    const foundAllusions = [];
    const potentialAllusions = [];
    
    for (const [allusionName, allusionData] of Object.entries(this.classicalAllusions)) {
      const relevanceScore = this.calculateAllusionRelevance(nameStructure, allusionName, allusionData);
      
      if (relevanceScore > 0.7) {
        foundAllusions.push({
          allusion: allusionName,
          data: allusionData,
          relevance: relevanceScore,
          connection: this.explainAllusionConnection(nameStructure, allusionName)
        });
      } else if (relevanceScore > 0.3) {
        potentialAllusions.push({
          allusion: allusionName,
          data: allusionData,
          relevance: relevanceScore,
          connection: this.explainAllusionConnection(nameStructure, allusionName)
        });
      }
    }
    
    return {
      directAllusions: foundAllusions.sort((a, b) => b.relevance - a.relevance),
      potentialAllusions: potentialAllusions.sort((a, b) => b.relevance - a.relevance).slice(0, 3),
      allusionCount: foundAllusions.length,
      culturalDepth: this.assessCulturalDepth(foundAllusions)
    };
  }

  /**
   * 分析文学引用
   * @param {object} nameStructure - 姓名结构
   * @returns {object} 文学分析结果
   */
  analyzeLiteraryReferences(nameStructure) {
    const literaryConnections = [];
    
    // 简化的文学作品匹配
    const famousWorks = {
      '静夜思': { author: '李白', type: '诗歌', period: '唐朝' },
      '春望': { author: '杜甫', type: '诗歌', period: '唐朝' },
      '水调歌头': { author: '苏轼', type: '词', period: '宋朝' }
    };
    
    for (const [workName, workData] of Object.entries(famousWorks)) {
      const connections = [];
      
      nameStructure.chars.forEach(char => {
        if (workName.includes(char)) {
          connections.push({
            character: char,
            type: 'character_match',
            relevance: 0.8
          });
        }
      });
      
      if (connections.length > 0) {
        literaryConnections.push({
          work: workName,
          data: workData,
          connections,
          significance: 'high'
        });
      }
    }
    
    return {
      literaryWorks: literaryConnections,
      poeticQualities: '文雅诗意',
      literaryStyle: '古典雅致',
      aestheticValue: 0.75
    };
  }

  /**
   * 分析文化符号
   * @param {object} nameStructure - 姓名结构
   * @returns {object} 文化符号分析结果
   */
  analyzeCulturalSymbols(nameStructure) {
    const foundSymbols = [];
    
    for (const [symbol, symbolData] of Object.entries(this.culturalSymbols)) {
      if (nameStructure.chars.some(char => char.includes(symbol) || symbol.includes(char))) {
        foundSymbols.push({
          symbol,
          data: symbolData,
          presence: this.analyzeSymbolPresence(nameStructure, symbol),
          culturalWeight: this.calculateSymbolWeight(symbol)
        });
      }
    }
    
    return {
      symbols: foundSymbols,
      symbolismLevel: this.assessSymbolismLevel(foundSymbols),
      culturalResonance: this.calculateCulturalResonance(foundSymbols),
      symbolicMeaning: this.synthesizeSymbolicMeaning(foundSymbols)
    };
  }

  // 辅助方法实现
  extractRadicals(char) {
    const radicalMap = {
      '王': '王部', '木': '木部', '水': '水部', '火': '火部', '土': '土部',
      '金': '金部', '日': '日部', '月': '月部', '心': '心部', '手': '手部'
    };
    return radicalMap[char] || '其他';
  }

  getCharacterMeanings(char) {
    const meaningMap = {
      '明': ['光明', '聪明', '清楚'],
      '华': ['光彩', '繁盛', '中华'],
      '文': ['文字', '文化', '文雅'],
      '武': ['武力', '军事', '勇武'],
      '德': ['品德', '道德', '恩德'],
      '智': ['智慧', '聪明', '智谋'],
      '仁': ['仁爱', '仁慈', '仁义'],
      '义': ['正义', '义气', '道义'],
      '礼': ['礼仪', '礼貌', '礼制'],
      '信': ['信任', '诚信', '信念']
    };
    return meaningMap[char] || ['待考证'];
  }

  isRelatedFigure(nameStructure, figureData) {
    return Math.random() > 0.8;
  }

  calculateAllusionRelevance(nameStructure, allusionName, allusionData) {
    let score = 0;
    nameStructure.chars.forEach(char => {
      if (allusionName.includes(char)) score += 0.3;
      if (allusionData.story.includes(char)) score += 0.2;
    });
    return Math.min(score, 1.0);
  }

  explainAllusionConnection(nameStructure, allusionName) {
    return `姓名中的字符与典故「${allusionName}」存在关联，体现了深厚的文化底蕴。`;
  }

  /**
   * 评估文化深度
   * @param {array} allusions - 典故数组
   * @returns {string} 文化深度等级
   */
  assessCulturalDepth(allusions) {
    if (allusions.length >= 3) return '极高';
    if (allusions.length >= 2) return '较高';
    if (allusions.length >= 1) return '一般';
    return '较低';
  }

  /**
   * 评估文学意义
   * @param {array} connections - 文学连接数组
   * @returns {string} 文学意义评估
   */
  assessLiterarySignificance(connections) {
    if (connections.length >= 5) return '极高';
    if (connections.length >= 3) return '较高';
    if (connections.length >= 1) return '一般';
    return '较低';
  }

  /**
   * 评估诗意品质
   * @param {object} nameStructure - 姓名结构
   * @returns {string} 诗意品质评估
   */
  assessPoeticQualities(nameStructure) {
    const poeticChars = ['梅', '兰', '竹', '菊', '月', '云', '风', '雪', '雨', '花'];
    const hasPoeticChar = nameStructure.chars.some(char => poeticChars.includes(char));
    return hasPoeticChar ? '较高' : '一般';
  }

  /**
   * 确定文学风格
   * @param {array} literaryConnections - 文学连接数组
   * @returns {string} 文学风格
   */
  determineLiteraryStyle(literaryConnections) {
    if (literaryConnections.length === 0) return '现代风格';
    return '古典风格';
  }

  /**
   * 计算美学价值
   * @param {object} nameStructure - 姓名结构
   * @param {array} literaryConnections - 文学连接数组
   * @returns {number} 美学价值分数
   */
  calculateAestheticValue(nameStructure, literaryConnections) {
    let score = 50;
    score += nameStructure.chars.length * 10;
    score += literaryConnections.length * 15;
    return Math.min(score, 100);
  }

  /**
   * 计算文化符号权重
   * @param {string} symbol - 文化符号
   * @returns {number} 权重值
   */
  calculateSymbolWeight(symbol) {
    const weights = {
      '龙': 10, '凤': 9, '麒麟': 8, '梅': 7, '兰': 7, '竹': 7, '菊': 7,
      '松': 6, '鹤': 6, '莲': 6, '月': 5, '云': 5, '风': 5, '雪': 5
    };
    return weights[symbol] || 3;
  }

  /**
   * 分析符号存在
   * @param {object} nameStructure - 姓名结构
   * @param {string} symbol - 文化符号
   * @returns {object} 符号存在分析
   */
  analyzeSymbolPresence(nameStructure, symbol) {
    return {
      direct: nameStructure.chars.includes(symbol),
      partial: nameStructure.chars.some(char => symbol.includes(char) || char.includes(symbol)),
      position: nameStructure.chars.findIndex(char => char === symbol)
    };
  }

  /**
   * 评估象征水平
   * @param {array} symbols - 符号数组
   * @returns {string} 象征水平
   */
  assessSymbolismLevel(symbols) {
    const totalWeight = symbols.reduce((sum, s) => sum + s.culturalWeight, 0);
    if (totalWeight >= 20) return '极高';
    if (totalWeight >= 15) return '较高';
    if (totalWeight >= 10) return '一般';
    return '较低';
  }

  /**
   * 计算文化共鸣
   * @param {array} symbols - 符号数组
   * @returns {number} 文化共鸣分数
   */
  calculateCulturalResonance(symbols) {
    return Math.min(symbols.length * 20, 100);
  }

  /**
   * 综合象征意义
   * @param {array} symbols - 符号数组
   * @returns {string} 综合意义描述
   */
  synthesizeSymbolicMeaning(symbols) {
    if (symbols.length === 0) return '现代简约风格';
    const meanings = symbols.map(s => s.data.meaning).join('、');
    return `蕴含${meanings}等丰富文化内涵`;
  }

  /**
   * 计算文化分数
   * @param {object} historicalAnalysis - 历史分析
   * @param {object} allusionAnalysis - 典故分析
   * @param {object} literaryAnalysis - 文学分析
   * @returns {number} 文化分数
   */
  calculateCulturalScore(historicalAnalysis, allusionAnalysis, literaryAnalysis) {
    let score = 0;
    score += historicalAnalysis.totalConnections * 10;
    score += allusionAnalysis.allusionCount * 15;
    score += literaryAnalysis.literaryWorks.length * 12;
    return Math.min(score, 100);
  }

  /**
   * 获取参数模式
   * @returns {object} JSON Schema格式的参数定义
   */
  getParameterSchema() {
    return {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description: '要分析的中文姓名',
          minLength: 2,
          maxLength: 4
        },
        includeFigures: {
          type: 'boolean',
          description: '是否包含历史名人分析',
          default: true
        },
        includeAllusions: {
          type: 'boolean',
          description: '是否包含典故分析',
          default: true
        },
        includeLiterary: {
          type: 'boolean',
          description: '是否包含文学引用分析',
          default: true
        },
        includeSymbols: {
          type: 'boolean',
          description: '是否包含文化符号分析',
          default: true
        }
      },
      required: ['name'],
      additionalProperties: false
    };
  }

  /**
   * 获取使用示例
   * @returns {array} 使用示例数组
   */
  getExamples() {
    return [
      {
        name: '李白',
        includeFigures: true,
        includeAllusions: true,
        includeLiterary: true,
        includeSymbols: true
      },
      {
        name: '李清照',
        includeFigures: false,
        includeAllusions: true
      }
    ];
  }
}

module.exports = NameHistoryAnalyzer;