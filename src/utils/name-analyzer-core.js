/**
 * 姓名分析器核心功能模块
 * 提供姓名分析的核心功能
 *
 * @author 鲁班 (PromptX工具开发大师)
 * @version 1.0.0
 */

/**
 * 分析姓氏
 * @param {string} surname - 姓氏
 * @param {object} surnameOrigins - 姓氏起源数据库
 * @returns {object} 姓氏分析结果
 */
function analyzeSurname(surname, surnameOrigins) {
  const surnameData = surnameOrigins[surname];

  if (surnameData) {
    return {
      surname,
      origin: surnameData.origin,
      meaning: surnameData.meaning,
      distribution: surnameData.distribution,
      celebrities: surnameData.celebrities,
      culturalWeight: 'high'
    };
  }

  return {
    surname,
    origin: '姓氏起源待考证',
    meaning: '具有深厚的历史文化底蕴',
    distribution: '分布广泛',
    celebrities: [],
    culturalWeight: 'medium'
  };
}

/**
 * 分析名字
 * @param {string} givenName - 名字
 * @param {function} charAnalyzer - 分析字符的函数
 * @param {function} meaningCombiner - 获取组合寓意的函数
 * @param {function} themeDetector - 获取主导主题的函数
 * @returns {object} 名字分析结果
 */
function analyzeGivenName(givenName, charAnalyzer, meaningCombiner, themeDetector) {
  const characters = givenName.split('');
  const characterAnalyses = characters.map(char => charAnalyzer(char));

  return {
    givenName,
    length: characters.length,
    characters: characterAnalyses,
    combinedMeaning: meaningCombiner(characterAnalyses),
    dominantThemes: themeDetector(characterAnalyses)
  };
}

/**
 * 分析单个字符
 * @param {string} char - 字符
 * @param {object} characterMeanings - 字符含义数据库
 * @returns {object} 字符分析结果
 */
function analyzeCharacter(char, characterMeanings) {
  const charData = characterMeanings[char];

  if (charData) {
    return {
      character: char,
      primaryMeaning: charData.primary,
      secondaryMeaning: charData.secondary,
      origin: charData.origin,
      cultural: charData.cultural,
      symbolism: charData.symbolism,
      usage: charData.usage,
      culturalWeight: 'high'
    };
  }

  // 对于数据库中没有的字符，提供基础分析
  return {
    character: char,
    primaryMeaning: '具有美好寓意',
    secondaryMeaning: '承载着父母的期望',
    origin: '汉字文化传承',
    cultural: '中华文化瑰宝',
    symbolism: '美好品质的象征',
    usage: '寓意深远',
    culturalWeight: 'medium'
  };
}

/**
 * 获取组合寓意
 * @param {array} characterAnalyses - 字符分析数组
 * @returns {string} 组合寓意
 */
function getCombinedMeaning(characterAnalyses) {
  if (characterAnalyses.length === 1) {
    return characterAnalyses[0].symbolism;
  }

  const themes = characterAnalyses.map(analysis => analysis.symbolism);
  return `${themes.join('，')}，寓意${generateCombinationDescription(themes)}`;
}

/**
 * 生成组合描述
 * @param {array} _themes - 主题数组（未使用）
 * @returns {string} 组合描述
 */
function generateCombinationDescription(_themes) {
  const descriptions = [
    '品格高尚，才华出众',
    '内外兼修，德才并重',
    '志向远大，品质优秀',
    '文雅大方，智慧过人',
    '气质非凡，前程似锦'
  ];

  return descriptions[Math.floor(Math.random() * descriptions.length)];
}

/**
 * 获取主导主题
 * @param {array} characterAnalyses - 字符分析数组
 * @returns {array} 主导主题数组
 */
function getDominantThemes(characterAnalyses) {
  const themes = [];

  for (const analysis of characterAnalyses) {
    if (analysis.cultural.includes('品德') || analysis.cultural.includes('德行')) {
      themes.push('品德修养');
    }
    if (analysis.cultural.includes('智慧') || analysis.cultural.includes('聪明')) {
      themes.push('智慧才华');
    }
    if (analysis.cultural.includes('美') || analysis.cultural.includes('雅')) {
      themes.push('美丽优雅');
    }
    if (analysis.cultural.includes('自然') || analysis.cultural.includes('山水')) {
      themes.push('自然和谐');
    }
  }

  return [...new Set(themes)];
}

/**
 * 生成整体寓意
 * @param {string} surname - 姓氏
 * @param {string} givenName - 名字
 * @param {string} depth - 分析深度
 * @returns {string} 整体寓意
 */
function generateOverallMeaning(surname, givenName, depth) {
  const fullName = surname + givenName;

  const templates = {
    basic: `${fullName}这个名字寓意深远，体现了深厚的文化底蕴和美好的期望。`,
    detailed: `${fullName}这个名字融合了传统文化的精髓，既体现了${surname}氏家族的历史传承，又通过${givenName}表达了对美好品格和光明前程的期许。`,
    comprehensive: `${fullName}这个名字是传统文化与现代理念的完美结合，不仅承载着${surname}氏家族的深厚底蕴，更通过${givenName}的精心选择，展现了对品德修养、智慧才华和人生理想的全面追求。`
  };

  return templates[depth] || templates.detailed;
}

/**
 * 获取文化意义
 * @param {string} _surname - 姓氏（未使用）
 * @param {string} _givenName - 名字（未使用）
 * @param {string} _depth - 分析深度（未使用）
 * @returns {object} 文化意义
 */
function getCulturalSignificance(_surname, _givenName, _depth) {
  return {
    traditionalValues: '体现了中华传统文化中对品德修养的重视',
    modernRelevance: '在现代社会中仍具有积极的指导意义',
    familyExpectations: '承载着家族对后代的美好期望和祝福',
    socialImplications: '反映了社会对优秀品格和才华的推崇'
  };
}

/**
 * 获取字符详细分解
 * @param {string} givenName - 名字
 * @param {function} charAnalyzer - 分析字符的函数
 * @param {function} getStrokeCount - 获取笔画数的函数
 * @param {function} getRadicals - 获取部首的函数
 * @param {function} getPronunciation - 获取发音的函数
 * @returns {array} 字符分解数组
 */
function getCharacterBreakdown(givenName, charAnalyzer, getStrokeCount, getRadicals, getPronunciation) {
  return givenName.split('').map(char => {
    const analysis = charAnalyzer(char);
    return {
      ...analysis,
      strokes: getStrokeCount(char),
      radicals: getRadicals(char),
      pronunciation: getPronunciation(char)
    };
  });
}

/**
 * 解析完整姓名
 * @param {string} fullName - 完整姓名
 * @returns {object} 姓氏和名字
 */
function parseFullName(fullName) {
  if (fullName.length < 1) {
    throw new Error('姓名不能为空');
  }

  // 处理复姓情况（简化版）
  const compoundSurnames = ['欧阳', '司马', '上官', '诸葛', '东方', '西门'];

  for (const compound of compoundSurnames) {
    if (fullName.startsWith(compound)) {
      const givenName = fullName.slice(compound.length);
      return {
        surname: compound,
        givenName: givenName || ''
      };
    }
  }

  // 单姓情况
  const surname = fullName.charAt(0);
  const givenName = fullName.slice(1);
  
  return {
    surname,
    givenName: givenName || ''
  };
}

module.exports = {
  analyzeSurname,
  analyzeGivenName,
  analyzeCharacter,
  getCombinedMeaning,
  generateCombinationDescription,
  getDominantThemes,
  generateOverallMeaning,
  getCulturalSignificance,
  getCharacterBreakdown,
  parseFullName
};
