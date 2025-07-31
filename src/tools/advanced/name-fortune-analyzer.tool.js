/**
 * 姓名运势分析器 - 高级扩展工具
 * Name Fortune Analyzer - Advanced Extension Tool
 * 
 * @author 鲁班 (PromptX工具开发大师)
 * @version 1.0.0
 */

const BaseTool = require('../../utils/base-tool.js');

class NameFortuneAnalyzer extends BaseTool {
  constructor() {
    super(
      'name-fortune-analyzer',
      '基于传统命理学分析姓名运势，包括三才五格、数理吉凶等',
      'advanced'
    );
    
    // 初始化运势分析数据
    this.initializeFortuneData();
  }
  
  /**
   * 初始化运势分析数据
   */
  initializeFortuneData() {
    // 数理吉凶表（1-81数）
    this.numerologyTable = {
      1: { fortune: 'great', meaning: '太极之数，万物开泰，生发无穷，利禄亨通', category: '大吉' },
      2: { fortune: 'bad', meaning: '两仪之数，混沌未开，进退保守，志望难达', category: '大凶' },
      3: { fortune: 'great', meaning: '三才之数，天地人和，大事大业，繁荣昌隆', category: '大吉' },
      4: { fortune: 'bad', meaning: '四象之数，待于生发，万事慎重，不具营谋', category: '大凶' },
      5: { fortune: 'great', meaning: '五行之数，五行俱权，循环相生，圆通畅达', category: '大吉' },
      6: { fortune: 'great', meaning: '六爻之数，发展变化，天赋美德，吉祥安泰', category: '大吉' },
      7: { fortune: 'good', meaning: '七政之数，精悍严谨，天赋之力，吉星照耀', category: '吉' },
      8: { fortune: 'great', meaning: '八卦之数，乾坎艮震，巽离坤兑，无穷无尽', category: '大吉' },
      9: { fortune: 'bad', meaning: '大成之数，蕴涵凶险，或成或败，难以把握', category: '大凶' },
      10: { fortune: 'bad', meaning: '终数之数，雪暗飘零，偶或有成，回顾茫然', category: '大凶' },
      11: { fortune: 'great', meaning: '旱苗逢雨，枯木逢春，稳健着实，必得人望', category: '大吉' },
      12: { fortune: 'bad', meaning: '无理之数，发展薄弱，虽生不足，难酬志向', category: '凶' },
      13: { fortune: 'great', meaning: '天才之数，多才多艺，忍柔当事，鸣奏大雅', category: '大吉' },
      14: { fortune: 'bad', meaning: '破兆之数，家庭缘薄，孤独遭难，谋事不达', category: '凶' },
      15: { fortune: 'great', meaning: '福寿之数，福寿圆满，富贵荣誉，涵养雅量', category: '大吉' },
      16: { fortune: 'great', meaning: '厚重之数，厚德载物，安富尊荣，财官双美', category: '大吉' },
      17: { fortune: 'good', meaning: '刚强之数，权威刚强，突破万难，如能容忍', category: '半吉' },
      18: { fortune: 'great', meaning: '铁镜重磨，权威显达，博得名利，且养柔德', category: '大吉' },
      19: { fortune: 'bad', meaning: '多难之数，风云蔽日，辛苦重来，虽有智谋', category: '凶' },
      20: { fortune: 'bad', meaning: '屋下藏金，非业破运，灾难重重，进退维谷', category: '凶' },
      21: { fortune: 'great', meaning: '明月中天，万物确立，官运亨通，大搏名利', category: '大吉' },
      22: { fortune: 'bad', meaning: '秋草逢霜，怀才不遇，忧愁怨苦，事不如意', category: '凶' },
      23: { fortune: 'great', meaning: '壮丽之数，旭日东升，壮丽壮观，权威旺盛', category: '大吉' },
      24: { fortune: 'great', meaning: '掘藏得金，家门余庆，金钱丰盈，白手成家', category: '大吉' },
      25: { fortune: 'good', meaning: '荣俊之数，资性英敏，才能奇特，克服傲慢', category: '半吉' },
      26: { fortune: 'bad', meaning: '变怪之数，英雄豪杰，波澜重叠，而奏大功', category: '凶' },
      27: { fortune: 'bad', meaning: '增长之数，欲望无止，自我强烈，多受毁谤', category: '半凶' },
      28: { fortune: 'bad', meaning: '阔水浮萍，遭难之数，豪杰气概，四海漂泊', category: '凶' },
      29: { fortune: 'good', meaning: '智谋之数，财力归集，名闻海内，成就大业', category: '半吉' },
      30: { fortune: 'bad', meaning: '非运之数，沉浮不定，凶吉难变，若明若暗', category: '半凶' },
      31: { fortune: 'great', meaning: '春日花开，智勇得志，博得名利，统领众人', category: '大吉' },
      32: { fortune: 'great', meaning: '宝马金鞍，侥幸多望，若得长上，其成功', category: '大吉' },
      33: { fortune: 'great', meaning: '旭日升天，鸾凤相会，名闻天下，隆昌至极', category: '大吉' },
      34: { fortune: 'bad', meaning: '破家之数，见识短小，辛苦遭逢，灾祸至极', category: '大凶' },
      35: { fortune: 'good', meaning: '高楼望月，温和平静，智达通畅，文昌技艺', category: '吉' },
      36: { fortune: 'bad', meaning: '波澜重叠，沉浮万状，侠肝义胆，舍己成仁', category: '半凶' },
      37: { fortune: 'great', meaning: '猛虎出林，权威显达，热诚忠信，宜着雅量', category: '大吉' },
      38: { fortune: 'bad', meaning: '磨铁成针，意志薄弱，刻意经营，才识不凡', category: '半凶' },
      39: { fortune: 'good', meaning: '富贵之数，富贵荣华，财帛丰盈，暗藏险象', category: '半吉' },
      40: { fortune: 'bad', meaning: '退安之数，谨慎保安，智谋胆略，知难而退', category: '半凶' },
      41: { fortune: 'great', meaning: '有德之数，纯阳独秀，德高望重，和顺畅达', category: '大吉' },
      42: { fortune: 'bad', meaning: '寒蝉在柳，博识多能，精通世情，如能专心', category: '半凶' },
      43: { fortune: 'bad', meaning: '散财破产，虽有智能，意志薄弱，诸事不如意', category: '半凶' },
      44: { fortune: 'bad', meaning: '烦闷之数，破家亡身，暗藏惨淡，事不如意', category: '大凶' },
      45: { fortune: 'good', meaning: '顺风之数，新生泰和，乘风扬帆，智谋经纬', category: '吉' },
      46: { fortune: 'bad', meaning: '浪里淘金，载宝沉舟，扬帆遇雨，始入困境', category: '凶' },
      47: { fortune: 'great', meaning: '点石成金，花开之象，万事如意，祯祥吉庆', category: '大吉' },
      48: { fortune: 'good', meaning: '古松立鹤，智谋兼备，德量荣达，威望成师', category: '吉' },
      49: { fortune: 'bad', meaning: '转变之数，吉临则吉，凶来则凶，转凶为吉', category: '半凶' },
      50: { fortune: 'bad', meaning: '小舟入海，吉凶参半，须防倾覆，始保安然', category: '半凶' },
      51: { fortune: 'good', meaning: '沉浮之数，盛衰交加，波澜重叠，始保安然', category: '半吉' },
      52: { fortune: 'good', meaning: '达眼之数，先见之明，智谋超群，名利双收', category: '吉' },
      53: { fortune: 'bad', meaning: '曲卷之数，外祥内忧，外祸内安，先富后贫', category: '半凶' },
      54: { fortune: 'bad', meaning: '石上栽花，难望成功，忧闷烦来，辛惨不绝', category: '凶' },
      55: { fortune: 'bad', meaning: '善恶之数，外美内苦，先吉后凶，先凶后吉', category: '半凶' },
      56: { fortune: 'bad', meaning: '浪里行舟，历尽艰险，四周障碍，万事龃龌', category: '凶' },
      57: { fortune: 'good', meaning: '日照春松，寒雪青松，夜莺吟春，必遭一过', category: '半吉' },
      58: { fortune: 'bad', meaning: '晚行遇雨，半凶半吉，先吉后凶，先凶后吉', category: '半凶' },
      59: { fortune: 'bad', meaning: '寒蝉悲风，时运不济，缺乏实行，不如更名', category: '凶' },
      60: { fortune: 'bad', meaning: '无谋之数，争名夺利，黑暗无光，切莫妄动', category: '凶' },
      61: { fortune: 'good', meaning: '牡丹芙蓉，花开富贵，名利双收，定享天赋', category: '吉' },
      62: { fortune: 'bad', meaning: '衰败之数，内外不和，志望难达，凶祸频来', category: '凶' },
      63: { fortune: 'great', meaning: '舟出平海，富贵繁荣，身心安泰，雨露惠泽', category: '大吉' },
      64: { fortune: 'bad', meaning: '骨肉分离，孤独悲愁，难望成功，破败凶祸', category: '凶' },
      65: { fortune: 'great', meaning: '巨流归海，天长地久，家运隆昌，五福临门', category: '大吉' },
      66: { fortune: 'bad', meaning: '岩头步马，进退维谷，艰难不堪，凶祸交加', category: '凶' },
      67: { fortune: 'great', meaning: '通达之数，天赋幸运，四通八达，家道繁昌', category: '大吉' },
      68: { fortune: 'great', meaning: '顺风吹帆，智谋经纬，家道昌隆，富贵东来', category: '大吉' },
      69: { fortune: 'bad', meaning: '非业之数，惨淡经营，不无功效，艰难困苦', category: '凶' },
      70: { fortune: 'bad', meaning: '残菊逢霜，寂寞无碍，惨淡忧愁，晚景凄凉', category: '凶' },
      71: { fortune: 'bad', meaning: '石上金花，内忧外患，贯彻始终，定可成功', category: '半凶' },
      72: { fortune: 'bad', meaning: '劳苦之数，毫无实益，如无智谋，难望成功', category: '凶' },
      73: { fortune: 'good', meaning: '志高力微，努力奋斗，忘己利他，志在四方', category: '半吉' },
      74: { fortune: 'bad', meaning: '残菊经霜，秋叶寂寞，无能无智，辛苦繁多', category: '凶' },
      75: { fortune: 'bad', meaning: '退守之数，保守平安，智谋胆略，难望大成', category: '半凶' },
      76: { fortune: 'bad', meaning: '离散破财，骨肉分离，内外不和，虽劳无功', category: '凶' },
      77: { fortune: 'good', meaning: '家庭有悦，半吉半凶，能获援护，陷落不幸', category: '半吉' },
      78: { fortune: 'bad', meaning: '晚苦之数，祸福参半，先苦后甘，先甘后苦', category: '半凶' },
      79: { fortune: 'bad', meaning: '云头望月，身疲力尽，穷迫不伸，精神不定', category: '凶' },
      80: { fortune: 'bad', meaning: '遁世之数，辛苦不绝，意志薄弱，缺乏勇气', category: '凶' },
      81: { fortune: 'great', meaning: '万物回春，还元复始，最吉之数，还本归元', category: '大吉' }
    };
    
    // 三才配置（天格、人格、地格的五行组合）
    this.threeGeniusConfig = {
      '金金金': { fortune: 'good', meaning: '性格刚强，富有活动力，但容易急躁' },
      '金金木': { fortune: 'bad', meaning: '虽有成功运，但基础不稳，易生意外' },
      '金金水': { fortune: 'great', meaning: '成功顺利，能达到目的，境遇安固' },
      '金金火': { fortune: 'bad', meaning: '虽可成功，但境遇不安，易生心肺疾病' },
      '金金土': { fortune: 'great', meaning: '可获得意外成功发展，名利双收' },
      '金木金': { fortune: 'bad', meaning: '成功运被压抑，不能有所伸张' },
      '金木木': { fortune: 'good', meaning: '有成功运，基础尚稳固，但易陷于孤独' },
      '金木水': { fortune: 'great', meaning: '有成功运和发展运，一生平安' },
      '金木火': { fortune: 'bad', meaning: '虽有一时的成功，但境遇不安' },
      '金木土': { fortune: 'good', meaning: '可获得意外成功发展，但要注意基础' },
      '金水金': { fortune: 'great', meaning: '成功运佳，可以达到希望的目的' },
      '金水木': { fortune: 'great', meaning: '有成功运，基础安定，能获得幸福' },
      '金水水': { fortune: 'great', meaning: '成功运极佳，基础运也佳' },
      '金水火': { fortune: 'good', meaning: '可以成功，但要防意外' },
      '金水土': { fortune: 'great', meaning: '成功运佳，可以实现希望' },
      '金火金': { fortune: 'bad', meaning: '虽有成功运，但基础不稳' },
      '金火木': { fortune: 'bad', meaning: '成功运被压抑，易生不平不满' },
      '金火水': { fortune: 'bad', meaning: '一时虽可成功，但境遇不安' },
      '金火火': { fortune: 'bad', meaning: '虽可成功于一时，但易生破乱' },
      '金火土': { fortune: 'good', meaning: '可获得意外成功发展' },
      '金土金': { fortune: 'great', meaning: '可获得意外成功发展，名利双收' },
      '金土木': { fortune: 'good', meaning: '虽可成功，但基础不太安定' },
      '金土水': { fortune: 'great', meaning: '可获得意外成功发展' },
      '金土火': { fortune: 'good', meaning: '可获得意外成功发展' },
      '金土土': { fortune: 'great', meaning: '可获得意外成功发展，名利双收' }
    };
    
    // 五行属性表（根据笔画数确定）
    this.fiveElementsTable = {
      1: '木', 2: '木', 3: '火', 4: '火', 5: '土',
      6: '土', 7: '金', 8: '金', 9: '水', 10: '水'
    };
    
    // 五格计算规则
    this.fiveGridRules = {
      '天格': {
        description: '代表祖运，对人生影响不大',
        calculation: '单姓：姓氏笔画+1；复姓：两字笔画相加',
        influence: '祖先遗传，先天条件'
      },
      '人格': {
        description: '代表主运，影响人的一生命运',
        calculation: '单姓：姓氏笔画+名字第一字笔画；复姓：姓氏第二字+名字第一字',
        influence: '性格、才能、事业'
      },
      '地格': {
        description: '代表前运，影响36岁以前',
        calculation: '单名：名字笔画+1；双名：名字两字笔画相加',
        influence: '青少年运势、基础运'
      },
      '外格': {
        description: '代表副运，影响人际关系',
        calculation: '总格-人格+1（单名时为2）',
        influence: '社交能力、人际关系'
      },
      '总格': {
        description: '代表后运，影响36岁以后',
        calculation: '姓名所有字的笔画总和',
        influence: '中晚年运势、总体运程'
      }
    };
    
    // 运势等级定义
    this.fortuneLevels = {
      'great': { score: 90, description: '大吉', color: '#ff6b6b' },
      'good': { score: 75, description: '吉', color: '#4ecdc4' },
      'neutral': { score: 60, description: '中', color: '#45b7d1' },
      'bad': { score: 40, description: '凶', color: '#f9ca24' },
      'terrible': { score: 20, description: '大凶', color: '#6c5ce7' }
    };
    
    // 人生运势方面
    this.fortuneAspects = {
      '事业运': {
        description: '工作、事业发展方面的运势',
        keywords: ['成功', '发展', '机遇', '挑战', '成就'],
        weight: 0.25
      },
      '财运': {
        description: '财富、金钱方面的运势',
        keywords: ['财富', '收入', '投资', '理财', '积累'],
        weight: 0.2
      },
      '感情运': {
        description: '爱情、婚姻、人际关系运势',
        keywords: ['爱情', '婚姻', '友情', '人缘', '和谐'],
        weight: 0.2
      },
      '健康运': {
        description: '身体健康、精神状态运势',
        keywords: ['健康', '体质', '精神', '活力', '长寿'],
        weight: 0.15
      },
      '学业运': {
        description: '学习、考试、知识获取运势',
        keywords: ['学习', '智慧', '考试', '知识', '成绩'],
        weight: 0.1
      },
      '家庭运': {
        description: '家庭和睦、亲情关系运势',
        keywords: ['家庭', '亲情', '和睦', '孝顺', '传承'],
        weight: 0.1
      }
    };
    
    // 年龄段运势
    this.ageFortunePhases = {
      '幼年期': { range: '0-12岁', influence: '地格', description: '基础运势，性格形成期' },
      '青年期': { range: '13-25岁', influence: '人格+地格', description: '学业发展，初入社会' },
      '壮年期': { range: '26-40岁', influence: '人格', description: '事业发展，成家立业' },
      '中年期': { range: '41-55岁', influence: '人格+外格', description: '事业巅峰，承上启下' },
      '晚年期': { range: '56岁以上', influence: '总格', description: '享受成果，颐养天年' }
    };
  }
  
  /**
   * 执行运势分析
   * @param {object} params - 输入参数
   * @returns {Promise<object>} 分析结果
   */
  async execute(params) {
    try {
      this._updateStats();
      this.log('info', '开始运势分析', params);
      
      const { 
        fullName, 
        analysisType = 'comprehensive',
        includeAspects = ['all'],
        includePredictions = true,
        includeAdvice = true
      } = params;
      
      // 解析姓名结构
      const nameStructure = this.parseNameStructure(fullName);
      
      // 计算笔画数
      const strokeCounts = this.calculateStrokeCounts(nameStructure);
      
      // 计算五格
      const fiveGrids = this.calculateFiveGrids(strokeCounts);
      
      // 分析数理吉凶
      const numerologyAnalysis = this.analyzeNumerology(fiveGrids);
      
      // 分析三才配置
      const threeGeniusAnalysis = this.analyzeThreeGenius(fiveGrids);
      
      // 分析各方面运势
      const aspectAnalysis = this.analyzeFortuneAspects(fiveGrids, includeAspects);
      
      // 分析年龄段运势
      const ageAnalysis = this.analyzeAgePhases(fiveGrids);
      
      // 生成预测和建议
      const predictions = includePredictions ? this.generatePredictions(fiveGrids, aspectAnalysis) : null;
      const advice = includeAdvice ? this.generateAdvice(fiveGrids, aspectAnalysis) : null;
      
      // 计算综合运势分数
      const overallScore = this.calculateOverallScore(numerologyAnalysis, threeGeniusAnalysis, aspectAnalysis);
      
      const result = {
        fullName,
        nameStructure,
        strokeCounts,
        fiveGrids,
        numerologyAnalysis,
        threeGeniusAnalysis,
        aspectAnalysis,
        ageAnalysis,
        overallScore,
        predictions,
        advice,
        analysisDate: new Date().toISOString()
      };
      
      this.log('info', '运势分析完成');
      return this.createSuccessResponse(result);
      
    } catch (error) {
      this.log('error', '运势分析时发生错误', { error: error.message });
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
      surnameLength: surname.length,
      givenNameLength: givenName.length,
      structure: `${surname.length}+${givenName.length}`
    };
  }
  
  /**
   * 计算笔画数
   * @param {object} nameStructure - 姓名结构
   * @returns {object} 笔画数信息
   */
  calculateStrokeCounts(nameStructure) {
    // 简化的笔画数据库（实际应用中需要完整的汉字笔画库）
    const strokeDatabase = {
      '张': 11, '王': 4, '李': 7, '赵': 14, '刘': 15, '陈': 16, '杨': 13, '黄': 12, '周': 8, '吴': 7,
      '雅': 12, '琪': 13, '智': 12, '慧': 15, '德': 15, '华': 14, '文': 4, '武': 8, '明': 8, '亮': 9,
      '建': 9, '国': 8, '强': 12, '伟': 11, '新': 13, '春': 9, '秋': 9, '冬': 5, '夏': 10,
      '美': 9, '丽': 7, '芳': 10, '香': 9, '花': 8, '月': 4, '星': 9, '云': 4, '山': 3, '水': 4,
      '欧': 15, '阳': 17, '太': 4, '史': 5, '端': 14, '木': 4, '上': 3, '官': 8, '司': 5, '马': 10
    };
    
    const result = {
      surname: [],
      givenName: [],
      total: 0
    };
    
    // 计算姓氏笔画
    for (const char of nameStructure.surname) {
      const strokes = strokeDatabase[char] || 10; // 默认10画
      result.surname.push({ character: char, strokes });
      result.total += strokes;
    }
    
    // 计算名字笔画
    for (const char of nameStructure.givenName) {
      const strokes = strokeDatabase[char] || 10; // 默认10画
      result.givenName.push({ character: char, strokes });
      result.total += strokes;
    }
    
    return result;
  }
  
  /**
   * 计算五格
   * @param {object} strokeCounts - 笔画数信息
   * @returns {object} 五格信息
   */
  calculateFiveGrids(strokeCounts) {
    const surnameStrokes = strokeCounts.surname.map(s => s.strokes);
    const givenNameStrokes = strokeCounts.givenName.map(s => s.strokes);
    
    let tianGe, renGe, diGe, waiGe, zongGe;
    
    // 天格计算
    if (surnameStrokes.length === 1) {
      tianGe = surnameStrokes[0] + 1;
    } else {
      tianGe = surnameStrokes.reduce((sum, s) => sum + s, 0);
    }
    
    // 人格计算
    if (surnameStrokes.length === 1) {
      renGe = surnameStrokes[0] + (givenNameStrokes[0] || 0);
    } else {
      renGe = surnameStrokes[1] + (givenNameStrokes[0] || 0);
    }
    
    // 地格计算
    if (givenNameStrokes.length === 1) {
      diGe = givenNameStrokes[0] + 1;
    } else {
      diGe = givenNameStrokes.reduce((sum, s) => sum + s, 0);
    }
    
    // 总格计算
    zongGe = strokeCounts.total;
    
    // 外格计算
    if (givenNameStrokes.length === 1) {
      waiGe = 2;
    } else {
      waiGe = zongGe - renGe + 1;
    }
    
    return {
      天格: { value: tianGe, element: this.getElement(tianGe) },
      人格: { value: renGe, element: this.getElement(renGe) },
      地格: { value: diGe, element: this.getElement(diGe) },
      外格: { value: waiGe, element: this.getElement(waiGe) },
      总格: { value: zongGe, element: this.getElement(zongGe) }
    };
  }
  
  /**
   * 获取五行属性
   * @param {number} number - 数字
   * @returns {string} 五行属性
   */
  getElement(number) {
    const lastDigit = number % 10;
    return this.fiveElementsTable[lastDigit] || this.fiveElementsTable[lastDigit === 0 ? 10 : lastDigit];
  }
  
  /**
   * 分析数理吉凶
   * @param {object} fiveGrids - 五格信息
   * @returns {object} 数理分析结果
   */
  analyzeNumerology(fiveGrids) {
    const analysis = {};
    
    for (const [gridName, gridData] of Object.entries(fiveGrids)) {
      const number = gridData.value;
      const numerology = this.numerologyTable[number] || {
        fortune: 'neutral',
        meaning: '数理平常，需要综合分析',
        category: '中'
      };
      
      analysis[gridName] = {
        number,
        element: gridData.element,
        fortune: numerology.fortune,
        meaning: numerology.meaning,
        category: numerology.category,
        score: this.fortuneLevels[numerology.fortune].score,
        influence: this.fiveGridRules[gridName]?.influence || '综合影响'
      };
    }
    
    return analysis;
  }
  
  /**
   * 分析三才配置
   * @param {object} fiveGrids - 五格信息
   * @returns {object} 三才分析结果
   */
  analyzeThreeGenius(fiveGrids) {
    const tianElement = fiveGrids.天格.element;
    const renElement = fiveGrids.人格.element;
    const diElement = fiveGrids.地格.element;
    
    const configKey = `${tianElement}${renElement}${diElement}`;
    const config = this.threeGeniusConfig[configKey] || {
      fortune: 'neutral',
      meaning: '三才配置一般，需要综合分析'
    };
    
    return {
      configuration: `${tianElement}-${renElement}-${diElement}`,
      fortune: config.fortune,
      meaning: config.meaning,
      score: this.fortuneLevels[config.fortune].score,
      elements: {
        天格: tianElement,
        人格: renElement,
        地格: diElement
      },
      analysis: this.analyzeElementInteraction(tianElement, renElement, diElement)
    };
  }
  
  /**
   * 分析五行相互作用
   * @param {string} tian - 天格五行
   * @param {string} ren - 人格五行
   * @param {string} di - 地格五行
   * @returns {object} 五行相互作用分析
   */
  analyzeElementInteraction(tian, ren, di) {
    const interactions = {
      '木生火': '相生关系，有助于发展',
      '火生土': '相生关系，稳定发展',
      '土生金': '相生关系，财运亨通',
      '金生水': '相生关系，智慧增长',
      '水生木': '相生关系，生机勃勃',
      '木克土': '相克关系，需要调和',
      '土克水': '相克关系，阻碍发展',
      '水克火': '相克关系，冲突较多',
      '火克金': '相克关系，压力较大',
      '金克木': '相克关系，发展受限'
    };
    
    const tianRenRelation = this.getElementRelation(tian, ren);
    const renDiRelation = this.getElementRelation(ren, di);
    
    return {
      天人关系: {
        relation: tianRenRelation,
        description: interactions[tianRenRelation] || '关系平和'
      },
      人地关系: {
        relation: renDiRelation,
        description: interactions[renDiRelation] || '关系平和'
      },
      整体评价: this.evaluateOverallInteraction(tianRenRelation, renDiRelation)
    };
  }
  
  /**
   * 获取五行关系
   * @param {string} element1 - 五行1
   * @param {string} element2 - 五行2
   * @returns {string} 五行关系
   */
  getElementRelation(element1, element2) {
    const relations = {
      '木火': '木生火', '火土': '火生土', '土金': '土生金', '金水': '金生水', '水木': '水生木',
      '木土': '木克土', '土水': '土克水', '水火': '水克火', '火金': '火克金', '金木': '金克木'
    };
    
    const key = element1 + element2;
    return relations[key] || '同类';
  }
  
  /**
   * 评估整体五行相互作用
   * @param {string} tianRenRelation - 天人关系
   * @param {string} renDiRelation - 人地关系
   * @returns {string} 整体评价
   */
  evaluateOverallInteraction(tianRenRelation, renDiRelation) {
    const positiveRelations = ['木生火', '火生土', '土生金', '金生水', '水生木'];
    
    const tianRenPositive = positiveRelations.includes(tianRenRelation);
    const renDiPositive = positiveRelations.includes(renDiRelation);
    
    if (tianRenPositive && renDiPositive) {
      return '三才配置优良，各方面发展顺利';
    } else if (tianRenPositive || renDiPositive) {
      return '三才配置尚可，部分方面发展较好';
    } else {
      return '三才配置一般，需要后天努力调和';
    }
  }
  
  /**
   * 分析各方面运势
   * @param {object} fiveGrids - 五格信息
   * @param {array} includeAspects - 包含的方面
   * @returns {object} 各方面运势分析
   */
  analyzeFortuneAspects(fiveGrids, includeAspects) {
    const aspects = {};
    
    for (const [aspectName, aspectData] of Object.entries(this.fortuneAspects)) {
      if (includeAspects.includes('all') || includeAspects.includes(aspectName)) {
        aspects[aspectName] = this.analyzeSpecificAspect(aspectName, fiveGrids, aspectData);
      }
    }
    
    return aspects;
  }
  
  /**
   * 分析特定方面运势
   * @param {string} aspectName - 方面名称
   * @param {object} fiveGrids - 五格信息
   * @param {object} aspectData - 方面数据
   * @returns {object} 特定方面分析结果
   */
  analyzeSpecificAspect(aspectName, fiveGrids, aspectData) {
    // 根据不同方面使用不同的格局进行分析
    let primaryGrid, secondaryGrid;
    
    switch (aspectName) {
      case '事业运':
        primaryGrid = fiveGrids.人格;
        secondaryGrid = fiveGrids.外格;
        break;
      case '财运':
        primaryGrid = fiveGrids.总格;
        secondaryGrid = fiveGrids.人格;
        break;
      case '感情运':
        primaryGrid = fiveGrids.外格;
        secondaryGrid = fiveGrids.地格;
        break;
      case '健康运':
        primaryGrid = fiveGrids.地格;
        secondaryGrid = fiveGrids.天格;
        break;
      case '学业运':
        primaryGrid = fiveGrids.地格;
        secondaryGrid = fiveGrids.人格;
        break;
      case '家庭运':
        primaryGrid = fiveGrids.天格;
        secondaryGrid = fiveGrids.地格;
        break;
      default:
        primaryGrid = fiveGrids.人格;
        secondaryGrid = fiveGrids.总格;
    }
    
    const primaryNumerology = this.numerologyTable[primaryGrid.value] || { fortune: 'neutral' };
    const secondaryNumerology = this.numerologyTable[secondaryGrid.value] || { fortune: 'neutral' };
    
    // 计算综合分数
    const primaryScore = this.fortuneLevels[primaryNumerology.fortune].score;
    const secondaryScore = this.fortuneLevels[secondaryNumerology.fortune].score;
    const combinedScore = Math.round(primaryScore * 0.7 + secondaryScore * 0.3);
    
    // 确定运势等级
    let fortuneLevel = 'neutral';
    if (combinedScore >= 85) fortuneLevel = 'great';
    else if (combinedScore >= 70) fortuneLevel = 'good';
    else if (combinedScore >= 50) fortuneLevel = 'neutral';
    else if (combinedScore >= 35) fortuneLevel = 'bad';
    else fortuneLevel = 'terrible';
    
    return {
      score: combinedScore,
      level: fortuneLevel,
      description: this.fortuneLevels[fortuneLevel].description,
      analysis: this.generateAspectAnalysis(aspectName, primaryGrid, secondaryGrid),
      suggestions: this.generateAspectSuggestions(aspectName, fortuneLevel),
      primaryInfluence: {
        grid: this.getGridName(primaryGrid, fiveGrids),
        value: primaryGrid.value,
        fortune: primaryNumerology.fortune
      },
      secondaryInfluence: {
        grid: this.getGridName(secondaryGrid, fiveGrids),
        value: secondaryGrid.value,
        fortune: secondaryNumerology.fortune
      }
    };
  }
  
  /**
   * 获取格局名称
   * @param {object} targetGrid - 目标格局
   * @param {object} fiveGrids - 五格信息
   * @returns {string} 格局名称
   */
  getGridName(targetGrid, fiveGrids) {
    for (const [name, grid] of Object.entries(fiveGrids)) {
      if (grid === targetGrid) {
        return name;
      }
    }
    return '未知格局';
  }
  
  /**
   * 生成方面分析
   * @param {string} aspectName - 方面名称
   * @param {object} primaryGrid - 主要格局
   * @param {object} secondaryGrid - 次要格局
   * @returns {string} 分析文本
   */
  generateAspectAnalysis(aspectName, primaryGrid, secondaryGrid) {
    const templates = {
      '事业运': `${aspectName}主要受人格影响，数理${primaryGrid.value}，${this.numerologyTable[primaryGrid.value]?.meaning || '运势平常'}。外格${secondaryGrid.value}影响人际关系和外在机遇。`,
      '财运': `${aspectName}主要看总格，数理${primaryGrid.value}，${this.numerologyTable[primaryGrid.value]?.meaning || '运势平常'}。人格${secondaryGrid.value}影响理财能力和财富观念。`,
      '感情运': `${aspectName}主要受外格影响，数理${primaryGrid.value}，${this.numerologyTable[primaryGrid.value]?.meaning || '运势平常'}。地格${secondaryGrid.value}影响感情基础和婚姻运势。`,
      '健康运': `${aspectName}主要看地格，数理${primaryGrid.value}，${this.numerologyTable[primaryGrid.value]?.meaning || '运势平常'}。天格${secondaryGrid.value}影响先天体质和健康基础。`,
      '学业运': `${aspectName}主要受地格影响，数理${primaryGrid.value}，${this.numerologyTable[primaryGrid.value]?.meaning || '运势平常'}。人格${secondaryGrid.value}影响学习能力和智慧发展。`,
      '家庭运': `${aspectName}主要看天格，数理${primaryGrid.value}，${this.numerologyTable[primaryGrid.value]?.meaning || '运势平常'}。地格${secondaryGrid.value}影响家庭和睦和亲情关系。`
    };
    
    return templates[aspectName] || `${aspectName}综合分析显示运势状况。`;
  }
  
  /**
   * 生成方面建议
   * @param {string} aspectName - 方面名称
   * @param {string} fortuneLevel - 运势等级
   * @returns {array} 建议数组
   */
  generateAspectSuggestions(aspectName, fortuneLevel) {
    const suggestions = {
      '事业运': {
        'great': ['把握机遇，积极进取', '发挥领导才能，创造佳绩'],
        'good': ['稳步发展，注重积累', '加强人际关系建设'],
        'neutral': ['脚踏实地，持续努力', '提升专业技能'],
        'bad': ['谨慎决策，避免冒险', '寻求贵人帮助'],
        'terrible': ['保守经营，等待时机', '考虑转换发展方向']
      },
      '财运': {
        'great': ['合理投资，财富增值', '把握商机，扩大收入'],
        'good': ['稳健理财，积少成多', '开源节流，增加储蓄'],
        'neutral': ['谨慎投资，避免损失', '培养理财意识'],
        'bad': ['控制支出，避免借贷', '寻找稳定收入来源'],
        'terrible': ['严格预算，量入为出', '避免高风险投资']
      },
      '感情运': {
        'great': ['珍惜缘分，用心经营', '主动表达，增进感情'],
        'good': ['真诚待人，建立信任', '注重沟通，化解矛盾'],
        'neutral': ['耐心等待，不急不躁', '提升自我，吸引良缘'],
        'bad': ['反思自我，改善性格', '避免冲突，保持和谐'],
        'terrible': ['专注自我提升', '暂时避免重大感情决定']
      },
      '健康运': {
        'great': ['保持良好习惯', '适度运动，增强体质'],
        'good': ['注意劳逸结合', '定期体检，预防疾病'],
        'neutral': ['规律作息，均衡饮食', '适当锻炼，增强免疫'],
        'bad': ['注意休息，避免过劳', '关注身体信号，及时就医'],
        'terrible': ['重视健康，积极治疗', '调整生活方式']
      },
      '学业运': {
        'great': ['把握学习机会', '发挥聪明才智，取得佳绩'],
        'good': ['勤奋学习，稳步提升', '培养良好学习习惯'],
        'neutral': ['坚持不懈，持续努力', '寻找适合的学习方法'],
        'bad': ['加倍努力，弥补不足', '寻求老师和同学帮助'],
        'terrible': ['调整学习策略', '考虑专业方向调整']
      },
      '家庭运': {
        'great': ['维护家庭和谐', '承担家庭责任'],
        'good': ['关爱家人，增进亲情', '营造温馨家庭氛围'],
        'neutral': ['多与家人沟通', '平衡工作与家庭'],
        'bad': ['化解家庭矛盾', '增进相互理解'],
        'terrible': ['反思家庭关系', '寻求专业帮助']
      }
    };
    
    return suggestions[aspectName]?.[fortuneLevel] || ['需要综合分析具体情况'];
  }
  
  /**
   * 分析年龄段运势
   * @param {object} fiveGrids - 五格信息
   * @returns {object} 年龄段分析结果
   */
  analyzeAgePhases(fiveGrids) {
    const phases = {};
    
    for (const [phaseName, phaseData] of Object.entries(this.ageFortunePhases)) {
      phases[phaseName] = this.analyzeAgePhase(phaseName, phaseData, fiveGrids);
    }
    
    return phases;
  }
  
  /**
   * 分析特定年龄段
   * @param {string} phaseName - 阶段名称
   * @param {object} phaseData - 阶段数据
   * @param {object} fiveGrids - 五格信息
   * @returns {object} 年龄段分析结果
   */
  analyzeAgePhase(phaseName, phaseData, fiveGrids) {
    let influenceGrid;
    
    switch (phaseData.influence) {
      case '地格':
        influenceGrid = fiveGrids.地格;
        break;
      case '人格+地格':
        // 简化处理，主要看人格
        influenceGrid = fiveGrids.人格;
        break;
      case '人格':
        influenceGrid = fiveGrids.人格;
        break;
      case '人格+外格':
        // 简化处理，主要看人格
        influenceGrid = fiveGrids.人格;
        break;
      case '总格':
        influenceGrid = fiveGrids.总格;
        break;
      default:
        influenceGrid = fiveGrids.人格;
    }
    
    const numerology = this.numerologyTable[influenceGrid.value] || { fortune: 'neutral' };
    const score = this.fortuneLevels[numerology.fortune].score;
    
    return {
      range: phaseData.range,
      description: phaseData.description,
      influenceGrid: phaseData.influence,
      score,
      fortune: numerology.fortune,
      analysis: `${phaseName}(${phaseData.range})主要受${phaseData.influence}影响，数理${influenceGrid.value}，${numerology.meaning || '运势平常'}`,
      characteristics: this.generatePhaseCharacteristics(phaseName, numerology.fortune)
    };
  }
  
  /**
   * 生成阶段特征
   * @param {string} phaseName - 阶段名称
   * @param {string} fortune - 运势等级
   * @returns {array} 特征数组
   */
  generatePhaseCharacteristics(phaseName, fortune) {
    const characteristics = {
      '幼年期': {
        'great': ['聪明伶俐', '健康成长', '家庭和睦'],
        'good': ['性格开朗', '学习能力强', '受人喜爱'],
        'neutral': ['平稳成长', '需要引导', '基础一般'],
        'bad': ['需要关注', '可能有挫折', '需要耐心培养'],
        'terrible': ['需要特别关爱', '可能面临困难', '需要专业指导']
      },
      '青年期': {
        'great': ['学业有成', '才华出众', '前途光明'],
        'good': ['努力上进', '逐步成长', '机会较多'],
        'neutral': ['需要努力', '发展平稳', '机会一般'],
        'bad': ['面临挑战', '需要坚持', '可能有挫折'],
        'terrible': ['困难较多', '需要调整方向', '寻求帮助']
      },
      '壮年期': {
        'great': ['事业有成', '家庭幸福', '社会地位高'],
        'good': ['稳步发展', '收获颇丰', '受人尊重'],
        'neutral': ['平稳发展', '需要努力', '机会适中'],
        'bad': ['压力较大', '需要调整', '可能有变动'],
        'terrible': ['面临困境', '需要重新规划', '寻求突破']
      },
      '中年期': {
        'great': ['事业巅峰', '财富积累', '影响力大'],
        'good': ['成就显著', '经验丰富', '地位稳固'],
        'neutral': ['稳中求进', '经验积累', '影响适中'],
        'bad': ['可能有危机', '需要谨慎', '调整策略'],
        'terrible': ['面临重大挑战', '需要重新定位', '寻求转机']
      },
      '晚年期': {
        'great': ['享受成果', '子孙满堂', '德高望重'],
        'good': ['生活安逸', '身体健康', '受人尊敬'],
        'neutral': ['平安度过', '生活平稳', '享受天伦'],
        'bad': ['可能有困扰', '需要关爱', '注意健康'],
        'terrible': ['需要照顾', '可能有疾病', '需要支持']
      }
    };
    
    return characteristics[phaseName]?.[fortune] || ['需要具体分析'];
  }
  
  /**
   * 计算综合运势分数
   * @param {object} numerologyAnalysis - 数理分析
   * @param {object} threeGeniusAnalysis - 三才分析
   * @param {object} aspectAnalysis - 各方面分析
   * @returns {object} 综合分数
   */
  calculateOverallScore(numerologyAnalysis, threeGeniusAnalysis, aspectAnalysis) {
    let totalScore = 0;
    let weightSum = 0;
    
    // 五格数理权重
    const gridWeights = {
      '天格': 0.1,
      '人格': 0.3,
      '地格': 0.2,
      '外格': 0.15,
      '总格': 0.25
    };
    
    // 计算五格加权分数
    for (const [gridName, analysis] of Object.entries(numerologyAnalysis)) {
      const weight = gridWeights[gridName] || 0;
      totalScore += analysis.score * weight;
      weightSum += weight;
    }
    
    // 三才配置分数
    totalScore += threeGeniusAnalysis.score * 0.2;
    weightSum += 0.2;
    
    // 各方面运势分数
    if (Object.keys(aspectAnalysis).length > 0) {
      let aspectTotalScore = 0;
      for (const [aspectName, analysis] of Object.entries(aspectAnalysis)) {
        const aspectWeight = this.fortuneAspects[aspectName]?.weight || 0.1;
        aspectTotalScore += analysis.score * aspectWeight;
      }
      totalScore += aspectTotalScore * 0.3;
      weightSum += 0.3;
    }
    
    const finalScore = Math.round(totalScore / weightSum);
    
    // 确定等级
    let level = 'neutral';
    if (finalScore >= 85) level = 'great';
    else if (finalScore >= 70) level = 'good';
    else if (finalScore >= 50) level = 'neutral';
    else if (finalScore >= 35) level = 'bad';
    else level = 'terrible';
    
    return {
      score: finalScore,
      level,
      description: this.fortuneLevels[level].description,
      breakdown: {
        五格数理: Math.round(totalScore * 0.5),
        三才配置: threeGeniusAnalysis.score,
        各方面运势: Object.keys(aspectAnalysis).length > 0 ? Math.round(Object.values(aspectAnalysis).reduce((sum, a) => sum + a.score, 0) / Object.keys(aspectAnalysis).length) : 0
      }
    };
  }
  
  /**
   * 生成运势预测
   * @param {object} fiveGrids - 五格信息
   * @param {object} aspectAnalysis - 各方面分析
   * @returns {object} 预测结果
   */
  generatePredictions(fiveGrids, aspectAnalysis) {
    const predictions = {
      短期预测: this.generateShortTermPrediction(fiveGrids, aspectAnalysis),
      中期预测: this.generateMediumTermPrediction(fiveGrids, aspectAnalysis),
      长期预测: this.generateLongTermPrediction(fiveGrids, aspectAnalysis),
      重要时期: this.identifyImportantPeriods(fiveGrids),
      注意事项: this.generateCautions(fiveGrids, aspectAnalysis)
    };
    
    return predictions;
  }
  
  /**
   * 生成短期预测（1年内）
   * @param {object} fiveGrids - 五格信息
   * @param {object} aspectAnalysis - 各方面分析
   * @returns {object} 短期预测
   */
  generateShortTermPrediction(fiveGrids, aspectAnalysis) {
    const renGeNumerology = this.numerologyTable[fiveGrids.人格.value] || { fortune: 'neutral' };
    const waiGeNumerology = this.numerologyTable[fiveGrids.外格.value] || { fortune: 'neutral' };
    
    return {
      整体运势: this.fortuneLevels[renGeNumerology.fortune].description,
      重点关注: this.getShortTermFocus(renGeNumerology.fortune, waiGeNumerology.fortune),
      机遇期: this.calculateOpportunityPeriods(fiveGrids.人格.value),
      建议行动: this.generateShortTermActions(aspectAnalysis)
    };
  }
  
  /**
   * 生成中期预测（1-5年）
   * @param {object} fiveGrids - 五格信息
   * @param {object} aspectAnalysis - 各方面分析
   * @returns {object} 中期预测
   */
  generateMediumTermPrediction(fiveGrids, aspectAnalysis) {
    const zongGeNumerology = this.numerologyTable[fiveGrids.总格.value] || { fortune: 'neutral' };
    
    return {
      发展趋势: this.fortuneLevels[zongGeNumerology.fortune].description,
      关键转折: this.identifyTurningPoints(fiveGrids),
      发展建议: this.generateMediumTermAdvice(aspectAnalysis),
      潜在挑战: this.identifyPotentialChallenges(fiveGrids)
    };
  }
  
  /**
   * 生成长期预测（5年以上）
   * @param {object} fiveGrids - 五格信息
   * @param {object} aspectAnalysis - 各方面分析
   * @returns {object} 长期预测
   */
  generateLongTermPrediction(fiveGrids, aspectAnalysis) {
    const zongGeNumerology = this.numerologyTable[fiveGrids.总格.value] || { fortune: 'neutral' };
    
    return {
      人生走向: this.fortuneLevels[zongGeNumerology.fortune].description,
      成就领域: this.identifyAchievementAreas(aspectAnalysis),
      人生课题: this.identifyLifeLessons(fiveGrids),
      晚年运势: this.analyzeLateLifeFortune(fiveGrids.总格)
    };
  }
  
  /**
   * 识别重要时期
   * @param {object} fiveGrids - 五格信息
   * @returns {array} 重要时期列表
   */
  identifyImportantPeriods(fiveGrids) {
    const periods = [];
    
    // 基于数理特征识别重要年份
    const renGeValue = fiveGrids.人格.value;
    const zongGeValue = fiveGrids.总格.value;
    
    // 简化的重要时期计算
    const importantAges = [
      renGeValue % 60 + 18, // 人格相关的重要年龄
      zongGeValue % 60 + 25, // 总格相关的重要年龄
      (renGeValue + zongGeValue) % 60 + 35 // 综合重要年龄
    ];
    
    importantAges.forEach(age => {
      if (age > 0 && age < 100) {
        periods.push({
          年龄: `${age}岁`,
          类型: this.getImportantPeriodType(age),
          描述: this.getImportantPeriodDescription(age),
          建议: this.getImportantPeriodAdvice(age)
        });
      }
    });
    
    return periods.sort((a, b) => parseInt(a.年龄) - parseInt(b.年龄));
  }
  
  /**
   * 生成运势建议
   * @param {object} fiveGrids - 五格信息
   * @param {object} aspectAnalysis - 各方面分析
   * @returns {object} 建议结果
   */
  generateAdvice(fiveGrids, aspectAnalysis) {
    const advice = {
      总体建议: this.generateOverallAdvice(fiveGrids),
      改运方法: this.generateImprovementMethods(fiveGrids),
      注意事项: this.generatePrecautions(fiveGrids),
      开运建议: this.generateLuckyAdvice(fiveGrids),
      人生规划: this.generateLifePlanning(aspectAnalysis)
    };
    
    return advice;
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
          description: '完整姓名（2-4个汉字）',
          minLength: 2,
          maxLength: 4,
          pattern: '^[\u4e00-\u9fa5]{2,4}$'
        },
        analysisType: {
          type: 'string',
          description: '分析类型',
          enum: ['basic', 'detailed', 'comprehensive'],
          default: 'comprehensive'
        },
        includeAspects: {
          type: 'array',
          description: '包含的运势方面',
          items: {
            type: 'string',
            enum: ['all', '事业运', '财运', '感情运', '健康运', '学业运', '家庭运']
          },
          default: ['all']
        },
        includePredictions: {
          type: 'boolean',
          description: '是否包含运势预测',
          default: true
        },
        includeAdvice: {
          type: 'boolean',
          description: '是否包含改运建议',
          default: true
        }
      },
      required: ['fullName']
    };
  }
  
  /**
   * 获取使用示例
   * @returns {array} 使用示例数组
   */
  getUsageExamples() {
    return [
      {
        title: '基础运势分析',
        params: {
          fullName: '张雅琪',
          analysisType: 'basic'
        },
        description: '对姓名进行基础的五格数理和运势分析'
      },
      {
        title: '详细运势分析',
        params: {
          fullName: '李智慧',
          analysisType: 'detailed',
          includeAspects: ['事业运', '财运', '感情运']
        },
        description: '详细分析特定方面的运势情况'
      },
      {
        title: '综合运势分析',
        params: {
          fullName: '王德华',
          analysisType: 'comprehensive',
          includeAspects: ['all'],
          includePredictions: true,
          includeAdvice: true
        },
        description: '全面分析姓名运势，包含预测和建议'
      }
    ];
  }
  
  // 辅助方法
  getShortTermFocus(renGeFortune, waiGeFortune) {
    if (renGeFortune === 'great' && waiGeFortune === 'great') {
      return '把握机遇，积极进取，人际关系和事业发展都很有利';
    } else if (renGeFortune === 'great') {
      return '个人能力强，但需要注意人际关系的处理';
    } else if (waiGeFortune === 'great') {
      return '人际关系良好，可以借助外力发展';
    } else {
      return '需要稳步发展，避免急躁冒进';
    }
  }
  
  calculateOpportunityPeriods(renGeValue) {
    const months = [];
    for (let i = 1; i <= 12; i++) {
      if ((renGeValue + i) % 3 === 0) {
        months.push(`${i}月`);
      }
    }
    return months.length > 0 ? months : ['需要具体分析'];
  }
  
  generateShortTermActions(aspectAnalysis) {
    const actions = [];
    for (const [aspect, analysis] of Object.entries(aspectAnalysis)) {
      if (analysis.level === 'great' || analysis.level === 'good') {
        actions.push(`重点发展${aspect}`);
      }
    }
    return actions.length > 0 ? actions : ['保持现状，稳步发展'];
  }
  
  identifyTurningPoints(fiveGrids) {
    return [
      `${fiveGrids.人格.value}岁左右可能有重要转折`,
      `${fiveGrids.总格.value}岁左右运势可能发生变化`
    ];
  }
  
  generateMediumTermAdvice(aspectAnalysis) {
    const advice = [];
    for (const [aspect, analysis] of Object.entries(aspectAnalysis)) {
      if (analysis.level === 'bad' || analysis.level === 'terrible') {
        advice.push(`需要重点改善${aspect}`);
      }
    }
    return advice.length > 0 ? advice : ['继续保持良好发展态势'];
  }
  
  identifyPotentialChallenges(fiveGrids) {
    const challenges = [];
    for (const [gridName, gridData] of Object.entries(fiveGrids)) {
      const numerology = this.numerologyTable[gridData.value];
      if (numerology && (numerology.fortune === 'bad' || numerology.fortune === 'terrible')) {
        challenges.push(`${gridName}数理不佳，需要注意相关影响`);
      }
    }
    return challenges.length > 0 ? challenges : ['整体运势较好，挑战较少'];
  }
  
  identifyAchievementAreas(aspectAnalysis) {
    const areas = [];
    for (const [aspect, analysis] of Object.entries(aspectAnalysis)) {
      if (analysis.level === 'great') {
        areas.push(aspect);
      }
    }
    return areas.length > 0 ? areas : ['需要通过努力创造成就'];
  }
  
  identifyLifeLessons(fiveGrids) {
    const lessons = [];
    const renGeNumerology = this.numerologyTable[fiveGrids.人格.value];
    if (renGeNumerology) {
      lessons.push(`学会${renGeNumerology.meaning.includes('刚强') ? '柔和处事' : '坚持不懈'}`);
    }
    return lessons;
  }
  
  analyzeLateLifeFortune(zongGe) {
    const numerology = this.numerologyTable[zongGe.value];
    return numerology ? `晚年${this.fortuneLevels[numerology.fortune].description}，${numerology.meaning}` : '晚年运势需要综合分析';
  }
  
  getImportantPeriodType(age) {
    if (age < 25) return '成长期';
    if (age < 40) return '发展期';
    if (age < 60) return '成熟期';
    return '收获期';
  }
  
  getImportantPeriodDescription(age) {
    if (age < 25) return '性格形成和基础建立的重要时期';
    if (age < 40) return '事业发展和人生定向的关键时期';
    if (age < 60) return '成就巩固和影响力扩大的重要时期';
    return '享受成果和传承智慧的重要时期';
  }
  
  getImportantPeriodAdvice(age) {
    if (age < 25) return '注重学习和品格培养';
    if (age < 40) return '把握机遇，积极进取';
    if (age < 60) return '稳固成就，承担责任';
    return '享受生活，传承经验';
  }
  
  generateOverallAdvice(fiveGrids) {
    const advice = [];
    const renGeNumerology = this.numerologyTable[fiveGrids.人格.value];
    if (renGeNumerology) {
      if (renGeNumerology.fortune === 'great') {
        advice.push('姓名数理优良，应该充分发挥自身优势');
      } else if (renGeNumerology.fortune === 'bad') {
        advice.push('姓名数理有不足，建议通过后天努力改善');
      }
    }
    return advice;
  }
  
  generateImprovementMethods(fiveGrids) {
    return [
      '保持积极心态，相信自己的能力',
      '多行善事，积累福德',
      '选择有利的颜色和方位',
      '佩戴适合的吉祥物品',
      '在有利的时间做重要决定'
    ];
  }
  
  generatePrecautions(fiveGrids) {
    const precautions = [];
    for (const [gridName, gridData] of Object.entries(fiveGrids)) {
      const numerology = this.numerologyTable[gridData.value];
      if (numerology && numerology.fortune === 'bad') {
        precautions.push(`注意${gridName}的不利影响，谨慎相关决策`);
      }
    }
    return precautions.length > 0 ? precautions : ['整体运势较好，保持谨慎即可'];
  }
  
  generateLuckyAdvice(fiveGrids) {
    const element = fiveGrids.人格.element;
    const luckyAdvice = {
      '金': ['选择白色、金色物品', '朝西方发展有利', '秋季运势较好'],
      '木': ['选择绿色物品', '朝东方发展有利', '春季运势较好'],
      '水': ['选择黑色、蓝色物品', '朝北方发展有利', '冬季运势较好'],
      '火': ['选择红色物品', '朝南方发展有利', '夏季运势较好'],
      '土': ['选择黄色、棕色物品', '中央位置有利', '长夏运势较好']
    };
    return luckyAdvice[element] || ['根据个人情况选择适合的开运方法'];
  }
  
  generateLifePlanning(aspectAnalysis) {
    const planning = [];
    for (const [aspect, analysis] of Object.entries(aspectAnalysis)) {
      if (analysis.level === 'great') {
        planning.push(`重点发展${aspect}，这是你的优势领域`);
      } else if (analysis.level === 'bad') {
        planning.push(`需要改善${aspect}，制定相应的提升计划`);
      }
    }
    return planning.length > 0 ? planning : ['制定平衡发展的人生规划'];
   }
   
   /**
    * 生成注意事项
    * @param {object} fiveGrids - 五格信息
    * @param {object} aspectAnalysis - 各方面分析
    * @returns {array} 注意事项列表
    */
   generateCautions(fiveGrids, aspectAnalysis) {
     const cautions = [];
     
     // 基于五格数理的注意事项
     for (const [gridName, gridData] of Object.entries(fiveGrids)) {
       const numerology = this.numerologyTable[gridData.value];
       if (numerology && (numerology.fortune === 'bad' || numerology.fortune === 'terrible')) {
         cautions.push(`${gridName}数理${gridData.value}为${numerology.category}，需要特别注意相关影响`);
       }
     }
     
     // 基于各方面运势的注意事项
     for (const [aspect, analysis] of Object.entries(aspectAnalysis)) {
       if (analysis.level === 'bad' || analysis.level === 'terrible') {
         cautions.push(`${aspect}运势较弱，需要格外关注和改善`);
       }
     }
     
     // 通用注意事项
     if (cautions.length === 0) {
       cautions.push('整体运势较好，保持积极心态即可');
     } else {
       cautions.push('运势有起伏是正常现象，关键在于如何应对和改善');
       cautions.push('建议结合个人实际情况，理性看待运势分析结果');
     }
     
     return cautions;
   }
 }

module.exports = NameFortuneAnalyzer;