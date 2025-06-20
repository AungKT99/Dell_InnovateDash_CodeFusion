// src/utils/faq.js

export const FAQS = {
    "what is cancer": "Cancer is when some cells in the body start to grow uncontrollably. Early detection saves lives!",
    "what causes cancer": "Cancer can be caused by genetics, smoking, too much sun, certain chemicals, and sometimes it just happens without a clear reason.",
    "how to prevent cancer": "Healthy lifestyle, not smoking, eating well, exercising, and regular screening help prevent some cancers.",
    "what are the symptoms of cancer": "Common symptoms include unexplained weight loss, lumps, fatigue, changes in skin or bowel habits. Always consult a doctor if you notice anything unusual.",
    "how often should i get screened": "It depends on your age and risk. For example, breast cancer screening is recommended yearly for women 40-49, every 2 years for women 50+. Ask your doctor for advice.",
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
  
    // 
    "what is radiation therapy": "Radiation therapy uses high-energy rays to kill cancer cells or stop them from growing. It's a common treatment for many types of cancer.",
    "will my hair fall out during cancer treatment": "Some treatments, like certain chemotherapy drugs, can cause hair loss. Not all treatments do. Your care team can tell you what to expect.",
    "can i still have children after cancer treatment": "Some cancer treatments can affect fertility. Ask your doctor about options if you plan to have children in the future.",
    "how do i cope with cancer emotionally": "It's normal to feel sad, anxious, or scared. Talk to loved ones, join support groups, or speak to a counsellor. You don't have to face cancer alone.",
    "can cancer come back after treatment": "Some cancers can return after treatment, but regular check-ups help catch any problems early.",
    "what should i eat during cancer treatment": "Try to eat small, balanced meals rich in fruits, vegetables, and protein. Drink plenty of water. Ask your care team for personalized advice.",
    "can i exercise during cancer treatment": "Gentle exercise like walking can help boost energy and mood. Always check with your doctor before starting any new exercise.",
    "what is remission": "Remission means that the signs and symptoms of cancer are reduced or gone. Some people stay in remission for many years.",
    "does everyone with cancer need surgery": "Not always. Treatment depends on the cancer type and stage. Some need surgery, others may need medicine or radiation.",
    "can i travel during cancer treatment": "It may be possible, but always check with your doctor first. Consider your treatment schedule and health needs.",
    "will i lose my appetite during treatment": "Some people may, due to treatment side effects. If you're struggling to eat, talk to your care team for help.",
    "what is immunotherapy": "Immunotherapy is a treatment that helps your immune system fight cancer. It's used for certain types of cancer.",
    "is all cancer fatal": "No. Many cancers can be cured or managed for a long time, especially if detected early.",
    "can stress cause cancer": "There's no strong evidence that stress directly causes cancer, but managing stress is good for overall health.",
    "how do i talk to children about cancer": "Use simple, honest language, and answer their questions. Let them know it's okay to feel sad or ask for help.",
    "does insurance cover cancer treatment": "Many insurance plans cover part of the cost. Check with your provider and ask about government subsidies if you need help.",
    "can i continue my hobbies during cancer treatment": "Yes, if you feel up to it. Activities you enjoy can boost your mood and help you cope."
  };
  
  // Smarter local FAQ answer finder
export function localFAQAnswer(question) {
    if (!question) return null;
    const q = question.trim().toLowerCase();
  
    // 1. Exact match
    if (FAQS[q]) return FAQS[q];
  
    // 2. Try "fuzzy" match by seeing if user query contains FAQ keywords
    for (const [faqQ, answer] of Object.entries(FAQS)) {
      // Split FAQ question into keywords for loose matching
      const mainWords = faqQ.split(/\s+/).filter(w =>
        !["what", "how", "is", "are", "does", "can", "should", "the", "a", "of", "to", "in"].includes(w)
      );
      // If **all** main words are in the user's question, consider it a match
      if (mainWords.every(w => q.includes(w))) return answer;
    }
  
    // 3. If still not found, check for your specific partial rules:
    if (/what.*cancer/.test(q)) return FAQS["what is cancer"];
    if (/(cause|why).*cancer/.test(q)) return FAQS["what causes cancer"];
    if (/prevent.*cancer/.test(q)) return FAQS["how to prevent cancer"];
    if (/symptom.*cancer/.test(q)) return FAQS["what are the symptoms of cancer"];
    if (/screen/.test(q)) return FAQS["how often should i get screened"];
  
    // 4. Not found
    return null;
  }