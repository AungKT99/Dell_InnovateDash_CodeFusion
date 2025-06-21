// backend/scripts/seedProviders.js
const mongoose = require('mongoose');
const HealthcareProvider = require('../models/HealthcareProvider');
const ScreeningTest = require('../models/ScreeningTest');
const ProviderTestPackage = require('../models/ProviderTestPackage');
require('dotenv').config();

const healthcareProviders = [
  {
    code: 'NCCS',
    name: 'National Cancer Centre Singapore',
    description: 'Leading cancer treatment and screening centre in Singapore',
    website: 'https://www.nccs.com.sg',
    contactInfo: {
      phone: '+65 6436 8000',
      email: 'enquiry@nccs.com.sg',
      address: '11 Hospital Crescent, Singapore 169610'
    }
  },
  {
    code: 'SCS',
    name: 'Singapore Cancer Society',
    description: 'Non-profit organization providing cancer screening and support services',
    website: 'https://www.singaporecancersociety.org.sg',
    contactInfo: {
      phone: '+65 6221 9578',
      email: 'info@singaporecancersociety.org.sg',
      address: '15 Enggor Street, #04-01, Realty Centre, Singapore 079716'
    }
  },
  {
    code: 'HEALTHHUB',
    name: 'HealthHub',
    description: 'Government health screening and wellness platform',
    website: 'https://www.healthhub.sg',
    contactInfo: {
      phone: '+65 1800 223 1313',
      email: 'info@healthhub.sg',
      address: 'Multiple locations across Singapore'
    }
  },
  {
    code: 'POLYCLINIC',
    name: 'Polyclinic',
    description: 'Primary healthcare clinics under SingHealth and NHG',
    website: 'https://www.singhealth.com.sg/polyclinics',
    contactInfo: {
      phone: '+65 6643 6969',
      email: 'feedback@polyclinic.sg',
      address: 'Multiple locations across Singapore'
    }
  },
  {
    code: 'GP',
    name: 'General Practitioner',
    description: 'Private family medicine clinics',
    website: 'https://www.healthhub.sg/directory',
    contactInfo: {
      phone: 'Varies by clinic',
      email: 'Varies by clinic',
      address: 'Island-wide locations'
    }
  }
];

const screeningTests = [
  {
    code: 'COLONOSCOPY',
    name: 'Colonoscopy',
    category: 'CANCER_SCREENING',
    description: 'A procedure to examine the inside of the colon and rectum using a flexible tube with a camera',
    preparation: 'Bowel preparation required 1-2 days before procedure. Follow specific dietary restrictions.',
    duration: '30-60 minutes',
    frequency: 'Every 10 years for average risk, more frequent for high risk patients'
  },
  {
    code: 'MAMMOGRAM',
    name: 'Mammogram',
    category: 'CANCER_SCREENING',
    description: 'X-ray examination of the breasts to detect early signs of breast cancer',
    preparation: 'Avoid deodorants, powders, and creams on test day. Schedule for week after menstrual period.',
    duration: '15-20 minutes',
    frequency: 'Every 2 years for women 50-69, annually for high risk women'
  },
  {
    code: 'PAP_SMEAR',
    name: 'Pap Smear',
    category: 'CANCER_SCREENING',
    description: 'Test to screen for cervical cancer by collecting cells from the cervix',
    preparation: 'Avoid sexual activity, douching, and vaginal medications 24 hours before test',
    duration: '5-10 minutes',
    frequency: 'Every 3 years for women aged 25-29'
  },
  {
    code: 'HPV_TEST',
    name: 'HPV Test',
    category: 'CANCER_SCREENING',
    description: 'Test for human papillomavirus, which can cause cervical cancer',
    preparation: 'Avoid sexual activity, douching, and vaginal medications 24 hours before test',
    duration: '5-10 minutes',
    frequency: 'Every 5 years for women aged 30 and above'
  },
  {
    code: 'FIT_TEST',
    name: 'FIT Test (Faecal Immunochemical Test)',
    category: 'CANCER_SCREENING',
    description: 'Stool test that detects hidden blood, which may indicate colorectal cancer',
    preparation: 'Follow dietary restrictions if specified. No medication restrictions needed.',
    duration: 'Home collection kit - 5 minutes',
    frequency: 'Annually for people aged 50 and above'
  },
  {
    code: 'PSA',
    name: 'PSA Test',
    category: 'CANCER_SCREENING',
    description: 'Blood test to measure prostate-specific antigen levels',
    preparation: 'Avoid sexual activity 48 hours before test. No special dietary restrictions.',
    duration: '5 minutes (blood draw)',
    frequency: 'Discuss with doctor - typically annually for men 50-70'
  },
  {
    code: 'AFP',
    name: 'Alpha-Fetoprotein (AFP)',
    category: 'CANCER_SCREENING',
    description: 'Blood test to screen for liver cancer in high-risk individuals',
    preparation: 'No special preparation required',
    duration: '5 minutes (blood draw)',
    frequency: 'Every 6 months for high-risk individuals (Hepatitis B carriers, cirrhosis)'
  },
  {
    code: 'LIVER_ULTRASOUND',
    name: 'Liver Ultrasound',
    category: 'CANCER_SCREENING',
    description: 'Imaging test to examine the liver for abnormalities',
    preparation: 'Fasting for 8-12 hours before the test',
    duration: '15-30 minutes',
    frequency: 'Every 6 months for high-risk individuals'
  },
  {
    code: 'LOW_DOSE_CT',
    name: 'Low-Dose CT Scan',
    category: 'CANCER_SCREENING',
    description: 'Specialized CT scan to screen for lung cancer in high-risk smokers',
    preparation: 'No special preparation required. Wear comfortable clothing without metal',
    duration: '10-15 minutes',
    frequency: 'Annually for heavy smokers aged 55-74'
  },
  {
    code: 'BLOOD_PRESSURE',
    name: 'Blood Pressure Check',
    category: 'GENERAL_HEALTH',
    description: 'Measurement of blood pressure to assess cardiovascular health',
    preparation: 'Avoid caffeine and exercise 30 minutes before test',
    duration: '5 minutes',
    frequency: 'At least once every 2 years, more frequently if elevated'
  },
  {
    code: 'CHOLESTEROL',
    name: 'Cholesterol Test',
    category: 'GENERAL_HEALTH',
    description: 'Blood test to measure cholesterol and triglyceride levels',
    preparation: 'Fasting for 9-12 hours before test',
    duration: '5 minutes (blood draw)',
    frequency: 'Every 5 years for adults, more frequently if abnormal'
  },
  {
    code: 'DIABETES_SCREENING',
    name: 'Diabetes Screening',
    category: 'GENERAL_HEALTH',
    description: 'Blood test to check glucose levels and diagnose diabetes',
    preparation: 'Fasting for 8-12 hours for fasting glucose test',
    duration: '5 minutes (blood draw)',
    frequency: 'Every 3 years for adults over 45, more frequently for high-risk individuals'
  }
];

const providerTestPackages = [
  // NCCS Packages
  {
    providerCode: 'NCCS',
    testCode: 'COLONOSCOPY',
    packageName: 'Comprehensive Colonoscopy Screening',
    packageUrl: 'https://www.nccs.com.sg/patient-care/screening-programmes/colorectal-cancer-screening',
    price: {
      amount: 800,
      currency: 'SGD',
      subsidized: {
        amount: 400,
        eligibility: 'Singapore Citizens and PRs with subsidies'
      }
    },
    availability: {
      locations: ['NCCS Main Campus', 'Novena Specialist Center'],
      onlineBooking: true,
      walkIn: false
    },
    specializations: {
      highRisk: true,
      familyHistory: true,
      fastTrack: true
    },
    priority: 5,
    additionalInfo: {
      waitTime: '2-3 weeks for routine, 1 week for urgent cases',
      requirements: ['Referral letter preferred but not mandatory', 'Bowel preparation kit provided'],
      includes: ['Pre-procedure consultation', 'Procedure', 'Pathology if needed', 'Follow-up consultation']
    }
  },
  {
    providerCode: 'NCCS',
    testCode: 'MAMMOGRAM',
    packageName: 'Digital Mammography Screening',
    packageUrl: 'https://www.nccs.com.sg/patient-care/screening-programmes/breast-cancer-screening',
    price: {
      amount: 200,
      currency: 'SGD',
      subsidized: {
        amount: 100,
        eligibility: 'Singapore Citizens and PRs'
      }
    },
    availability: {
      locations: ['NCCS Main Campus', 'NCCS Specialist Outpatient Clinics'],
      onlineBooking: true,
      walkIn: false
    },
    specializations: {
      highRisk: true,
      familyHistory: true,
      fastTrack: false
    },
    priority: 4,
    additionalInfo: {
      waitTime: '1-2 weeks',
      requirements: ['Appointment required'],
      includes: ['Digital mammography', 'Radiologist review', 'Results consultation']
    }
  },
  
  // Singapore Cancer Society Packages
  {
    providerCode: 'SCS',
    testCode: 'COLONOSCOPY',
    packageName: 'Community Colonoscopy Programme',
    packageUrl: 'https://www.singaporecancersociety.org.sg/programmes-services/screening-programmes.html',
    price: {
      amount: 600,
      currency: 'SGD',
      subsidized: {
        amount: 300,
        eligibility: 'Income-based subsidies available'
      }
    },
    availability: {
      locations: ['SCS Medical Centre', 'Partner Clinics'],
      onlineBooking: true,
      walkIn: false
    },
    specializations: {
      highRisk: true,
      familyHistory: true,
      fastTrack: false
    },
    priority: 3,
    additionalInfo: {
      waitTime: '3-4 weeks',
      requirements: ['Health screening questionnaire', 'Pre-procedure counseling'],
      includes: ['Pre-screening consultation', 'Procedure', 'Basic pathology', 'Post-procedure care']
    }
  },
  
  // HealthHub Packages
  {
    providerCode: 'HEALTHHUB',
    testCode: 'MAMMOGRAM',
    packageName: 'HealthHub Mammography Screening',
    packageUrl: 'https://www.healthhub.sg/programmes/61/breast_cancer_screening',
    price: {
      amount: 150,
      currency: 'SGD',
      subsidized: {
        amount: 75,
        eligibility: 'Pioneer Generation and Merdeka Generation'
      }
    },
    availability: {
      locations: ['Multiple HealthHub locations', 'Mobile screening units'],
      onlineBooking: true,
      walkIn: true
    },
    specializations: {
      highRisk: false,
      familyHistory: false,
      fastTrack: false
    },
    priority: 2,
    additionalInfo: {
      waitTime: '1-2 weeks',
      requirements: ['Online registration', 'Bring NRIC'],
      includes: ['Digital mammography', 'Results notification', 'Referral if needed']
    }
  },
  
  // Polyclinic Packages
  {
    providerCode: 'POLYCLINIC',
    testCode: 'PAP_SMEAR',
    packageName: 'Cervical Cancer Screening',
    packageUrl: 'https://www.polyclinic.sg/health-screening',
    price: {
      amount: 30,
      currency: 'SGD',
      subsidized: {
        amount: 15,
        eligibility: 'Citizens and PRs'
      }
    },
    availability: {
      locations: ['All Polyclinic branches'],
      onlineBooking: true,
      walkIn: true
    },
    specializations: {
      highRisk: false,
      familyHistory: false,
      fastTrack: false
    },
    priority: 1,
    additionalInfo: {
      waitTime: '1 week',
      requirements: ['Make appointment through HealthHub app or hotline'],
      includes: ['Pap smear test', 'Results notification', 'Follow-up if abnormal']
    }
  },
  {
    providerCode: 'POLYCLINIC',
    testCode: 'HPV_TEST',
    packageName: 'HPV Screening Test',
    packageUrl: 'https://www.polyclinic.sg/health-screening',
    price: {
      amount: 50,
      currency: 'SGD',
      subsidized: {
        amount: 25,
        eligibility: 'Citizens and PRs'
      }
    },
    availability: {
      locations: ['All Polyclinic branches'],
      onlineBooking: true,
      walkIn: true
    },
    specializations: {
      highRisk: false,
      familyHistory: false,
      fastTrack: false
    },
    priority: 1,
    additionalInfo: {
      waitTime: '1 week',
      requirements: ['Make appointment through HealthHub app or hotline'],
      includes: ['HPV test', 'Results notification', 'Follow-up consultation if positive']
    }
  },
  {
    providerCode: 'POLYCLINIC',
    testCode: 'FIT_TEST',
    packageName: 'FIT Colorectal Screening',
    packageUrl: 'https://www.polyclinic.sg/health-screening',
    price: {
      amount: 20,
      currency: 'SGD',
      subsidized: {
        amount: 10,
        eligibility: 'Citizens and PRs'
      }
    },
    availability: {
      locations: ['All Polyclinic branches'],
      onlineBooking: true,
      walkIn: true
    },
    specializations: {
      highRisk: false,
      familyHistory: false,
      fastTrack: false
    },
    priority: 1,
    additionalInfo: {
      waitTime: 'Same day collection',
      requirements: ['Bring NRIC'],
      includes: ['FIT kit and instructions', 'Lab analysis', 'Results notification']
    }
  },
  
  // GP Packages
  {
    providerCode: 'GP',
    testCode: 'PSA',
    packageName: 'Prostate Cancer Screening',
    packageUrl: 'https://www.healthhub.sg/directory',
    price: {
      amount: 80,
      currency: 'SGD',
      subsidized: {
        amount: null,
        eligibility: 'Varies by clinic'
      }
    },
    availability: {
      locations: ['Island-wide GP clinics'],
      onlineBooking: false,
      walkIn: true
    },
    specializations: {
      highRisk: false,
      familyHistory: false,
      fastTrack: false
    },
    priority: 1,
    additionalInfo: {
      waitTime: 'Usually same day',
      requirements: ['Bring NRIC', 'Some clinics may require appointment'],
      includes: ['PSA blood test', 'Results explanation', 'Referral if needed']
    }
  }
];

const seedProviders = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await HealthcareProvider.deleteMany({});
    await ScreeningTest.deleteMany({});
    await ProviderTestPackage.deleteMany({});
    console.log('Cleared existing provider/test/package data');

    // Insert providers
    await HealthcareProvider.insertMany(healthcareProviders);
    console.log('Inserted healthcare providers');

    // Insert tests
    await ScreeningTest.insertMany(screeningTests);
    console.log('Inserted screening tests');

    // Build maps for provider/test code to _id
    const allProviders = await HealthcareProvider.find({});
    const allTests = await ScreeningTest.find({});

    const providersMap = {};
    const testsMap = {};

    allProviders.forEach(p => providersMap[p.code] = p._id);
    allTests.forEach(t => testsMap[t.code] = t._id);

    // Resolve providerId and testId
    const resolvedPackages = providerTestPackages.map(pkg => ({
      ...pkg,
      providerId: providersMap[pkg.providerCode],
      testId: testsMap[pkg.testCode]
    }));

    // Insert packages
    await ProviderTestPackage.insertMany(resolvedPackages);
    console.log('Inserted provider test packages');

    console.log('\n🎉 SUCCESS! All data inserted correctly.');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error seeding data:', err);
    process.exit(1);
  }
};

seedProviders();