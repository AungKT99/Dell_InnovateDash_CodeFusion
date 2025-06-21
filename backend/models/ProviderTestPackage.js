const mongoose = require('mongoose');

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


