const mongoose = require('mongoose');
const Quiz = require('../models/Quiz');
require('dotenv').config();

const cancerIQQuiz = {
  _id: "knowledge_quiz-v1",
  title: "Test Your Knowledge About Cancer",
  version: 1,
  questions: [
    {
      id: "q1",
      text: "Which lifestyle factor contributes MOST to cancer risk?",
      options: [
        { id: "a", text: "Smoking", isCorrect: true, weight: 10 },
        { id: "b", text: "Poor diet", isCorrect: false, weight: 0 },
        { id: "c", text: "Lack of exercise", isCorrect: false, weight: 0 },
        { id: "d", text: "Stress", isCorrect: false, weight: 0 }
      ],
      explanation: "Tobacco accounts for roughly 30% of all cancer deaths. Smoking is the leading preventable cause of cancer worldwide."
    },
    {
      id: "q2",
      text: "What percentage of cancers can be prevented through lifestyle changes?",
      options: [
        { id: "a", text: "10-20%", isCorrect: false, weight: 0 },
        { id: "b", text: "30-50%", isCorrect: true, weight: 10 },
        { id: "c", text: "60-70%", isCorrect: false, weight: 0 },
        { id: "d", text: "80-90%", isCorrect: false, weight: 0 }
      ],
      explanation: "Research shows that 30-50% of cancers can be prevented through healthy lifestyle choices including diet, exercise, and avoiding tobacco."
    },
    {
      id: "q3",
      text: "Which food group is MOST protective against cancer?",
      options: [
        { id: "a", text: "Red meat", isCorrect: false, weight: 0 },
        { id: "b", text: "Processed foods", isCorrect: false, weight: 0 },
        { id: "c", text: "Fruits and vegetables", isCorrect: true, weight: 10 },
        { id: "d", text: "Dairy products", isCorrect: false, weight: 0 }
      ],
      explanation: "Fruits and vegetables contain antioxidants, vitamins, and phytochemicals that help protect cells from damage that can lead to cancer."
    },
    {
      id: "q4",
      text: "At what age should most people start regular cancer screening?",
      options: [
        { id: "a", text: "30", isCorrect: false, weight: 0 },
        { id: "b", text: "40", isCorrect: false, weight: 0 },
        { id: "c", text: "50", isCorrect: true, weight: 10 },
        { id: "d", text: "60", isCorrect: false, weight: 0 }
      ],
      explanation: "Most cancer screening guidelines recommend starting at age 50 for average-risk individuals, though some screenings like cervical cancer start earlier."
    },
    {
      id: "q5",
      text: "Which statement about sun exposure and cancer is TRUE?",
      options: [
        { id: "a", text: "Only fair-skinned people get skin cancer", isCorrect: false, weight: 0 },
        { id: "b", text: "Tanning beds are safer than sun exposure", isCorrect: false, weight: 0 },
        { id: "c", text: "UV rays can cause skin cancer even on cloudy days", isCorrect: true, weight: 10 },
        { id: "d", text: "Sunscreen is only needed at the beach", isCorrect: false, weight: 0 }
      ],
      explanation: "UV rays can penetrate clouds and cause skin damage leading to cancer. Daily sun protection is important year-round."
    },
    {
      id: "q6",
      text: "What is the most common cancer worldwide?",
      options: [
        { id: "a", text: "Lung cancer", isCorrect: true, weight: 10 },
        { id: "b", text: "Breast cancer", isCorrect: false, weight: 0 },
        { id: "c", text: "Colorectal cancer", isCorrect: false, weight: 0 },
        { id: "d", text: "Prostate cancer", isCorrect: false, weight: 0 }
      ],
      explanation: "Lung cancer is the most commonly diagnosed cancer globally, with smoking being the primary risk factor."
    }
  ]
};

const seedQuiz = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Delete existing quiz
    await Quiz.deleteMany({});
    console.log('Cleared existing quizzes');

    // Create new quiz
    const quiz = new Quiz(cancerIQQuiz);
    await quiz.save();
    console.log('Cancer IQ Quiz created successfully!');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding quiz:', error);
    process.exit(1);
  }
};

seedQuiz();