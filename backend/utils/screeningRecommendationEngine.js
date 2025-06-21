

const HealthcareProvider = require('../models/HealthcareProvider');
const ScreeningTest = require('../models/ScreeningTest');
const ProviderTestPackage = require('../models/ProviderTestPackage');

/**
 * Extract user profile from quiz answers
 */
function extractUserProfile(answers, quiz) {
  const profile = {
    age: null,
    ageGroup: null,
    gender: null,
    previousCancer: null,
    smoking: null,
    bmi: null,
    familyHistory: null,
    alcohol: null,
    exercise: null,
    diet: null
  };

  answers.forEach(answer => {
    const question = quiz.questions.find(q => q.id === answer.qid);
    const selectedOption = question?.options.find(opt => opt.id === answer.optionId);
    
    if (!question || !selectedOption) return;

    switch (answer.qid) {
      case 'q1': // Age
        profile.ageGroup = selectedOption.text;
        profile.age = getAgeFromGroup(selectedOption.text);
        break;
      case 'q2': // Previous cancer
        profile.previousCancer = selectedOption.text;
        break;
      case 'q3': // Smoking
        profile.smoking = selectedOption.text;
        break;
      case 'q4': // BMI
        profile.bmi = selectedOption.text;
        break;
      case 'q5': // Family history
        profile.familyHistory = selectedOption.text;
        break;
      case 'q6': // Alcohol
        profile.alcohol = selectedOption.text;
        break;
      case 'q7': // Exercise
        profile.exercise = selectedOption.text;
        break;
      case 'q8': // Diet
        profile.diet = selectedOption.text;
        break;
      case 'q10': // Gender
        profile.gender = selectedOption.text;
        break;
    }
  });

  return profile;
}

/**
 * Convert age group text to numeric age for calculations
 */
function getAgeFromGroup(ageGroup) {
  const ageMap = {
    'Under 25': 22,
    '25-34': 30,
    '35-44': 40,
    '45-54': 50,
    '55-64': 60,
    '65+': 70
  };
  return ageMap[ageGroup] || 30;
}

/**
 * Determine priority level based on risk factors
 */
function calculatePriority(riskScore, hasHighRiskFactors, isOverdue) {
  if (isOverdue || (riskScore >= 61 && hasHighRiskFactors)) {
    return 'High';
  } else if (riskScore >= 31 || hasHighRiskFactors) {
    return 'Medium';
  }
  return 'Low';
}

/**
 * Get provider packages for a specific test
 */
async function getProviderPackagesForTest(testCode, userProfile, priority) {
  try {
    // Find the test first
    const test = await ScreeningTest.findOne({ code: testCode, isActive: true });
    if (!test) return [];

    // Build query based on user needs
    let query = {
      testId: test._id,
      isActive: true
    };

    // Find packages and populate provider information
    let packages = await ProviderTestPackage.find(query)
      .populate('providerId', 'name code website contactInfo')
      .populate('testId', 'name code')
      .sort({ priority: -1 }); // Higher priority first

    // Filter packages based on user requirements
    if (priority === 'High') {
      // For high priority, prefer providers with specializations
      packages = packages.filter(pkg => 
        pkg.specializations.highRisk || 
        pkg.specializations.familyHistory ||
        pkg.specializations.fastTrack
      ).concat(packages.filter(pkg => 
        !pkg.specializations.highRisk && 
        !pkg.specializations.familyHistory &&
        !pkg.specializations.fastTrack
      ));
    }

    return packages.slice(0, 3); // Limit to top 3 providers per test
  } catch (error) {
    console.error('Error fetching provider packages:', error);
    return [];
  }
}

/**
 * Main recommendation engine (UPDATED to use database)
 */
async function generateScreeningRecommendations(userProfile, quizAttempt) {
  const recommendations = [];
  const { age, gender, familyHistory, smoking, previousCancer, bmi, alcohol, diet, exercise } = userProfile;
  const riskScore = quizAttempt.percentageScore;
  const riskLevel = quizAttempt.riskLevel;

  // COLONOSCOPY RULES
  if (shouldRecommendColonoscopy(userProfile, riskScore)) {
    const priority = calculateColonoscopyPriority(userProfile, riskScore);
    const reasons = getColonoscopyReasons(userProfile, riskScore);
    const packages = await getProviderPackagesForTest('COLONOSCOPY', userProfile, priority);
    
    recommendations.push({
      test: 'COLONOSCOPY',
      testName: 'Colonoscopy',
      priority,
      reasons,
      packages: packages.map(pkg => ({
        provider: {
          code: pkg.providerId.code,
          name: pkg.providerId.name,
          website: pkg.providerId.website,
          phone: pkg.providerId.contactInfo?.phone,
          email: pkg.providerId.contactInfo?.email
        },
        package: {
          name: pkg.packageName,
          url: pkg.packageUrl,
          price: pkg.price,
          waitTime: pkg.additionalInfo?.waitTime,
          onlineBooking: pkg.availability?.onlineBooking,
          locations: pkg.availability?.locations,
          includes: pkg.additionalInfo?.includes,
          requirements: pkg.additionalInfo?.requirements
        },
        suitability: {
          highRisk: pkg.specializations?.highRisk,
          familyHistory: pkg.specializations?.familyHistory,
          fastTrack: pkg.specializations?.fastTrack
        }
      }))
    });
  }

  // MAMMOGRAM RULES (Female only)
  if (gender === 'Female' && shouldRecommendMammogram(userProfile, riskScore)) {
    const priority = calculateMammogramPriority(userProfile, riskScore);
    const reasons = getMammogramReasons(userProfile, riskScore);
    const packages = await getProviderPackagesForTest('MAMMOGRAM', userProfile, priority);
    
    recommendations.push({
      test: 'MAMMOGRAM',
      testName: 'Mammogram',
      priority,
      reasons,
      packages: packages.map(pkg => ({
        provider: {
          code: pkg.providerId.code,
          name: pkg.providerId.name,
          website: pkg.providerId.website,
          phone: pkg.providerId.contactInfo?.phone,
          email: pkg.providerId.contactInfo?.email
        },
        package: {
          name: pkg.packageName,
          url: pkg.packageUrl,
          price: pkg.price,
          waitTime: pkg.additionalInfo?.waitTime,
          onlineBooking: pkg.availability?.onlineBooking,
          locations: pkg.availability?.locations,
          includes: pkg.additionalInfo?.includes,
          requirements: pkg.additionalInfo?.requirements
        },
        suitability: {
          highRisk: pkg.specializations?.highRisk,
          familyHistory: pkg.specializations?.familyHistory,
          fastTrack: pkg.specializations?.fastTrack
        }
      }))
    });
  }

  // PAP SMEAR / HPV TEST RULES (Female only)
  if (gender === 'Female' && age >= 25) {
    const cervicalTestCode = age >= 30 ? 'HPV_TEST' : 'PAP_SMEAR';
    const testName = age >= 30 ? 'HPV Test' : 'Pap Smear';
    const priority = riskScore >= 31 ? 'Medium' : 'Low';
    const packages = await getProviderPackagesForTest(cervicalTestCode, userProfile, priority);
    
    recommendations.push({
      test: cervicalTestCode,
      testName,
      priority,
      reasons: [`Women ${age >= 30 ? '30+' : '25-29'} should undergo regular cervical cancer screening`],
      packages: packages.map(pkg => ({
        provider: {
          code: pkg.providerId.code,
          name: pkg.providerId.name,
          website: pkg.providerId.website,
          phone: pkg.providerId.contactInfo?.phone,
          email: pkg.providerId.contactInfo?.email
        },
        package: {
          name: pkg.packageName,
          url: pkg.packageUrl,
          price: pkg.price,
          waitTime: pkg.additionalInfo?.waitTime,
          onlineBooking: pkg.availability?.onlineBooking,
          locations: pkg.availability?.locations,
          includes: pkg.additionalInfo?.includes,
          requirements: pkg.additionalInfo?.requirements
        },
        suitability: {
          highRisk: pkg.specializations?.highRisk,
          familyHistory: pkg.specializations?.familyHistory,
          fastTrack: pkg.specializations?.fastTrack
        }
      }))
    });
  }

  // FIT TEST RULES
  if (shouldRecommendFIT(userProfile, riskScore)) {
    const priority = calculateFITPriority(userProfile, riskScore);
    const reasons = getFITReasons(userProfile, riskScore);
    const packages = await getProviderPackagesForTest('FIT_TEST', userProfile, priority);
    
    recommendations.push({
      test: 'FIT_TEST',
      testName: 'FIT Test (Stool Analysis)',
      priority,
      reasons,
      packages: packages.map(pkg => ({
        provider: {
          code: pkg.providerId.code,
          name: pkg.providerId.name,
          website: pkg.providerId.website,
          phone: pkg.providerId.contactInfo?.phone,
          email: pkg.providerId.contactInfo?.email
        },
        package: {
          name: pkg.packageName,
          url: pkg.packageUrl,
          price: pkg.price,
          waitTime: pkg.additionalInfo?.waitTime,
          onlineBooking: pkg.availability?.onlineBooking,
          locations: pkg.availability?.locations,
          includes: pkg.additionalInfo?.includes,
          requirements: pkg.additionalInfo?.requirements
        },
        suitability: {
          highRisk: pkg.specializations?.highRisk,
          familyHistory: pkg.specializations?.familyHistory,
          fastTrack: pkg.specializations?.fastTrack
        }
      }))
    });
  }

  // PSA TEST RULES (Male only)
  if (gender === 'Male' && shouldRecommendPSA(userProfile, riskScore)) {
    const priority = calculatePSAPriority(userProfile, riskScore);
    const reasons = getPSAReasons(userProfile, riskScore);
    const packages = await getProviderPackagesForTest('PSA', userProfile, priority);
    
    recommendations.push({
      test: 'PSA',
      testName: 'PSA Test',
      priority,
      reasons,
      packages: packages.map(pkg => ({
        provider: {
          code: pkg.providerId.code,
          name: pkg.providerId.name,
          website: pkg.providerId.website,
          phone: pkg.providerId.contactInfo?.phone,
          email: pkg.providerId.contactInfo?.email
        },
        package: {
          name: pkg.packageName,
          url: pkg.packageUrl,
          price: pkg.price,
          waitTime: pkg.additionalInfo?.waitTime,
          onlineBooking: pkg.availability?.onlineBooking,
          locations: pkg.availability?.locations,
          includes: pkg.additionalInfo?.includes,
          requirements: pkg.additionalInfo?.requirements
        },
        suitability: {
          highRisk: pkg.specializations?.highRisk,
          familyHistory: pkg.specializations?.familyHistory,
          fastTrack: pkg.specializations?.fastTrack
        }
      }))
    });
  }

  // LIVER SCREENING RULES
  if (shouldRecommendLiverScreening(userProfile, riskScore)) {
    const priority = calculateLiverScreeningPriority(userProfile, riskScore);
    
    // AFP Test
    const afpPackages = await getProviderPackagesForTest('AFP', userProfile, priority);
    if (afpPackages.length > 0) {
      recommendations.push({
        test: 'AFP',
        testName: 'Alpha-Fetoprotein (AFP)',
        priority,
        reasons: ['High alcohol consumption increases liver cancer risk'],
        packages: afpPackages.map(pkg => ({
          provider: {
            code: pkg.providerId.code,
            name: pkg.providerId.name,
            website: pkg.providerId.website,
            phone: pkg.providerId.contactInfo?.phone,
            email: pkg.providerId.contactInfo?.email
          },
          package: {
            name: pkg.packageName,
            url: pkg.packageUrl,
            price: pkg.price,
            waitTime: pkg.additionalInfo?.waitTime,
            onlineBooking: pkg.availability?.onlineBooking,
            locations: pkg.availability?.locations,
            includes: pkg.additionalInfo?.includes,
            requirements: pkg.additionalInfo?.requirements
          },
          suitability: {
            highRisk: pkg.specializations?.highRisk,
            familyHistory: pkg.specializations?.familyHistory,
            fastTrack: pkg.specializations?.fastTrack
          }
        }))
      });
    }
    
    // Liver Ultrasound
    const liverUSPackages = await getProviderPackagesForTest('LIVER_ULTRASOUND', userProfile, priority);
    if (liverUSPackages.length > 0) {
      recommendations.push({
        test: 'LIVER_ULTRASOUND',
        testName: 'Liver Ultrasound',
        priority,
        reasons: ['High alcohol consumption requires liver monitoring'],
        packages: liverUSPackages.map(pkg => ({
          provider: {
            code: pkg.providerId.code,
            name: pkg.providerId.name,
            website: pkg.providerId.website,
            phone: pkg.providerId.contactInfo?.phone,
            email: pkg.providerId.contactInfo?.email
          },
          package: {
            name: pkg.packageName,
            url: pkg.packageUrl,
            price: pkg.price,
            waitTime: pkg.additionalInfo?.waitTime,
            onlineBooking: pkg.availability?.onlineBooking,
            locations: pkg.availability?.locations,
            includes: pkg.additionalInfo?.includes,
            requirements: pkg.additionalInfo?.requirements
          },
          suitability: {
            highRisk: pkg.specializations?.highRisk,
            familyHistory: pkg.specializations?.familyHistory,
            fastTrack: pkg.specializations?.fastTrack
          }
        }))
      });
    }
  }

  // LUNG SCREENING RULES
  if (shouldRecommendLungScreening(userProfile, riskScore)) {
    const priority = 'High';
    const packages = await getProviderPackagesForTest('LOW_DOSE_CT', userProfile, priority);
    
    if (packages.length > 0) {
      recommendations.push({
        test: 'LOW_DOSE_CT',
        testName: 'Low-Dose CT Scan',
        priority,
        reasons: ['Heavy smoking history significantly increases lung cancer risk'],
        packages: packages.map(pkg => ({
          provider: {
            code: pkg.providerId.code,
            name: pkg.providerId.name,
            website: pkg.providerId.website,
            phone: pkg.providerId.contactInfo?.phone,
            email: pkg.providerId.contactInfo?.email
          },
          package: {
            name: pkg.packageName,
            url: pkg.packageUrl,
            price: pkg.price,
            waitTime: pkg.additionalInfo?.waitTime,
            onlineBooking: pkg.availability?.onlineBooking,
            locations: pkg.availability?.locations,
            includes: pkg.additionalInfo?.includes,
            requirements: pkg.additionalInfo?.requirements
          },
          suitability: {
            highRisk: pkg.specializations?.highRisk,
            familyHistory: pkg.specializations?.familyHistory,
            fastTrack: pkg.specializations?.fastTrack
          }
        }))
      });
    }
  }

  // BASIC HEALTH SCREENING for high-risk individuals
  if (riskScore >= 31) {
    const basicTests = ['BLOOD_PRESSURE', 'CHOLESTEROL', 'DIABETES_SCREENING'];
    const basicReasons = [
      'Regular monitoring for cardiovascular health',
      'Dietary factors may affect cholesterol levels', 
      'BMI and lifestyle factors increase diabetes risk'
    ];
    
    for (let i = 0; i < basicTests.length; i++) {
      const packages = await getProviderPackagesForTest(basicTests[i], userProfile, 'Medium');
      if (packages.length > 0) {
        recommendations.push({
          test: basicTests[i],
          testName: packages[0].testId.name,
          priority: 'Medium',
          reasons: [basicReasons[i]],
          packages: packages.map(pkg => ({
            provider: {
              code: pkg.providerId.code,
              name: pkg.providerId.name,
              website: pkg.providerId.website,
              phone: pkg.providerId.contactInfo?.phone,
              email: pkg.providerId.contactInfo?.email
            },
            package: {
              name: pkg.packageName,
              url: pkg.packageUrl,
              price: pkg.price,
              waitTime: pkg.additionalInfo?.waitTime,
              onlineBooking: pkg.availability?.onlineBooking,
              locations: pkg.availability?.locations,
              includes: pkg.additionalInfo?.includes,
              requirements: pkg.additionalInfo?.requirements
            },
            suitability: {
              highRisk: pkg.specializations?.highRisk,
              familyHistory: pkg.specializations?.familyHistory,
              fastTrack: pkg.specializations?.fastTrack
            }
          }))
        });
      }
    }
  }

  return recommendations.sort((a, b) => {
    const priorityOrder = { 'High': 3, 'Medium': 2, 'Low': 1 };
    return priorityOrder[b.priority] - priorityOrder[a.priority];
  });
}

// All the existing decision rule functions remain the same
function shouldRecommendColonoscopy(profile, riskScore) {
  const { age, familyHistory, previousCancer, diet } = profile;
  
  if (familyHistory && familyHistory.includes('colorectal')) return true;
  if (age >= 45 && riskScore >= 61) return true;
  if (age >= 50) return true;
  if (previousCancer && !previousCancer.includes('No')) return true;
  
  return false;
}

function calculateColonoscopyPriority(profile, riskScore) {
  const { familyHistory, age, previousCancer } = profile;
  
  if (familyHistory?.includes('colorectal') || 
      (previousCancer && !previousCancer.includes('No')) ||
      (age >= 45 && riskScore >= 61)) {
    return 'High';
  }
  if (age >= 50 || riskScore >= 31) return 'Medium';
  return 'Low';
}

function getColonoscopyReasons(profile, riskScore) {
  const reasons = [];
  const { familyHistory, age, previousCancer, diet } = profile;
  
  if (familyHistory?.includes('colorectal')) {
    reasons.push('Family history of colorectal cancer');
  }
  if (age >= 45 && riskScore >= 61) {
    reasons.push('Age 45+ with high risk factors');
  }
  if (age >= 50) {
    reasons.push('Standard screening age (50+)');
  }
  if (previousCancer && !previousCancer.includes('No')) {
    reasons.push('Previous cancer history');
  }
  
  return reasons;
}

function shouldRecommendMammogram(profile, riskScore) {
  const { age, familyHistory, previousCancer } = profile;
  
  if (age >= 50) return true;
  if (age >= 40 && riskScore >= 61) return true;
  if (familyHistory?.includes('breast')) return true;
  if (previousCancer && previousCancer.includes('breast')) return true;
  
  return false;
}

function calculateMammogramPriority(profile, riskScore) {
  const { familyHistory, age, previousCancer } = profile;
  
  if (familyHistory?.includes('breast') || 
      (previousCancer && previousCancer.includes('breast')) ||
      (age >= 40 && riskScore >= 61)) {
    return 'High';
  }
  if (age >= 50) return 'Medium';
  return 'Low';
}

function getMammogramReasons(profile, riskScore) {
  const reasons = [];
  const { familyHistory, age, previousCancer } = profile;
  
  if (familyHistory?.includes('breast')) {
    reasons.push('Family history of breast cancer');
  }
  if (age >= 40 && riskScore >= 61) {
    reasons.push('Age 40+ with high risk factors');
  }
  if (age >= 50) {
    reasons.push('Standard screening age (50+)');
  }
  if (previousCancer && previousCancer.includes('breast')) {
    reasons.push('Previous breast cancer history');
  }
  
  return reasons;
}

function shouldRecommendFIT(profile, riskScore) {
  const { age, diet, alcohol, familyHistory } = profile;
  
  if (age >= 50) return true;
  if (familyHistory?.includes('colorectal')) return true;
  if (diet && (diet.includes('processed') || diet.includes('red meat'))) return true;
  if (alcohol && !alcohol.includes('Never')) return true;
  
  return false;
}

function calculateFITPriority(profile, riskScore) {
  const { familyHistory, age } = profile;
  
  if (familyHistory?.includes('colorectal') || (age >= 50 && riskScore >= 61)) {
    return 'High';
  }
  if (age >= 50 || riskScore >= 31) return 'Medium';
  return 'Low';
}

function getFITReasons(profile, riskScore) {
  const reasons = [];
  const { age, diet, alcohol, familyHistory } = profile;
  
  if (age >= 50) reasons.push('Standard colorectal screening age');
  if (familyHistory?.includes('colorectal')) reasons.push('Family history of colorectal cancer');
  if (diet && (diet.includes('processed') || diet.includes('red meat'))) {
    reasons.push('High dietary risk factors');
  }
  if (alcohol && !alcohol.includes('Never')) {
    reasons.push('Alcohol consumption increases risk');
  }
  
  return reasons;
}

function shouldRecommendPSA(profile, riskScore) {
  const { age, familyHistory } = profile;
  
  if (age >= 50 && age <= 70) return true;
  if (familyHistory?.includes('prostate')) return true;
  
  return false;
}

function calculatePSAPriority(profile, riskScore) {
  const { familyHistory, age } = profile;
  
  if (familyHistory?.includes('prostate')) return 'High';
  if (age >= 50 && riskScore >= 61) return 'Medium';
  return 'Low';
}

function getPSAReasons(profile, riskScore) {
  const reasons = [];
  const { familyHistory, age } = profile;
  
  if (age >= 50) reasons.push('Men 50-70 should discuss PSA screening');
  if (familyHistory?.includes('prostate')) reasons.push('Family history of prostate cancer');
  
  return reasons;
}

function shouldRecommendLiverScreening(profile, riskScore) {
  const { alcohol } = profile;
  
  if (alcohol && (alcohol.includes('5+') || alcohol.includes('3-4'))) return true;
  
  return false;
}

function calculateLiverScreeningPriority(profile, riskScore) {
  const { alcohol } = profile;
  
  if (alcohol?.includes('5+')) return 'High';
  if (alcohol?.includes('3-4')) return 'Medium';
  return 'Low';
}

function shouldRecommendLungScreening(profile, riskScore) {
  const { age, smoking } = profile;
  
  if (age >= 55 && age <= 74 && 
      smoking && (smoking.includes('Daily (11-20/day)') || smoking.includes('Daily (21+/day)'))) {
    return true;
  }
  
  return false;
}

module.exports = {
  generateScreeningRecommendations,
  extractUserProfile,
  getProviderPackagesForTest
};