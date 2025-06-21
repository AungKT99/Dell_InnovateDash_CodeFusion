// backend/models/HealthcareProvider.js
const mongoose = require('mongoose');

const healthcareProviderSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true
  },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  website: {
    type: String,
    required: true
  },

  contactInfo: {
    phone: String,
    email: String,
    address: String
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('HealthcareProvider', healthcareProviderSchema);

// backend/models/ScreeningTest.js
const screeningTestSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true
  },
  name: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['CANCER_SCREENING', 'GENERAL_HEALTH', 'SPECIALIZED']
  },
  description: {
    type: String,
    required: true
  },
  preparation: {
    type: String // What patient needs to do before test
  },
  duration: {
    type: String // How long the test takes
  },
  frequency: {
    type: String // How often it should be done
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('ScreeningTest', screeningTestSchema);

// backend/models/ProviderTestPackage.js
const providerTestPackageSchema = new mongoose.Schema({
  providerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'HealthcareProvider',
    required: true
  },
  testId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ScreeningTest',
    required: true
  },
  packageName: {
    type: String,
    required: true
  },
  packageUrl: {
    type: String,
    required: true // Direct link to book/info page
  },
  price: {
    amount: Number,
    currency: {
      type: String,
      default: 'SGD'
    },
    subsidized: {
      amount: Number,
      eligibility: String // e.g., "Citizens and PRs"
    }
  },
  availability: {
    locations: [String], // Multiple clinic locations
    onlineBooking: {
      type: Boolean,
      default: false
    },
    walkIn: {
      type: Boolean,
      default: true
    }
  },
  specializations: {
    highRisk: {
      type: Boolean,
      default: false
    },
    familyHistory: {
      type: Boolean,
      default: false
    },
    fastTrack: {
      type: Boolean,
      default: false
    }
  },
  priority: {
    type: Number,
    default: 1 // Higher number = higher priority for this provider-test combo
  },
  isActive: {
    type: Boolean,
    default: true
  },
  additionalInfo: {
    waitTime: String, // "Usually 1-2 weeks"
    requirements: [String], // ["Referral letter required", "Fasting 8-12 hours"]
    includes: [String] // ["Consultation", "Results explanation", "Follow-up call"]
  }
}, {
  timestamps: true
});

// Compound index for efficient queries
providerTestPackageSchema.index({ providerId: 1, testId: 1 });
providerTestPackageSchema.index({ testId: 1, priority: -1 });

module.exports = mongoose.model('ProviderTestPackage', providerTestPackageSchema);