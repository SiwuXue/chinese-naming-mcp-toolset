/**
 * 姓名八字分析器 - 高级扩展工具
 * Name Bazi Analyzer - Advanced Extension Tool
 * 
 * @author 鲁班 (PromptX工具开发大师)
 * @version 1.0.0
 */

const BaseTool = require('../../utils/base-tool.js');

class NameBaziAnalyzer extends BaseTool {
  constructor() {
    super(
      'name-bazi-analyzer',
      '基于生辰八字分析姓名的五行配置和命理匹配度',
      'advanced'
    );
    
    // 初始化八字分析数据
    this.initializeBaziData();
  }
  
  /**
   * 初始化八字分析数据
   */
  initializeBaziData() {
    // 天干地支数据
    this.tianGan = {
      '甲': { wuxing: '木', yinyang: '阳', number: 1 },
      '乙': { wuxing: '木', yinyang: '阴', number: 2 },
      '丙': { wuxing: '火', yinyang: '阳', number: 3 },
      '丁': { wuxing: '火', yinyang: '阴', number: 4 },
      '戊': { wuxing: '土', yinyang: '阳', number: 5 },
      '己': { wuxing: '土', yinyang: '阴', number: 6 },
      '庚': { wuxing: '金', yinyang: '阳', number: 7 },
      '辛': { wuxing: '金', yinyang: '阴', number: 8 },
      '壬': { wuxing: '水', yinyang: '阳', number: 9 },
      '癸': { wuxing: '水', yinyang: '阴', number: 10 }
    };
    
    this.diZhi = {
      '子': { wuxing: '水', shichen: '23-1时', animal: '鼠', number: 1 },
      '丑': { wuxing: '土', shichen: '1-3时', animal: '牛', number: 2 },
      '寅': { wuxing: '木', shichen: '3-5时', animal: '虎', number: 3 },
      '卯': { wuxing: '木', shichen: '5-7时', animal: '兔', number: 4 },
      '辰': { wuxing: '土', shichen: '7-9时', animal: '龙', number: 5 },
      '巳': { wuxing: '火', shichen: '9-11时', animal: '蛇', number: 6 },
      '午': { wuxing: '火', shichen: '11-13时', animal: '马', number: 7 },
      '未': { wuxing: '土', shichen: '13-15时', animal: '羊', number: 8 },
      '申': { wuxing: '金', shichen: '15-17时', animal: '猴', number: 9 },
      '酉': { wuxing: '金', shichen: '17-19时', animal: '鸡', number: 10 },
      '戌': { wuxing: '土', shichen: '19-21时', animal: '狗', number: 11 },
      '亥': { wuxing: '水', shichen: '21-23时', animal: '猪', number: 12 }
    };
    
    // 汉字五行属性数据库
    this.characterWuxing = {
      // 木属性字符
      '木': ['木', '林', '森', '树', '枝', '叶', '花', '草', '竹', '松', '柏', '梅', '兰', '菊', '莲', '荷', '芳', '芬', '芸', '苗', '茂', '英', '华', '蓝', '绿', '青'],
      // 火属性字符
      '火': ['火', '炎', '焰', '烈', '燃', '烧', '灯', '光', '明', '亮', '辉', '煌', '晶', '晨', '昊', '昱', '晖', '曦', '阳', '日', '红', '赤', '丹', '朱', '紫'],
      // 土属性字符
      '土': ['土', '地', '山', '岩', '石', '岗', '峰', '岭', '坡', '坤', '垠', '城', '墙', '堡', '塔', '黄', '棕', '褐', '圭', '坚', '培', '基', '堂', '境'],
      // 金属性字符
      '金': ['金', '银', '铜', '铁', '钢', '锋', '锐', '钊', '钧', '铭', '鑫', '鉴', '钟', '铃', '锦', '镇', '键', '锁', '白', '素', '净', '洁', '清', '刚', '强'],
      // 水属性字符
      '水': ['水', '江', '河', '湖', '海', '波', '浪', '涛', '流', '溪', '泉', '瀑', '雨', '雪', '霜', '露', '云', '雾', '冰', '寒', '凉', '润', '泽', '洋', '深']
    };
    
    // 五行相生相克关系
    this.wuxingRelations = {
      '木': { sheng: '火', ke: '土', shengBy: '水', keBy: '金' },
      '火': { sheng: '土', ke: '金', shengBy: '木', keBy: '水' },
      '土': { sheng: '金', ke: '水', shengBy: '火', keBy: '木' },
      '金': { sheng: '水', ke: '木', shengBy: '土', keBy: '火' },
      '水': { sheng: '木', ke: '火', shengBy: '金', keBy: '土' }
    };
    
    // 纳音五行
    this.nayin = {
      '甲子乙丑': '海中金',
      '丙寅丁卯': '炉中火',
      '戊辰己巳': '大林木',
      '庚午辛未': '路旁土',
      '壬申癸酉': '剑锋金',
      '甲戌乙亥': '山头火',
      '丙子丁丑': '涧下水',
      '戊寅己卯': '城头土',
      '庚辰辛巳': '白蜡金',
      '壬午癸未': '杨柳木',
      '甲申乙酉': '泉中水',
      '丙戌丁亥': '屋上土',
      '戊子己丑': '霹雳火',
      '庚寅辛卯': '松柏木',
      '壬辰癸巳': '长流水',
      '甲午乙未': '砂中金',
      '丙申丁酉': '山下火',
      '戊戌己亥': '平地木',
      '庚子辛丑': '壁上土',
      '壬寅癸卯': '金箔金',
      '甲辰乙巳': '覆灯火',
      '丙午丁未': '天河水',
      '戊申己酉': '大驿土',
      '庚戌辛亥': '钗钏金',
      '壬子癸丑': '桑柘木',
      '甲寅乙卯': '大溪水',
      '丙辰丁巳': '沙中土',
      '戊午己未': '天上火',
      '庚申辛酉': '石榴木',
      '壬戌癸亥': '大海水'
    };
    
    // 十神关系
    this.shiShen = {
      '比肩': { description: '与日主同类，代表兄弟姐妹、朋友、竞争对手' },
      '劫财': { description: '与日主同类但阴阳不同，代表合作伙伴、投资' },
      '食神': { description: '日主所生且阴阳相同，代表才华、表达、子女' },
      '伤官': { description: '日主所生且阴阳不同，代表创新、叛逆、技艺' },
      '偏财': { description: '日主所克且阴阳相同，代表意外之财、父亲' },
      '正财': { description: '日主所克且阴阳不同，代表正当收入、妻子' },
      '七杀': { description: '克制日主且阴阳相同，代表权威、压力、小人' },
      '正官': { description: '克制日主且阴阳不同，代表地位、名誉、丈夫' },
      '偏印': { description: '生助日主且阴阳相同，代表偏门学问、继母' },
      '正印': { description: '生助日主且阴阳不同，代表学问、母亲、贵人' }
    };
  }
  
  /**
   * 执行八字分析
   * @param {object} params - 输入参数
   * @returns {Promise<object>} 分析结果
   */
  async execute(params) {
    try {
      this._updateStats();
      this.log('info', '开始八字分析', params);
      
      const { 
        fullName, 
        birthYear, 
        birthMonth, 
        birthDay, 
        birthHour,
        analysisType = 'comprehensive'
      } = params;
      
      // 计算八字
      const bazi = this.calculateBazi(birthYear, birthMonth, birthDay, birthHour);
      
      // 分析姓名五行
      const nameWuxing = this.analyzeNameWuxing(fullName);
      
      // 执行不同类型的分析
      let analysis;
      switch (analysisType) {
        case 'basic':
          analysis = await this.basicBaziAnalysis(bazi, nameWuxing);
          break;
        case 'detailed':
          analysis = await this.detailedBaziAnalysis(bazi, nameWuxing);
          break;
        default:
          analysis = await this.comprehensiveBaziAnalysis(bazi, nameWuxing);
      }
      
      const result = {
        fullName,
        birthInfo: { birthYear, birthMonth, birthDay, birthHour },
        bazi: {
          ...bazi,
          year: { ...bazi.year, heavenlyStem: bazi.year.tianGan, earthlyBranch: bazi.year.diZhi },
          month: { ...bazi.month, heavenlyStem: bazi.month.tianGan, earthlyBranch: bazi.month.diZhi },
          day: { ...bazi.day, heavenlyStem: bazi.day.tianGan, earthlyBranch: bazi.day.diZhi },
          hour: { ...bazi.hour, heavenlyStem: bazi.hour.tianGan, earthlyBranch: bazi.hour.diZhi },
          dayMaster: bazi.day.tianGan
        },
        nameAnalysis: nameWuxing,
        analysisType,
        ...analysis
      };
      
      this.log('info', '八字分析完成');
      return this.createSuccessResponse(result);
      
    } catch (error) {
      this.log('error', '八字分析时发生错误', { error: error.message });
      return this.createErrorResponse(error.message);
    }
  }
  
  /**
   * 计算八字
   * @param {number} year - 年份
   * @param {number} month - 月份
   * @param {number} day - 日期
   * @param {number} hour - 小时
   * @returns {object} 八字信息
   */
  calculateBazi(year, month, day, hour) {
    // 简化的八字计算（实际应用中需要更精确的算法）
    const tianGanArray = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
    const diZhiArray = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
    
    // 年柱
    const yearTianGan = tianGanArray[(year - 4) % 10];
    const yearDiZhi = diZhiArray[(year - 4) % 12];
    
    // 月柱（简化计算）
    const monthTianGan = tianGanArray[(year * 12 + month) % 10];
    const monthDiZhi = diZhiArray[(month - 1) % 12];
    
    // 日柱（简化计算）
    const dayTianGan = tianGanArray[(year * 365 + month * 30 + day) % 10];
    const dayDiZhi = diZhiArray[(year * 365 + month * 30 + day) % 12];
    
    // 时柱
    const hourTianGan = tianGanArray[(day * 12 + Math.floor(hour / 2)) % 10];
    const hourDiZhi = diZhiArray[Math.floor(hour / 2)];
    
    return {
      year: { tianGan: yearTianGan, diZhi: yearDiZhi },
      month: { tianGan: monthTianGan, diZhi: monthDiZhi },
      day: { tianGan: dayTianGan, diZhi: dayDiZhi },
      hour: { tianGan: hourTianGan, diZhi: hourDiZhi },
      rizhu: dayTianGan + dayDiZhi, // 日柱作为日主
      nayin: this.calculateNayin(yearTianGan + yearDiZhi)
    };
  }
  
  /**
   * 计算纳音
   * @param {string} ganzhi - 干支组合
   * @returns {string} 纳音
   */
  calculateNayin(ganzhi) {
    for (const [key, value] of Object.entries(this.nayin)) {
      if (key.includes(ganzhi)) {
        return value;
      }
    }
    return '未知纳音';
  }
  
  /**
   * 分析姓名五行
   * @param {string} fullName - 完整姓名
   * @returns {object} 姓名五行分析
   */
  analyzeNameWuxing(fullName) {
    const characters = fullName.split('');
    const characterAnalysis = characters.map(char => {
      const wuxing = this.getCharacterWuxing(char);
      return {
        character: char,
        wuxing,
        strength: this.calculateCharacterStrength(char, wuxing)
      };
    });
    
    const wuxingCount = this.countWuxing(characterAnalysis);
    const dominantWuxing = this.getDominantWuxing(wuxingCount);
    const balance = this.analyzeWuxingBalance(wuxingCount);
    
    return {
      characters: characterAnalysis,
      wuxingCount,
      dominantWuxing,
      balance,
      overallStrength: this.calculateOverallStrength(characterAnalysis)
    };
  }
  
  /**
   * 获取字符五行属性
   * @param {string} char - 字符
   * @returns {string} 五行属性
   */
  getCharacterWuxing(char) {
    for (const [wuxing, chars] of Object.entries(this.characterWuxing)) {
      if (chars.includes(char)) {
        return wuxing;
      }
    }
    
    // 如果不在数据库中，根据字符结构推测
    return this.inferWuxingFromStructure(char);
  }
  
  /**
   * 根据字符结构推测五行
   * @param {string} char - 字符
   * @returns {string} 推测的五行属性
   */
  inferWuxingFromStructure(char) {
    // 简化的推测逻辑
    const radicals = {
      '木': ['木', '林', '森', '艹', '竹'],
      '火': ['火', '日', '光', '灬'],
      '土': ['土', '山', '石', '田'],
      '金': ['金', '钅', '刀', '戈'],
      '水': ['水', '氵', '冫', '雨']
    };
    
    for (const [wuxing, radicalList] of Object.entries(radicals)) {
      for (const radical of radicalList) {
        if (char.includes(radical)) {
          return wuxing;
        }
      }
    }
    
    return '土'; // 默认为土
  }
  
  /**
   * 计算字符强度
   * @param {string} char - 字符
   * @param {string} wuxing - 五行属性
   * @returns {number} 强度值
   */
  calculateCharacterStrength(char, wuxing) {
    // 根据字符在五行中的典型程度计算强度
    const coreChars = {
      '木': ['木', '林', '森'],
      '火': ['火', '炎', '焰'],
      '土': ['土', '地', '山'],
      '金': ['金', '银', '铁'],
      '水': ['水', '江', '海']
    };
    
    if (coreChars[wuxing] && coreChars[wuxing].includes(char)) {
      return 10; // 核心字符强度最高
    }
    
    return Math.floor(Math.random() * 5) + 5; // 其他字符强度5-9
  }
  
  /**
   * 统计五行数量
   * @param {array} characterAnalysis - 字符分析数组
   * @returns {object} 五行统计
   */
  countWuxing(characterAnalysis) {
    const count = { '木': 0, '火': 0, '土': 0, '金': 0, '水': 0 };
    
    for (const analysis of characterAnalysis) {
      count[analysis.wuxing]++;
    }
    
    return count;
  }
  
  /**
   * 获取主导五行
   * @param {object} wuxingCount - 五行统计
   * @returns {string} 主导五行
   */
  getDominantWuxing(wuxingCount) {
    let maxCount = 0;
    let dominant = '土';
    
    for (const [wuxing, count] of Object.entries(wuxingCount)) {
      if (count > maxCount) {
        maxCount = count;
        dominant = wuxing;
      }
    }
    
    return dominant;
  }
  
  /**
   * 分析五行平衡
   * @param {object} wuxingCount - 五行统计
   * @returns {object} 平衡分析
   */
  analyzeWuxingBalance(wuxingCount) {
    const total = Object.values(wuxingCount).reduce((sum, count) => sum + count, 0);
    const average = total / 5;
    
    const excess = [];
    const deficient = [];
    
    for (const [wuxing, count] of Object.entries(wuxingCount)) {
      if (count > average * 1.5) {
        excess.push(wuxing);
      } else if (count < average * 0.5) {
        deficient.push(wuxing);
      }
    }
    
    return {
      isBalanced: excess.length === 0 && deficient.length === 0,
      excess,
      deficient,
      balanceScore: this.calculateBalanceScore(wuxingCount)
    };
  }
  
  /**
   * 计算平衡分数
   * @param {object} wuxingCount - 五行统计
   * @returns {number} 平衡分数 (0-100)
   */
  calculateBalanceScore(wuxingCount) {
    const counts = Object.values(wuxingCount);
    const max = Math.max(...counts);
    const min = Math.min(...counts);
    
    if (max === 0) return 0;
    
    const ratio = min / max;
    return Math.round(ratio * 100);
  }
  
  /**
   * 计算整体强度
   * @param {array} characterAnalysis - 字符分析数组
   * @returns {number} 整体强度
   */
  calculateOverallStrength(characterAnalysis) {
    const totalStrength = characterAnalysis.reduce((sum, analysis) => sum + analysis.strength, 0);
    return Math.round(totalStrength / characterAnalysis.length);
  }
  
  /**
   * 基础八字分析
   * @param {object} bazi - 八字信息
   * @param {object} nameWuxing - 姓名五行
   * @returns {object} 基础分析结果
   */
  async basicBaziAnalysis(bazi, nameWuxing) {
    const baziWuxing = this.extractBaziWuxing(bazi);
    const compatibility = this.analyzeCompatibility(baziWuxing, nameWuxing);
    const recommendations = this.generateBasicRecommendations(compatibility);
    
    return {
      baziWuxing,
      compatibility: {
        ...compatibility,
        suggestions: compatibility.recommendations
      },
      recommendations,
      summary: this.generateBasicSummary(compatibility)
    };
  }
  
  /**
   * 详细八字分析
   * @param {object} bazi - 八字信息
   * @param {object} nameWuxing - 姓名五行
   * @returns {object} 详细分析结果
   */
  async detailedBaziAnalysis(bazi, nameWuxing) {
    const basicResult = await this.basicBaziAnalysis(bazi, nameWuxing);
    
    return {
      ...basicResult,
      dayMasterAnalysis: this.analyzeDayMaster(bazi),
      seasonalInfluence: this.analyzeSeasonalInfluence(bazi),
      wuxingCirculation: this.analyzeWuxingCirculation(bazi, nameWuxing),
      strengthAnalysis: this.analyzeStrength(bazi, nameWuxing),
      detailedRecommendations: this.generateDetailedRecommendations(bazi, nameWuxing)
    };
  }
  
  /**
   * 综合八字分析
   * @param {object} bazi - 八字信息
   * @param {object} nameWuxing - 姓名五行
   * @returns {object} 综合分析结果
   */
  async comprehensiveBaziAnalysis(bazi, nameWuxing) {
    const detailedResult = await this.detailedBaziAnalysis(bazi, nameWuxing);
    
    return {
      ...detailedResult,
      shiShenAnalysis: this.analyzeShiShen(bazi),
      nayinAnalysis: this.analyzeNayin(bazi),
      lifeStageAnalysis: this.analyzeLifeStages(bazi, nameWuxing),
      careerGuidance: this.generateCareerGuidance(bazi, nameWuxing),
      healthGuidance: this.generateHealthGuidance(bazi, nameWuxing),
      relationshipGuidance: this.generateRelationshipGuidance(bazi, nameWuxing),
      comprehensiveScore: this.calculateComprehensiveScore(bazi, nameWuxing)
    };
  }
  
  /**
   * 提取八字五行
   * @param {object} bazi - 八字信息
   * @returns {object} 八字五行分布
   */
  extractBaziWuxing(bazi) {
    const wuxingCount = { '木': 0, '火': 0, '土': 0, '金': 0, '水': 0 };
    
    // 统计天干地支的五行
    const positions = ['year', 'month', 'day', 'hour'];
    
    for (const position of positions) {
      const tianGanWuxing = this.tianGan[bazi[position].tianGan].wuxing;
      const diZhiWuxing = this.diZhi[bazi[position].diZhi].wuxing;
      
      wuxingCount[tianGanWuxing]++;
      wuxingCount[diZhiWuxing]++;
    }
    
    return {
      distribution: wuxingCount,
      dayMaster: this.tianGan[bazi.day.tianGan].wuxing,
      strongest: this.getDominantWuxing(wuxingCount),
      weakest: this.getWeakestWuxing(wuxingCount)
    };
  }
  
  /**
   * 获取最弱五行
   * @param {object} wuxingCount - 五行统计
   * @returns {string} 最弱五行
   */
  getWeakestWuxing(wuxingCount) {
    let minCount = Infinity;
    let weakest = '土';
    
    for (const [wuxing, count] of Object.entries(wuxingCount)) {
      if (count < minCount) {
        minCount = count;
        weakest = wuxing;
      }
    }
    
    return weakest;
  }
  
  /**
   * 分析兼容性
   * @param {object} baziWuxing - 八字五行
   * @param {object} nameWuxing - 姓名五行
   * @returns {object} 兼容性分析
   */
  analyzeCompatibility(baziWuxing, nameWuxing) {
    const dayMaster = baziWuxing.dayMaster;
    const nameDominant = nameWuxing.dominantWuxing;
    
    // 分析姓名五行对日主的影响
    const relationship = this.getWuxingRelationship(dayMaster, nameDominant);
    
    let compatibilityScore = 50; // 基础分数
    let analysis = '';
    
    if (relationship === 'sheng') {
      compatibilityScore += 30;
      analysis = `姓名五行${nameDominant}生助日主${dayMaster}，非常有利`;
    } else if (relationship === 'ke') {
      compatibilityScore -= 20;
      analysis = `姓名五行${nameDominant}克制日主${dayMaster}，需要调和`;
    } else if (relationship === 'same') {
      compatibilityScore += 10;
      analysis = `姓名五行${nameDominant}与日主${dayMaster}同类，有助力`;
    } else {
      analysis = `姓名五行${nameDominant}与日主${dayMaster}关系平和`;
    }
    
    return {
      score: Math.max(0, Math.min(100, compatibilityScore)),
      relationship,
      analysis,
      dayMaster,
      nameDominant,
      recommendations: this.getCompatibilityRecommendations(relationship)
    };
  }
  
  /**
   * 获取五行关系
   * @param {string} wuxing1 - 五行1
   * @param {string} wuxing2 - 五行2
   * @returns {string} 关系类型
   */
  getWuxingRelationship(wuxing1, wuxing2) {
    if (wuxing1 === wuxing2) return 'same';
    
    const relations = this.wuxingRelations[wuxing1];
    if (relations.sheng === wuxing2) return 'shengBy'; // wuxing2生wuxing1
    if (relations.ke === wuxing2) return 'ke'; // wuxing1克wuxing2
    if (relations.shengBy === wuxing2) return 'sheng'; // wuxing2生wuxing1
    if (relations.keBy === wuxing2) return 'keBy'; // wuxing2克wuxing1
    
    return 'neutral';
  }
  
  /**
   * 获取兼容性建议
   * @param {string} relationship - 关系类型
   * @returns {array} 建议数组
   */
  getCompatibilityRecommendations(relationship) {
    const recommendations = {
      'sheng': [
        '姓名五行配置优秀，有助于个人发展',
        '可以充分发挥姓名的正面能量',
        '建议保持当前的姓名配置'
      ],
      'ke': [
        '建议通过调整姓名字符来改善五行配置',
        '可以考虑添加调和五行的字符',
        '在日常生活中多接触有利五行元素'
      ],
      'same': [
        '姓名五行与命理相符，有一定助力',
        '可以考虑适当增加其他五行元素',
        '整体配置较为稳定'
      ],
      'neutral': [
        '姓名五行配置平和，无明显冲突',
        '可以根据个人喜好进行微调',
        '建议关注五行平衡'
      ]
    };
    
    return recommendations[relationship] || recommendations['neutral'];
  }
  
  /**
   * 分析日主
   * @param {object} bazi - 八字信息
   * @returns {object} 日主分析
   */
  analyzeDayMaster(bazi) {
    const dayMaster = bazi.day.tianGan;
    const dayMasterData = this.tianGan[dayMaster];
    
    return {
      dayMaster,
      wuxing: dayMasterData.wuxing,
      yinyang: dayMasterData.yinyang,
      characteristics: this.getDayMasterCharacteristics(dayMaster),
      strengths: this.getDayMasterStrengths(dayMaster),
      weaknesses: this.getDayMasterWeaknesses(dayMaster)
    };
  }
  
  /**
   * 获取日主特征
   * @param {string} dayMaster - 日主天干
   * @returns {array} 特征数组
   */
  getDayMasterCharacteristics(dayMaster) {
    const characteristics = {
      '甲': ['正直', '进取', '有领导力', '固执'],
      '乙': ['柔和', '适应性强', '有艺术天赋', '优柔寡断'],
      '丙': ['热情', '开朗', '有感染力', '急躁'],
      '丁': ['细腻', '温和', '有洞察力', '敏感'],
      '戊': ['稳重', '可靠', '有包容力', '固执'],
      '己': ['温和', '细心', '有耐心', '保守'],
      '庚': ['果断', '有正义感', '执行力强', '刚硬'],
      '辛': ['精致', '有品味', '注重细节', '挑剔'],
      '壬': ['智慧', '灵活', '有包容力', '多变'],
      '癸': ['内敛', '有直觉', '善于思考', '消极']
    };
    
    return characteristics[dayMaster] || ['特征待分析'];
  }
  
  /**
   * 获取日主优势
   * @param {string} dayMaster - 日主天干
   * @returns {array} 优势数组
   */
  getDayMasterStrengths(dayMaster) {
    const strengths = {
      '甲': ['天生的领导者', '开拓精神强', '正直可靠'],
      '乙': ['适应能力强', '人际关系好', '有艺术天赋'],
      '丙': ['热情洋溢', '感染力强', '积极向上'],
      '丁': ['细致入微', '有同情心', '洞察力强'],
      '戊': ['稳重可靠', '包容力强', '执行力好'],
      '己': ['细心周到', '有耐心', '善于照顾他人'],
      '庚': ['意志坚强', '正义感强', '执行力强'],
      '辛': ['品味高雅', '注重品质', '有鉴赏力'],
      '壬': ['智慧过人', '灵活变通', '包容性强'],
      '癸': ['直觉敏锐', '思考深入', '有智慧']
    };
    
    return strengths[dayMaster] || ['优势待发掘'];
  }
  
  /**
   * 获取日主弱点
   * @param {string} dayMaster - 日主天干
   * @returns {array} 弱点数组
   */
  getDayMasterWeaknesses(dayMaster) {
    const weaknesses = {
      '甲': ['过于固执', '不够灵活', '容易冲动'],
      '乙': ['优柔寡断', '缺乏主见', '容易受影响'],
      '丙': ['过于急躁', '缺乏耐心', '容易冲动'],
      '丁': ['过于敏感', '容易多虑', '缺乏决断'],
      '戊': ['过于保守', '变化缓慢', '固执己见'],
      '己': ['过于谨慎', '缺乏冒险精神', '容易焦虑'],
      '庚': ['过于刚硬', '不够圆滑', '容易得罪人'],
      '辛': ['过于挑剔', '要求过高', '容易孤立'],
      '壬': ['过于多变', '缺乏持续性', '容易分散'],
      '癸': ['过于消极', '缺乏行动力', '容易悲观']
    };
    
    return weaknesses[dayMaster] || ['弱点待改善'];
  }
  
  // 其他分析方法的简化实现
  analyzeSeasonalInfluence(bazi) {
    return {
      season: '春季',
      influence: '木旺火相，有利于成长发展',
      recommendations: ['多接触自然', '注意肝脏保养']
    };
  }
  
  analyzeWuxingCirculation(bazi, nameWuxing) {
    return {
      circulation: 'smooth',
      blockages: [],
      enhancements: ['姓名五行有助于能量流通'],
      balance: 'good',
      strengths: ['五行流通顺畅', '能量循环良好'],
      weaknesses: ['暂无明显弱点'],
      suggestions: ['保持现有的五行配置', '注意日常生活中的五行平衡']
    };
  }
  
  analyzeStrength(bazi, nameWuxing) {
    return {
      baziStrength: 'medium',
      nameContribution: 'positive',
      overallStrength: 'strong'
    };
  }
  
  analyzeShiShen(bazi) {
    return {
      dominantShiShen: '正官',
      characteristics: this.shiShen['正官'],
      implications: ['适合从事管理工作', '有领导潜质']
    };
  }
  
  analyzeNayin(bazi) {
    return {
      nayin: bazi.nayin,
      meaning: '代表人生的基本特质和发展方向',
      guidance: ['发挥纳音特质', '顺应自然规律']
    };
  }
  
  analyzeLifeStages(bazi, nameWuxing) {
    return {
      youth: '学习成长期，基础扎实',
      middleAge: '事业发展期，成就显著',
      oldAge: '享受成果期，安享晚年'
    };
  }
  
  generateCareerGuidance(bazi, nameWuxing) {
    return {
      suitableFields: ['管理', '教育', '咨询'],
      workStyle: '稳重务实',
      development: '循序渐进'
    };
  }
  
  generateHealthGuidance(bazi, nameWuxing) {
    return {
      constitution: 'balanced',
      recommendations: ['规律作息', '适度运动'],
      precautions: ['注意肝脏保养']
    };
  }
  
  generateRelationshipGuidance(bazi, nameWuxing) {
    return {
      compatibility: 'good',
      suggestions: ['真诚待人', '保持耐心'],
      challenges: ['避免过于固执']
    };
  }
  
  calculateComprehensiveScore(bazi, nameWuxing) {
    // 综合评分算法
    let score = 60; // 基础分
    
    // 根据各种因素调整分数
    score += nameWuxing.balance.balanceScore * 0.2;
    score += nameWuxing.overallStrength * 0.1;
    
    return Math.round(Math.max(0, Math.min(100, score)));
  }
  
  generateBasicRecommendations(compatibility) {
    return [
      `当前姓名与八字的匹配度为${compatibility.score}分`,
      compatibility.analysis,
      ...compatibility.recommendations
    ];
  }
  
  generateDetailedRecommendations(bazi, nameWuxing) {
    return [
      '建议在日常生活中多接触有利的五行元素',
      '可以通过颜色、方位、职业等方面进行调节',
      '保持积极的心态，发挥姓名的正面能量'
    ];
  }
  
  generateBasicSummary(compatibility) {
    return `八字与姓名的整体匹配度为${compatibility.score}分，${compatibility.analysis}。`;
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
        birthYear: {
          type: 'integer',
          description: '出生年份，如：1990',
          minimum: 1900,
          maximum: 2100
        },
        birthMonth: {
          type: 'integer',
          description: '出生月份，1-12',
          minimum: 1,
          maximum: 12
        },
        birthDay: {
          type: 'integer',
          description: '出生日期，1-31',
          minimum: 1,
          maximum: 31
        },
        birthHour: {
          type: 'integer',
          description: '出生小时，0-23',
          minimum: 0,
          maximum: 23
        },
        analysisType: {
          type: 'string',
          enum: ['basic', 'detailed', 'comprehensive'],
          default: 'comprehensive',
          description: '分析类型：basic-基础分析，detailed-详细分析，comprehensive-综合分析'
        }
      },
      required: ['fullName', 'birthYear', 'birthMonth', 'birthDay', 'birthHour']
    };
  }
  
  /**
   * 获取使用示例
   * @returns {array} 示例数组
   */
  getUsageExamples() {
    return this.getExamples();
  }

  /**
   * 获取使用示例
   * @returns {array} 示例数组
   */
  getExamples() {
    return [
      {
        title: '基础八字分析',
        input: {
          fullName: '张雅琪',
          birthYear: 1990,
          birthMonth: 5,
          birthDay: 15,
          birthHour: 10,
          analysisType: 'basic'
        },
        description: '分析张雅琪的姓名与八字的基础匹配度'
      },
      {
        title: '详细八字分析',
        input: {
          fullName: '李智慧',
          birthYear: 1985,
          birthMonth: 8,
          birthDay: 20,
          birthHour: 14,
          analysisType: 'detailed'
        },
        description: '详细分析李智慧的八字命理与姓名配置'
      },
      {
        title: '综合八字分析',
        input: {
          fullName: '王德华',
          birthYear: 1978,
          birthMonth: 12,
          birthDay: 8,
          birthHour: 6,
          analysisType: 'comprehensive'
        },
        description: '全面分析王德华的八字、姓名及人生指导'
      }
    ];
  }
}

module.exports = NameBaziAnalyzer;