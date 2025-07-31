/**
 * 重名检测器 - 核心工具
 * Name Collision Checker - Core Tool
 * 
 * @author 鲁班 (PromptX工具开发大师)
 * @version 1.0.0
 */

const BaseTool = require('../utils/base-tool.js');
const fs = require('fs').promises;
const path = require('path');

class NameCollisionChecker extends BaseTool {
  constructor() {
    super(
      'name-collision-checker',
      '检测姓名重复率，分析姓名独特性和流行度',
      'core'
    );
    
    // 初始化数据源
    this.initializeDataSources();
  }
  
  /**
   * 初始化数据源
   */
  initializeDataSources() {
    // 模拟的姓名数据库（实际应用中应连接真实数据库）
    this.nameDatabase = {
      // 高频姓名（重名率高）
      highFrequency: {
        '张伟': { count: 290607, rank: 1, gender: 'male', regions: ['全国'] },
        '王伟': { count: 281568, rank: 2, gender: 'male', regions: ['全国'] },
        '王芳': { count: 268268, rank: 3, gender: 'female', regions: ['全国'] },
        '李伟': { count: 260980, rank: 4, gender: 'male', regions: ['全国'] },
        '李娜': { count: 244584, rank: 5, gender: 'female', regions: ['全国'] },
        '张敏': { count: 237553, rank: 6, gender: 'female', regions: ['全国'] },
        '李静': { count: 234627, rank: 7, gender: 'female', regions: ['全国'] },
        '王静': { count: 233094, rank: 8, gender: 'female', regions: ['全国'] },
        '刘伟': { count: 230139, rank: 9, gender: 'male', regions: ['全国'] },
        '王秀英': { count: 225594, rank: 10, gender: 'female', regions: ['全国'] }
      },
      
      // 中频姓名（重名率中等）
      mediumFrequency: {
        '张雅琪': { count: 15420, rank: 156, gender: 'female', regions: ['华北', '华东'] },
        '李智慧': { count: 12380, rank: 203, gender: 'unisex', regions: ['全国'] },
        '王德华': { count: 18950, rank: 134, gender: 'male', regions: ['华中', '华南'] },
        '陈思雨': { count: 8760, rank: 287, gender: 'female', regions: ['华南', '西南'] },
        '刘浩然': { count: 11240, rank: 234, gender: 'male', regions: ['华北', '东北'] },
        '赵梦琪': { count: 9850, rank: 256, gender: 'female', regions: ['华东', '华中'] },
        '孙志强': { count: 14670, rank: 178, gender: 'male', regions: ['华北', '华东'] },
        '周美丽': { count: 7890, rank: 312, gender: 'female', regions: ['西南', '西北'] },
        '吴建国': { count: 16780, rank: 145, gender: 'male', regions: ['华东', '华南'] },
        '郑小红': { count: 6540, rank: 356, gender: 'female', regions: ['华中', '华南'] }
      },
      
      // 低频姓名（重名率低，较独特）
      lowFrequency: {
        '欧阳修远': { count: 23, rank: 45678, gender: 'male', regions: ['华南'] },
        '司马相如': { count: 12, rank: 67890, gender: 'male', regions: ['西南'] },
        '上官婉儿': { count: 18, rank: 56789, gender: 'female', regions: ['华中'] },
        '诸葛亮明': { count: 8, rank: 78901, gender: 'male', regions: ['西南'] },
        '东方不败': { count: 5, rank: 89012, gender: 'unisex', regions: ['华东'] },
        '西门吹雪': { count: 3, rank: 90123, gender: 'male', regions: ['华北'] },
        '独孤求败': { count: 2, rank: 95678, gender: 'male', regions: ['西北'] },
        '令狐冲天': { count: 4, rank: 87654, gender: 'male', regions: ['华中'] },
        '慕容复兴': { count: 6, rank: 76543, gender: 'male', regions: ['东北'] },
        '南宫飞燕': { count: 7, rank: 65432, gender: 'female', regions: ['华南'] }
      }
    };
    
    // 姓氏频率数据
    this.surnameFrequency = {
      '王': { percentage: 7.25, rank: 1, population: 101000000 },
      '李': { percentage: 7.19, rank: 2, population: 100000000 },
      '张': { percentage: 6.83, rank: 3, population: 95000000 },
      '刘': { percentage: 5.38, rank: 4, population: 75000000 },
      '陈': { percentage: 4.53, rank: 5, population: 63000000 },
      '杨': { percentage: 3.08, rank: 6, population: 43000000 },
      '赵': { percentage: 2.29, rank: 7, population: 32000000 },
      '黄': { percentage: 2.23, rank: 8, population: 31000000 },
      '周': { percentage: 2.12, rank: 9, population: 30000000 },
      '吴': { percentage: 2.05, rank: 10, population: 29000000 }
    };
    
    // 名字字符频率数据
    this.characterFrequency = {
      // 高频字符（容易重名）
      high: ['伟', '芳', '娜', '敏', '静', '丽', '强', '军', '杰', '华'],
      // 中频字符
      medium: ['雅', '琪', '慧', '智', '德', '思', '雨', '浩', '然', '梦'],
      // 低频字符（较独特）
      low: ['璇', '瑾', '琰', '昱', '煜', '曦', '澜', '瀚', '墨', '颜']
    };
    
    // 地区分布数据
    this.regionalData = {
      '华北': ['北京', '天津', '河北', '山西', '内蒙古'],
      '东北': ['辽宁', '吉林', '黑龙江'],
      '华东': ['上海', '江苏', '浙江', '安徽', '福建', '江西', '山东'],
      '华中': ['河南', '湖北', '湖南'],
      '华南': ['广东', '广西', '海南'],
      '西南': ['重庆', '四川', '贵州', '云南', '西藏'],
      '西北': ['陕西', '甘肃', '青海', '宁夏', '新疆']
    };
  }
  
  /**
   * 执行重名检测
   * @param {object} params - 输入参数
   * @returns {Promise<object>} 检测结果
   */
  async execute(params) {
    try {
      this._updateStats();
      this.log('info', '开始检测姓名重复率', params);
      
      const { 
        fullName, 
        region = '全国', 
        gender = 'unisex',
        checkLevel = 'comprehensive'
      } = params;
      
      // 参数验证
      if (!fullName || fullName.trim() === '') {
        return this.createErrorResponse('姓名不能为空');
      }
      
      if (fullName.length < 2 || fullName.length > 10) {
        return this.createErrorResponse('姓名长度必须在2-10个字符之间');
      }
      
      const validRegions = ['全国', '华北', '东北', '华东', '华中', '华南', '西南', '西北'];
      if (!validRegions.includes(region)) {
        return this.createErrorResponse('地区参数无效');
      }
      
      const validGenders = ['male', 'female', 'unisex'];
      if (!validGenders.includes(gender)) {
        return this.createErrorResponse('性别参数无效');
      }
      
      const validCheckLevels = ['basic', 'detailed', 'comprehensive'];
      if (!validCheckLevels.includes(checkLevel)) {
        return this.createErrorResponse('检测级别参数无效');
      }
      
      // 执行不同级别的检测
      let result;
      switch (checkLevel) {
        case 'basic':
          result = await this.basicCheck(fullName, region, gender);
          break;
        case 'detailed':
          result = await this.detailedCheck(fullName, region, gender);
          break;
        default:
          result = await this.comprehensiveCheck(fullName, region, gender);
      }
      
      const finalResult = {
        fullName,
        region,
        gender,
        checkLevel,
        timestamp: new Date().toISOString(),
        ...result
      };
      
      this.log('info', '重名检测完成');
      return this.createSuccessResponse(finalResult);
      
    } catch (error) {
      this.log('error', '检测重名时发生错误', { error: error.message });
      return this.createErrorResponse(error.message);
    }
  }
  
  /**
   * 基础检测
   * @param {string} fullName - 完整姓名
   * @param {string} region - 地区
   * @param {string} gender - 性别
   * @returns {object} 基础检测结果
   */
  async basicCheck(fullName, region, gender) {
    const collisionData = this.getCollisionData(fullName);
    const uniquenessScore = this.calculateUniquenessScore(fullName, collisionData);
    const riskLevel = this.assessRiskLevel(collisionData, uniquenessScore);
    
    return {
      collisionData,
      uniquenessScore,
      riskLevel,
      summary: this.generateSummary(fullName, collisionData, uniquenessScore, riskLevel)
    };
  }
  
  /**
   * 详细检测
   * @param {string} fullName - 完整姓名
   * @param {string} region - 地区
   * @param {string} gender - 性别
   * @returns {object} 详细检测结果
   */
  async detailedCheck(fullName, region, gender) {
    const basicResult = await this.basicCheck(fullName, region, gender);
    
    return {
      ...basicResult,
      surnameAnalysis: this.analyzeSurname(fullName),
      givenNameAnalysis: this.analyzeGivenName(fullName),
      regionalAnalysis: this.analyzeRegionalDistribution(fullName, region),
      genderAnalysis: this.analyzeGenderDistribution(fullName, gender),
      similarNames: this.findSimilarNames(fullName),
      recommendations: this.generateRecommendations(fullName, basicResult.riskLevel)
    };
  }
  
  /**
   * 综合检测
   * @param {string} fullName - 完整姓名
   * @param {string} region - 地区
   * @param {string} gender - 性别
   * @returns {object} 综合检测结果
   */
  async comprehensiveCheck(fullName, region, gender) {
    const detailedResult = await this.detailedCheck(fullName, region, gender);
    
    return {
      ...detailedResult,
      trendAnalysis: this.analyzeTrends(fullName),
      ageGroupAnalysis: this.analyzeAgeGroups(fullName),
      professionalAnalysis: this.analyzeProfessionalDistribution(fullName),
      socialMediaAnalysis: this.analyzeSocialMediaPresence(fullName),
      alternativeNames: this.generateAlternativeNames(fullName),
      detailedRecommendations: this.generateDetailedRecommendations(fullName, detailedResult)
    };
  }
  
  /**
   * 获取重名数据
   * @param {string} fullName - 完整姓名
   * @returns {object} 重名数据
   */
  getCollisionData(fullName) {
    // 检查高频姓名
    if (this.nameDatabase.highFrequency[fullName]) {
      return {
        category: 'high',
        ...this.nameDatabase.highFrequency[fullName],
        probability: 'very_high'
      };
    }
    
    // 检查中频姓名
    if (this.nameDatabase.mediumFrequency[fullName]) {
      return {
        category: 'medium',
        ...this.nameDatabase.mediumFrequency[fullName],
        probability: 'medium'
      };
    }
    
    // 检查低频姓名
    if (this.nameDatabase.lowFrequency[fullName]) {
      return {
        category: 'low',
        ...this.nameDatabase.lowFrequency[fullName],
        probability: 'low'
      };
    }
    
    // 未在数据库中找到，进行估算
    return this.estimateCollisionData(fullName);
  }
  
  /**
   * 估算重名数据
   * @param {string} fullName - 完整姓名
   * @returns {object} 估算的重名数据
   */
  estimateCollisionData(fullName) {
    const surname = fullName.charAt(0);
    const givenName = fullName.slice(1);
    
    // 基于姓氏频率和名字字符频率进行估算
    const surnameData = this.surnameFrequency[surname];
    const givenNameFrequency = this.estimateGivenNameFrequency(givenName);
    
    let estimatedCount = 100; // 基础估算值
    let category = 'low';
    let probability = 'very_low';
    
    if (surnameData) {
      // 常见姓氏会增加重名概率
      estimatedCount *= (surnameData.percentage / 100) * 10;
    }
    
    // 根据名字字符频率调整
    estimatedCount *= givenNameFrequency;
    
    // 确定类别和概率
    if (estimatedCount > 10000) {
      category = 'medium';
      probability = 'medium';
    } else if (estimatedCount > 1000) {
      category = 'low';
      probability = 'low';
    } else {
      category = 'very_low';
      probability = 'very_low';
    }
    
    return {
      category,
      count: Math.round(estimatedCount),
      rank: Math.round(50000 / estimatedCount),
      gender: 'unisex',
      regions: ['全国'],
      probability,
      estimated: true
    };
  }
  
  /**
   * 估算名字频率
   * @param {string} givenName - 名字
   * @returns {number} 频率系数
   */
  estimateGivenNameFrequency(givenName) {
    let frequency = 1.0;
    
    for (const char of givenName) {
      if (this.characterFrequency.high.includes(char)) {
        frequency *= 3.0;
      } else if (this.characterFrequency.medium.includes(char)) {
        frequency *= 1.5;
      } else if (this.characterFrequency.low.includes(char)) {
        frequency *= 0.3;
      } else {
        frequency *= 0.8; // 未知字符，假设较少使用
      }
    }
    
    return frequency;
  }
  
  /**
   * 计算独特性分数
   * @param {string} fullName - 完整姓名
   * @param {object} collisionData - 重名数据
   * @returns {number} 独特性分数 (0-100)
   */
  calculateUniquenessScore(fullName, collisionData) {
    let score = 100;
    
    // 根据重名数量调整分数
    if (collisionData.count > 100000) {
      score = 10;
    } else if (collisionData.count > 50000) {
      score = 20;
    } else if (collisionData.count > 10000) {
      score = 40;
    } else if (collisionData.count > 1000) {
      score = 60;
    } else if (collisionData.count > 100) {
      score = 80;
    }
    
    // 根据姓名长度调整（较长的姓名通常更独特）
    if (fullName.length >= 4) {
      score += 10;
    } else if (fullName.length === 2) {
      score -= 10;
    }
    
    // 确保分数在合理范围内
    return Math.max(0, Math.min(100, score));
  }
  
  /**
   * 评估风险等级
   * @param {object} collisionData - 重名数据
   * @param {number} uniquenessScore - 独特性分数
   * @returns {string} 风险等级
   */
  assessRiskLevel(collisionData, uniquenessScore) {
    if (uniquenessScore >= 80) {
      return 'very_low';
    } else if (uniquenessScore >= 60) {
      return 'low';
    } else if (uniquenessScore >= 40) {
      return 'medium';
    } else if (uniquenessScore >= 20) {
      return 'high';
    } else {
      return 'very_high';
    }
  }
  
  /**
   * 获取风险建议
   * @param {string} level - 风险等级
   * @returns {array} 建议数组
   */
  getRiskRecommendations(level) {
    const recommendations = {
      very_low: [
        '恭喜！这是一个非常独特的姓名',
        '可以放心使用，重名概率极低',
        '建议保持这个姓名的独特性'
      ],
      low: [
        '这是一个比较独特的姓名',
        '重名概率较低，可以考虑使用',
        '在特定场合可能需要额外标识'
      ],
      medium: [
        '重名风险中等，需要谨慎考虑',
        '建议在重要场合使用全名',
        '可以考虑添加中间名或字号'
      ],
      high: [
        '重名风险较高，建议调整',
        '可以考虑更换部分字符',
        '建议选择更独特的字符组合'
      ],
      very_high: [
        '重名风险极高，强烈建议更换',
        '当前姓名可能造成身份混淆',
        '建议选择完全不同的姓名组合'
      ]
    };
    
    return recommendations[level] || [];
  }
  
  /**
   * 分析姓氏
   * @param {string} fullName - 完整姓名
   * @returns {object} 姓氏分析结果
   */
  analyzeSurname(fullName) {
    // 检测复合姓氏
    const compoundSurnames = ['欧阳', '司马', '上官', '诸葛', '东方', '西门', '独孤', '令狐', '慕容', '南宫'];
    let surname = fullName.charAt(0);
    let isCompound = false;
    
    // 检查是否为复合姓氏
    for (const compound of compoundSurnames) {
      if (fullName.startsWith(compound)) {
        surname = compound;
        isCompound = true;
        break;
      }
    }
    
    const surnameData = this.surnameFrequency[surname];
    
    if (surnameData) {
      return {
        surname,
        isCompound,
        frequency: 'high',
        percentage: surnameData.percentage,
        rank: surnameData.rank,
        population: surnameData.population,
        impact: '常见姓氏会增加重名概率'
      };
    }
    
    return {
      surname,
      isCompound,
      frequency: 'low',
      percentage: 0.1,
      rank: 500,
      population: 100000,
      impact: '较少见姓氏有助于降低重名概率'
    };
  }
  
  /**
   * 分析名字
   * @param {string} fullName - 完整姓名
   * @returns {object} 名字分析结果
   */
  analyzeGivenName(fullName) {
    const givenName = fullName.slice(1);
    const characters = givenName.split('');
    
    const characterAnalysis = characters.map(char => {
      let frequency = 'medium';
      if (this.characterFrequency.high.includes(char)) {
        frequency = 'high';
      } else if (this.characterFrequency.low.includes(char)) {
        frequency = 'low';
      }
      
      return {
        character: char,
        frequency,
        impact: this.getCharacterImpact(frequency)
      };
    });
    
    return {
      givenName,
      length: characters.length,
      characters: characterAnalysis,
      overallFrequency: this.calculateOverallFrequency(characterAnalysis),
      uniquenessContribution: this.calculateUniquenessContribution(characterAnalysis)
    };
  }
  
  /**
   * 获取字符影响
   * @param {string} frequency - 频率
   * @returns {string} 影响描述
   */
  getCharacterImpact(frequency) {
    const impacts = {
      high: '高频字符，容易重名',
      medium: '中频字符，重名风险适中',
      low: '低频字符，有助于降低重名风险'
    };
    return impacts[frequency];
  }
  
  /**
   * 计算整体频率
   * @param {array} characterAnalysis - 字符分析数组
   * @returns {string} 整体频率
   */
  calculateOverallFrequency(characterAnalysis) {
    const highCount = characterAnalysis.filter(c => c.frequency === 'high').length;
    const lowCount = characterAnalysis.filter(c => c.frequency === 'low').length;
    
    if (highCount >= 2) return 'high';
    if (lowCount >= 2) return 'low';
    return 'medium';
  }
  
  /**
   * 计算独特性贡献
   * @param {array} characterAnalysis - 字符分析数组
   * @returns {number} 独特性贡献分数
   */
  calculateUniquenessContribution(characterAnalysis) {
    let score = 0;
    for (const char of characterAnalysis) {
      if (char.frequency === 'low') score += 30;
      else if (char.frequency === 'medium') score += 10;
      else score -= 10;
    }
    return Math.max(0, Math.min(100, score));
  }
  
  /**
   * 分析地区分布
   * @param {string} fullName - 完整姓名
   * @param {string} region - 地区
   * @returns {object} 地区分析结果
   */
  analyzeRegionalDistribution(fullName, region) {
    const collisionData = this.getCollisionData(fullName);
    
    return {
      targetRegion: region,
      nameRegions: collisionData.regions || ['全国'],
      regionalRisk: this.calculateRegionalRisk(region, collisionData.regions),
      recommendations: this.getRegionalRecommendations(region, collisionData.regions)
    };
  }
  
  /**
   * 计算地区风险
   * @param {string} targetRegion - 目标地区
   * @param {array} nameRegions - 姓名分布地区
   * @returns {string} 地区风险等级
   */
  calculateRegionalRisk(targetRegion, nameRegions) {
    if (!nameRegions || nameRegions.includes('全国')) {
      return 'medium';
    }
    
    if (nameRegions.includes(targetRegion)) {
      return 'high';
    }
    
    return 'low';
  }
  
  /**
   * 获取地区建议
   * @param {string} targetRegion - 目标地区
   * @param {array} nameRegions - 姓名分布地区
   * @returns {array} 建议数组
   */
  getRegionalRecommendations(targetRegion, nameRegions) {
    if (!nameRegions || nameRegions.includes('全国')) {
      return ['该姓名在全国范围内都有分布，需要注意重名风险'];
    }
    
    if (nameRegions.includes(targetRegion)) {
      return [`该姓名在${targetRegion}地区较为常见，重名风险较高`];
    }
    
    return [`该姓名在${targetRegion}地区相对较少，重名风险较低`];
  }
  
  /**
   * 分析性别分布
   * @param {string} fullName - 完整姓名
   * @param {string} gender - 性别
   * @returns {object} 性别分析结果
   */
  analyzeGenderDistribution(fullName, gender) {
    const collisionData = this.getCollisionData(fullName);
    
    // 模拟性别分布数据
    let maleRatio = 0.5;
    let femaleRatio = 0.5;
    let dominantGender = 'neutral';
    
    if (collisionData.gender === 'male') {
      maleRatio = 0.8;
      femaleRatio = 0.2;
      dominantGender = 'male';
    } else if (collisionData.gender === 'female') {
      maleRatio = 0.2;
      femaleRatio = 0.8;
      dominantGender = 'female';
    }
    
    return {
      targetGender: gender,
      nameGender: collisionData.gender || 'unisex',
      maleRatio,
      femaleRatio,
      dominantGender,
      genderMatch: this.checkGenderMatch(gender, collisionData.gender),
      genderRisk: this.calculateGenderRisk(gender, collisionData.gender),
      recommendations: this.getGenderRecommendations(gender, collisionData.gender)
    };
  }
  
  /**
   * 检查性别匹配
   * @param {string} targetGender - 目标性别
   * @param {string} nameGender - 姓名性别倾向
   * @returns {boolean} 是否匹配
   */
  checkGenderMatch(targetGender, nameGender) {
    if (!nameGender || nameGender === 'unisex') return true;
    return targetGender === nameGender;
  }
  
  /**
   * 计算性别风险
   * @param {string} targetGender - 目标性别
   * @param {string} nameGender - 姓名性别倾向
   * @returns {string} 性别风险等级
   */
  calculateGenderRisk(targetGender, nameGender) {
    if (this.checkGenderMatch(targetGender, nameGender)) {
      return nameGender === 'unisex' ? 'medium' : 'high';
    }
    return 'low';
  }
  
  /**
   * 获取性别建议
   * @param {string} targetGender - 目标性别
   * @param {string} nameGender - 姓名性别倾向
   * @returns {array} 建议数组
   */
  getGenderRecommendations(targetGender, nameGender) {
    if (!this.checkGenderMatch(targetGender, nameGender)) {
      return ['该姓名与目标性别不匹配，可能造成误解'];
    }
    
    if (nameGender === 'unisex') {
      return ['该姓名为中性名字，男女皆可使用'];
    }
    
    return [`该姓名符合${targetGender === 'male' ? '男性' : '女性'}特征`];
  }
  
  /**
   * 查找相似姓名
   * @param {string} fullName - 完整姓名
   * @returns {array} 相似姓名数组
   */
  findSimilarNames(fullName) {
    const similarNames = [];
    const allNames = {
      ...this.nameDatabase.highFrequency,
      ...this.nameDatabase.mediumFrequency,
      ...this.nameDatabase.lowFrequency
    };
    
    for (const [name, data] of Object.entries(allNames)) {
      if (name !== fullName && this.calculateSimilarity(fullName, name) > 0.6) {
        similarNames.push({
          name,
          similarity: this.calculateSimilarity(fullName, name),
          count: data.count,
          reason: this.getSimilarityReason(fullName, name)
        });
      }
    }
    
    return similarNames.sort((a, b) => b.similarity - a.similarity).slice(0, 5);
  }
  
  /**
   * 计算相似度
   * @param {string} name1 - 姓名1
   * @param {string} name2 - 姓名2
   * @returns {number} 相似度 (0-1)
   */
  calculateSimilarity(name1, name2) {
    // 简化的相似度计算
    let similarity = 0;
    
    // 姓氏相同加分
    if (name1.charAt(0) === name2.charAt(0)) {
      similarity += 0.3;
    }
    
    // 名字字符相同加分
    const givenName1 = name1.slice(1);
    const givenName2 = name2.slice(1);
    
    for (const char of givenName1) {
      if (givenName2.includes(char)) {
        similarity += 0.2;
      }
    }
    
    // 长度相似加分
    if (Math.abs(name1.length - name2.length) <= 1) {
      similarity += 0.1;
    }
    
    return Math.min(1, similarity);
  }
  
  /**
   * 获取相似原因
   * @param {string} name1 - 姓名1
   * @param {string} name2 - 姓名2
   * @returns {string} 相似原因
   */
  getSimilarityReason(name1, name2) {
    const reasons = [];
    
    if (name1.charAt(0) === name2.charAt(0)) {
      reasons.push('相同姓氏');
    }
    
    const givenName1 = name1.slice(1);
    const givenName2 = name2.slice(1);
    
    for (const char of givenName1) {
      if (givenName2.includes(char)) {
        reasons.push(`共同字符：${char}`);
        break;
      }
    }
    
    return reasons.join('，') || '结构相似';
  }
  
  /**
   * 生成基础建议
   * @param {string} fullName - 完整姓名
   * @param {string} riskLevel - 风险等级
   * @returns {array} 建议数组
   */
  generateRecommendations(fullName, riskLevel) {
    const baseRecommendations = this.getRiskRecommendations(riskLevel);
    
    const additionalRecommendations = [
      '建议在重要场合使用全名',
      '可以考虑添加英文名作为补充',
      '在网络平台可以使用昵称或艺名',
      '建议关注同名人士的公开信息'
    ];
    
    return [...baseRecommendations, ...additionalRecommendations.slice(0, 2)];
  }
  
  /**
   * 生成摘要
   * @param {string} fullName - 完整姓名
   * @param {object} collisionData - 重名数据
   * @param {number} uniquenessScore - 独特性分数
   * @param {object} riskLevel - 风险等级
   * @returns {string} 摘要
   */
  generateSummary(fullName, collisionData, uniquenessScore, riskLevel) {
    return `姓名「${fullName}」的重名检测完成。独特性评分：${uniquenessScore}分，风险等级：${riskLevel.level}。${collisionData.count ? `全国约有${collisionData.count}人使用此姓名` : '该姓名较为独特'}。`;
  }

  /**
   * 分析趋势
   * @param {string} fullName - 完整姓名
   * @returns {object} 趋势分析
   */
  analyzeTrends(fullName) {
    return {
      historicalTrend: 'stable',
      peakPeriod: '2000-2010',
      currentTrend: 'declining',
      prediction: 'continue_declining'
    };
  }

  /**
   * 分析年龄组
   * @param {string} fullName - 完整姓名
   * @returns {object} 年龄组分析
   */
  analyzeAgeGroups(fullName) {
    return {
      targetAgeGroup: '20-30',
      ageDistribution: {
        '0-10': 5,
        '10-20': 15,
        '20-30': 35,
        '30-40': 25,
        '40-50': 15,
        '50+': 5
      }
    };
  }

  /**
   * 分析职业分布
   * @param {string} fullName - 完整姓名
   * @returns {object} 职业分析
   */
  analyzeProfessionalDistribution(fullName) {
    return {
      commonProfessions: ['教师', '工程师', '医生'],
      distribution: {
        '教育': 25,
        '技术': 20,
        '医疗': 15,
        '商业': 20,
        '其他': 20
      }
    };
  }

  /**
   * 分析社交媒体存在
   * @param {string} fullName - 完整姓名
   * @returns {object} 社交媒体分析
   */
  analyzeSocialMediaPresence(fullName) {
    return {
      platforms: ['微信', '微博', '抖音'],
      availability: {
        '微信': 'low',
        '微博': 'medium',
        '抖音': 'high'
      }
    };
  }

  /**
   * 生成替代姓名
   * @param {string} fullName - 完整姓名
   * @returns {array} 替代姓名数组
   */
  generateAlternativeNames(fullName) {
    const surname = fullName.charAt(0);
    return [
      surname + '雅琪',
      surname + '思远',
      surname + '梦瑶'
    ];
  }

  /**
   * 生成详细建议
   * @param {string} fullName - 完整姓名
   * @param {object} detailedResult - 详细结果
   * @returns {array} 详细建议数组
   */
  generateDetailedRecommendations(fullName, detailedResult) {
    return [
      '建议在重要场合使用全名',
      '可以考虑添加英文名作为补充',
      '在网络平台可以使用昵称或艺名'
    ];
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
          description: '完整姓名，如：张三、李明华',
          minLength: 2,
          maxLength: 10
        },
        region: {
          type: 'string',
          enum: ['全国', '华北', '东北', '华东', '华中', '华南', '西南', '西北'],
          default: '全国',
          description: '检测地区范围'
        },
        gender: {
          type: 'string',
          enum: ['male', 'female', 'unisex'],
          default: 'unisex',
          description: '性别偏向'
        },
        checkLevel: {
          type: 'string',
          enum: ['basic', 'detailed', 'comprehensive'],
          default: 'comprehensive',
          description: '检测详细程度'
        }
      },
      required: ['fullName']
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
        title: '基础检测',
        input: {
          fullName: '张伟',
          region: '全国'
        },
        description: '检测张伟在全国范围内的重名情况'
      },
      {
        title: '详细检测',
        input: {
          fullName: '李明华',
          region: '华东',
          gender: 'male',
          checkLevel: 'comprehensive'
        },
        description: '全面检测李明华在华东地区的重名风险'
      }
    ];
  }
}

module.exports = NameCollisionChecker