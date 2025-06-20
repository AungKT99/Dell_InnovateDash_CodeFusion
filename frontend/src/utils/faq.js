// src/utils/faq.js

// src/utils/faq.js

export const FAQS = {
  // General
  "what is cancer": "Cancer is when some cells in the body start to grow uncontrollably. Early detection saves lives!",
  "what causes cancer": "Cancer can be caused by genetics, smoking, too much sun, certain chemicals, and sometimes it just happens without a clear reason.",
  "how to prevent cancer": "Healthy lifestyle, not smoking, eating well, exercising, and regular screening help prevent some cancers.",
  "what are the symptoms of cancer": "Common symptoms include unexplained weight loss, lumps, fatigue, changes in skin or bowel habits. Always consult a doctor if you notice anything unusual.",
  "how often should i get screened": "It depends on your age and risk. For example, breast cancer screening is recommended yearly for women 40-49, every 2 years for women 50+. Ask your doctor for advice.",

  // Major types
  "what is lung cancer": "Lung cancer starts in the lungs, often caused by smoking, but non-smokers can get it too. Common symptoms include cough, chest pain, and breathlessness.",
  "how to prevent lung cancer": "The best way to prevent lung cancer is not to smoke, and avoid secondhand smoke and exposure to toxic substances.",
  "what are the symptoms of lung cancer": "Symptoms include a persistent cough, coughing up blood, chest pain, hoarseness, and shortness of breath. See a doctor if you notice these.",

  "what is liver cancer": "Liver cancer begins in the liver. Risk factors include hepatitis B/C infection, excessive alcohol, and obesity.",
  "how to prevent liver cancer": "Get vaccinated for hepatitis B, avoid excessive alcohol, maintain a healthy weight, and practice safe sex.",
  "what are the symptoms of liver cancer": "Symptoms may include loss of appetite, weight loss, yellowing skin (jaundice), and upper abdominal pain.",

  "what is colorectal cancer": "Colorectal cancer affects the colon or rectum. Regular screening like the FIT kit or colonoscopy helps detect it early.",
  "how to prevent colorectal cancer": "Eat a high-fibre diet, exercise, limit red/processed meats, and get screened as advised.",
  "what are the symptoms of colorectal cancer": "Symptoms include blood in stool, changes in bowel habits, abdominal pain, and unexplained weight loss.",

  "what is breast cancer": "Breast cancer starts in the breast. It’s the most common cancer among women in Singapore.",
  "how to prevent breast cancer": "Maintain a healthy lifestyle, limit alcohol, exercise, and go for regular mammograms.",
  "what are the symptoms of breast cancer": "Look out for lumps, nipple changes, skin dimpling, or unusual discharge. Consult your doctor if you notice anything.",

  "what is cervical cancer": "Cervical cancer starts in the cervix. HPV infection is a major cause.",
  "how to prevent cervical cancer": "Get HPV vaccination, attend regular Pap smear screening, and practice safe sex.",
  "what are the symptoms of cervical cancer": "Symptoms may include unusual vaginal bleeding, pelvic pain, or pain during sex. Early stages often have no symptoms.",

  "what is prostate cancer": "Prostate cancer begins in the prostate gland, usually in older men.",
  "how to prevent prostate cancer": "There’s no guaranteed way, but a healthy lifestyle helps. Talk to your doctor about screening if you are over 50.",
  "what are the symptoms of prostate cancer": "Early prostate cancer usually has no symptoms. Later, it may cause trouble urinating or blood in urine.",

  // Other Q&A (previous entries retained)
  "is cancer contagious": "No, cancer cannot be spread from person to person. It is not contagious.",
  "does cancer always cause pain": "Not always. Some cancers cause no pain, especially in early stages. That's why screening is important.",
  "can men get breast cancer": "Yes, men can get breast cancer, though it is much less common than in women.",
  "what is a mammogram": "A mammogram is a special X-ray to screen for breast cancer. It helps detect cancer early before symptoms show.",
  "what is the fit kit": "The FIT Kit is a home test that checks for hidden blood in your stool. It's used to screen for colorectal cancer.",
  "what should i do if my fit kit is positive": "If your FIT Kit result is positive, follow up with your doctor. Further tests like a colonoscopy may be needed.",
  "what is chemotherapy": "Chemotherapy is medicine used to kill or slow the growth of cancer cells. It can have side effects, but your care team will support you.",
  "can young people get cancer": "Yes, cancer can happen at any age, though it's more common as people get older.",
  "how do i lower my cancer risk": "Don't smoke, eat lots of fruits and vegetables, stay active, use sunscreen, and go for recommended screenings.",
  "are there support services for cancer patients": "Yes! The Singapore Cancer Society offers support groups, counselling, and financial assistance for those affected by cancer.",
  "does having a family history mean i will get cancer": "Family history can increase risk, but most cancers are not inherited. Regular screening and healthy living help reduce your risk.",
  "can cancer be cured": "Many cancers can be cured, especially if found early. Treatments are improving all the time.",
  "what is a tumour": "A tumour is a lump formed by abnormal cell growth. Not all tumours are cancerous—some are benign.",
  "what are polyps": "Polyps are small growths in areas like the colon. Some polyps can turn into cancer over time, so doctors often remove them.",
  "does diet affect cancer risk": "Yes, diets high in fruits, vegetables, and fibre, and low in processed meats and alcohol, may lower some cancer risks.",
  "is cancer treatment expensive": "Costs vary, but there are government subsidies and financial help available. Talk to your healthcare provider or SCS for advice.",
  "what is palliative care": "Palliative care helps improve quality of life for people with serious illness, managing symptoms and offering emotional support.",
  "can i work during cancer treatment": "Many people can work during treatment, but it depends on your health and treatment type. Discuss with your doctor and employer.",
  "how can i support a friend with cancer": "Offer a listening ear, practical help, and encouragement. Just being there makes a big difference.",

};

  
  // Smarter local FAQ answer finder
  export function localFAQAnswer(question) {
    if (!question) return null;
    const q = question.trim().toLowerCase();
  
    // 1. Exact match
    if (FAQS[q]) return FAQS[q];
  
    // // 2. Major specific cancers — direct phrase matching
    // if (q.includes("lung cancer")) {
    //   if (q.includes("prevent")) return FAQS["how to prevent lung cancer"];
    //   if (q.includes("symptom")) return FAQS["what are the symptoms of lung cancer"];
    //   return FAQS["what is lung cancer"];
    // }
    // if (q.includes("liver cancer")) {
    //   if (q.includes("prevent")) return FAQS["how to prevent liver cancer"];
    //   if (q.includes("symptom")) return FAQS["what are the symptoms of liver cancer"];
    //   return FAQS["what is liver cancer"];
    // }
    // if (q.includes("colorectal cancer")) {
    //   if (q.includes("prevent")) return FAQS["how to prevent colorectal cancer"];
    //   if (q.includes("symptom")) return FAQS["what are the symptoms of colorectal cancer"];
    //   return FAQS["what is colorectal cancer"];
    // }
    // if (q.includes("breast cancer")) {
    //   if (q.includes("prevent")) return FAQS["how to prevent breast cancer"];
    //   if (q.includes("symptom")) return FAQS["what are the symptoms of breast cancer"];
    //   return FAQS["what is breast cancer"];
    // }
    // if (q.includes("cervical cancer")) {
    //   if (q.includes("prevent")) return FAQS["how to prevent cervical cancer"];
    //   if (q.includes("symptom")) return FAQS["what are the symptoms of cervical cancer"];
    //   return FAQS["what is cervical cancer"];
    // }
    // if (q.includes("prostate cancer")) {
    //   if (q.includes("prevent")) return FAQS["how to prevent prostate cancer"];
    //   if (q.includes("symptom")) return FAQS["what are the symptoms of prostate cancer"];
    //   return FAQS["what is prostate cancer"];
    // }
  
    // // 3. More general fuzzy rules for cancer
    // if (/^what is cancer\b/.test(q)) return FAQS["what is cancer"];
    // if (/(cause|why).*cancer/.test(q)) return FAQS["what causes cancer"];
    // if (/prevent.*cancer/.test(q)) return FAQS["how to prevent cancer"];
    // if (/symptom.*cancer/.test(q)) return FAQS["what are the symptoms of cancer"];
    // if (/screen/.test(q)) return FAQS["how often should i get screened"];
  
    // 4. Try smart loose matching on other FAQ entries (from before)
    for (const [faqQ, answer] of Object.entries(FAQS)) {
      // Split FAQ question into keywords for loose matching
      const mainWords = faqQ.split(/\s+/).filter(w =>
        !["what", "how", "is", "are", "does", "can", "should", "the", "a", "of", "to", "in"].includes(w)
      );
      if (mainWords.every(w => q.includes(w))) return answer;
    }
  
    // 5. Not found
    return null;
  }
  