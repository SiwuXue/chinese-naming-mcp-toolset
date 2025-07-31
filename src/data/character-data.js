/**
 * 汉字数据类 - CharacterData
 * 提供汉字相关的数据和辅助函数
 *
 * @author 鲁班 (PromptX工具开发大师)
 * @version 1.0.0
 *
 * cSpell:words wuxing Wuxing
 */

class CharacterData {
  constructor() {
    this.initialized = false;
    this.characterData = {};
    this.surnameData = {};
    this.templates = {};
  }

  /**
   * 初始化字符数据
   * @returns {Promise<void>}
   */
  async initialize() {
    if (this.initialized) {
      return;
    }

    try {
      // 加载所有字符数据
      this.characterData = {
        ...this.getVirtueCharacters(),
        ...this.getQualityCharacters(),
        ...this.getNatureCharacters(),
        ...this.getModernCharacters()
      };

      this.surnameData = this.getSurnameOrigins();
      this.templates = this.getCombinationTemplates();
      this.initialized = true;
    } catch (error) {
      console.error('CharacterData initialization failed:', error);
      throw error;
    }
  }

  /**
   * 检查是否已初始化
   * @returns {boolean}
   */
  isInitialized() {
    return this.initialized;
  }

  /**
   * 获取字符数据
   * @param {string} character - 汉字
   * @returns {Object|null}
   */
  getCharacterData(character) {
    return this.characterData[character] || null;
  }

  /**
   * 获取所有字符数据
   * @returns {Object}
   */
  getAllCharacterData() {
    return this.characterData;
  }

  /**
   * 获取姓氏起源数据
   * @param {string} surname - 姓氏
   * @returns {Object|null}
   */
  getSurnameOrigin(surname) {
    return this.surnameData[surname] || null;
  }

  /**
   * 获取所有姓氏起源数据
   * @returns {Object}
   */
  getAllSurnameOrigins() {
    return this.surnameData;
  }

  /**
   * 获取组合模板
   * @returns {Object}
   */
  getCombinationTemplates() {
    return {
      virtue_wisdom: '品德与智慧并重，德才兼备',
      nature_beauty: '自然之美与内在气质相得益彰',
      strength_gentleness: '刚柔并济，内外兼修',
      tradition_modern: '传统文化与现代气息完美融合',
      aspiration_reality: '理想抱负与现实品格相统一'
    };
  }

  /**
   * 德行品格类字符数据
   * @returns {Object} 德行品格类字符数据
   */
  getVirtueCharacters() {
    return {
      德: {
        primary: '品德、道德',
        secondary: '恩惠、善行',
        origin: '从彳从直从心，表示行为正直',
        cultural: '儒家核心概念，君子必备品质',
        symbolism: '高尚品格，道德修养',
        usage: '多用于男名，体现品德高尚'
      },
      仁: {
        primary: '仁爱、仁慈',
        secondary: '人与人之间的亲善关系',
        origin: '从人从二，表示人际关系',
        cultural: '孔子思想核心，仁者爱人',
        symbolism: '博爱精神，慈悲心怀',
        usage: '传统文化中的最高美德'
      },
      智: {
        primary: '智慧、聪明',
        secondary: '知识、见识',
        origin: '从知从日，表示明智',
        cultural: '智者千虑，必有一得',
        symbolism: '聪慧过人，深谋远虑',
        usage: '寓意聪明才智，学识渊博'
      }
    };
  }

  /**
   * 美德品质类字符数据
   * @returns {Object} 美德品质类字符数据
   */
  getQualityCharacters() {
    return {
      雅: {
        primary: '高雅、文雅',
        secondary: '正直、标准',
        origin: '从隹从牙，表示正确',
        cultural: '诗经雅颂，文学经典',
        symbolism: '优雅气质，文化修养',
        usage: '多用于女名，体现优雅气质'
      },
      慧: {
        primary: '智慧、聪慧',
        secondary: '心灵手巧',
        origin: '从心从彗，表示心明',
        cultural: '慧心巧思，智慧超群',
        symbolism: '聪明伶俐，心思敏捷',
        usage: '寓意智慧过人，心灵手巧'
      },
      琪: {
        primary: '美玉、珍宝',
        secondary: '花草茂盛的样子',
        origin: '从玉从其，表示美玉',
        cultural: '琪花瑶草，仙境美景',
        symbolism: '珍贵美好，品质高洁',
        usage: '多用于女名，寓意珍贵美丽'
      }
    };
  }

  /**
   * 自然景物类字符数据
   * @returns {Object} 自然景物类字符数据
   */
  getNatureCharacters() {
    return {
      山: {
        primary: '高山、山峰',
        secondary: '稳重、坚定',
        origin: '象形字，表示山的形状',
        cultural: '山高水长，稳如泰山',
        symbolism: '坚韧不拔，稳重可靠',
        usage: '寓意品格坚定，志向高远'
      },
      海: {
        primary: '大海、海洋',
        secondary: '宽广、包容',
        origin: '从水从每，表示大水',
        cultural: '海纳百川，有容乃大',
        symbolism: '胸怀宽广，包容万物',
        usage: '寓意心胸开阔，志向远大'
      },
      云: {
        primary: '云彩、云朵',
        secondary: '高远、飘逸',
        origin: '象形字，表示云的形状',
        cultural: '行云流水，自然洒脱',
        symbolism: '自由飘逸，超然物外',
        usage: '寓意性格洒脱，志向高远'
      }
    };
  }

  /**
   * 现代流行字符数据
   * @returns {Object} 现代流行字符数据
   */
  getModernCharacters() {
    return {
      轩: {
        primary: '高大的房屋',
        secondary: '气宇轩昂',
        origin: '从车从干，表示高车',
        cultural: '轩昂气宇，风度翩翩',
        symbolism: '气质高雅，风度不凡',
        usage: '现代流行用字，寓意气质出众'
      },
      浩: {
        primary: '水势浩大',
        secondary: '广大、众多',
        origin: '从水从告，表示大水',
        cultural: '浩然正气，气势磅礴',
        symbolism: '气势宏大，正气凛然',
        usage: '寓意气势磅礴，正气浩然'
      },
      涵: {
        primary: '包含、包容',
        secondary: '涵养、修养',
        origin: '从水从函，表示容纳',
        cultural: '涵养深厚，内蕴丰富',
        symbolism: '内涵丰富，修养深厚',
        usage: '寓意有涵养，内在丰富'
      }
    };
  }

  /**
   * 获取姓氏起源数据
   * @returns {Object} 姓氏起源数据
   */
  getSurnameOrigins() {
    return {
      张: {
        origin: '源于姬姓，黄帝后裔',
        meaning: '张弓射箭，武艺高强',
        distribution: '全国第三大姓',
        celebrities: ['张良', '张仲景', '张九龄']
      },
      王: {
        origin: '源于姬姓，周王室后裔',
        meaning: '王者风范，尊贵地位',
        distribution: '全国第二大姓',
        celebrities: ['王羲之', '王维', '王安石']
      },
      李: {
        origin: '源于嬴姓，皋陶后裔',
        meaning: '李树成荫，桃李满天下',
        distribution: '全国第一大姓',
        celebrities: ['李白', '李世民', '李时珍']
      },
      赵: {
        origin: '源于嬴姓，造父后裔',
        meaning: '赵国王室，显赫门第',
        distribution: '宋朝国姓',
        celebrities: ['赵匡胤', '赵孟頫', '赵云']
      },
      刘: {
        origin: '源于祁姓，尧帝后裔',
        meaning: '刘邦建汉，帝王之姓',
        distribution: '汉朝国姓',
        celebrities: ['刘邦', '刘备', '刘禹锡']
      }
    };
  }
}

module.exports = CharacterData;
