/* English Coach — The 12 English tenses
 * Each: name, level, when (usage, in Hebrew), signal words,
 * form {aff, neg, q}, examples, and fill-in-the-blank drills.
 * Drills: sentence with ___, the correct answer, distractor options, and a Hebrew hint.
 */
window.EC = window.EC || {};

EC.tenses = [
  {
    id: "present-simple",
    name: "Present Simple",
    level: "A2",
    when: "עובדות, הרגלים ושגרה. (I work / She works)",
    signals: ["always", "usually", "every day", "on Mondays", "never"],
    form: { aff: "I/you/we/they work · he/she/it works", neg: "don't / doesn't + base", q: "Do/Does + subject + base?" },
    examples: [
      { en: "She works from home on Fridays.", he: "היא עובדת מהבית בימי שישי." },
      { en: "Water boils at 100 degrees Celsius.", he: "מים רותחים ב-100 מעלות." }
    ],
    drills: [
      { sentence: "He ___ coffee every morning.", answer: "drinks", options: ["drinks", "drink", "is drinking", "drank"], hint: "הרגל יומיומי → Present Simple, גוף שלישי יחיד." },
      { sentence: "They ___ in Boston.", answer: "live", options: ["live", "lives", "are living", "lived"], hint: "עובדה כללית, they → צורת הבסיס." },
      { sentence: "___ she speak Spanish?", answer: "Does", options: ["Does", "Do", "Is", "Has"], hint: "שאלה בגוף שלישי יחיד → Does." }
    ]
  },
  {
    id: "present-continuous",
    name: "Present Continuous",
    level: "A2",
    when: "פעולה שקורית עכשיו או תוכנית עתידית קרובה. (am/is/are + -ing)",
    signals: ["now", "right now", "at the moment", "currently", "these days"],
    form: { aff: "am/is/are + verb-ing", neg: "am/is/are + not + verb-ing", q: "Am/Is/Are + subject + verb-ing?" },
    examples: [
      { en: "I'm working on it right now.", he: "אני עובד על זה ממש עכשיו." },
      { en: "We're meeting them tomorrow.", he: "אנחנו נפגשים איתם מחר." }
    ],
    drills: [
      { sentence: "Be quiet, the baby ___.", answer: "is sleeping", options: ["is sleeping", "sleeps", "slept", "sleep"], hint: "קורה עכשיו → Present Continuous." },
      { sentence: "Why ___ you ___ at me?", answer: "are / looking", options: ["are / looking", "do / look", "is / looking", "are / look"], hint: "פעולה ברגע הדיבור → are + looking." }
    ]
  },
  {
    id: "past-simple",
    name: "Past Simple",
    level: "A2",
    when: "פעולה שהסתיימה בזמן מוגדר בעבר. (worked / went)",
    signals: ["yesterday", "last week", "in 2019", "ago", "this morning"],
    form: { aff: "verb + -ed / irregular", neg: "didn't + base", q: "Did + subject + base?" },
    examples: [
      { en: "I saw that movie last night.", he: "ראיתי את הסרט הזה אתמול בלילה." },
      { en: "They didn't come to the party.", he: "הם לא הגיעו למסיבה." }
    ],
    drills: [
      { sentence: "We ___ to Italy last summer.", answer: "went", options: ["went", "go", "have gone", "were going"], hint: "זמן מוגדר בעבר (last summer) → Past Simple, פועל לא רגיל go→went." },
      { sentence: "She ___ call me yesterday.", answer: "didn't", options: ["didn't", "doesn't", "wasn't", "hasn't"], hint: "שלילה בעבר → didn't + בסיס." }
    ]
  },
  {
    id: "past-continuous",
    name: "Past Continuous",
    level: "B1",
    when: "פעולה שהייתה בעיצומה בנקודה בעבר, לרוב נקטעת. (was/were + -ing)",
    signals: ["while", "when", "at 8pm yesterday", "all day"],
    form: { aff: "was/were + verb-ing", neg: "was/were + not + verb-ing", q: "Was/Were + subject + verb-ing?" },
    examples: [
      { en: "I was cooking when you called.", he: "בישלתי כשהתקשרת." },
      { en: "They were watching TV all evening.", he: "הם צפו בטלוויזיה כל הערב." }
    ],
    drills: [
      { sentence: "She ___ when the phone rang.", answer: "was sleeping", options: ["was sleeping", "slept", "is sleeping", "sleeps"], hint: "פעולה נמשכת שנקטעה → Past Continuous." },
      { sentence: "What ___ you ___ at 10pm?", answer: "were / doing", options: ["were / doing", "did / do", "was / doing", "are / doing"], hint: "you → were + doing." }
    ]
  },
  {
    id: "present-perfect",
    name: "Present Perfect",
    level: "B1",
    when: "עבר שקשור להווה, ניסיון חיים, או פעולה שהסתיימה בזמן לא מוגדר. (have/has + V3)",
    signals: ["already", "yet", "just", "ever", "never", "since", "for"],
    form: { aff: "have/has + past participle (V3)", neg: "haven't/hasn't + V3", q: "Have/Has + subject + V3?" },
    examples: [
      { en: "I've already eaten.", he: "כבר אכלתי." },
      { en: "She has lived here for ten years.", he: "היא גרה כאן כבר עשר שנים." }
    ],
    drills: [
      { sentence: "I ___ never ___ sushi.", answer: "have / eaten", options: ["have / eaten", "did / eat", "have / ate", "am / eating"], hint: "ניסיון חיים ('never') → Present Perfect, V3 של eat = eaten." },
      { sentence: "Have you finished ___?", answer: "yet", options: ["yet", "already", "since", "ago"], hint: "בשאלה שלילית/שאלה בסוף המשפט → yet." },
      { sentence: "We've known each other ___ 2010.", answer: "since", options: ["since", "for", "ago", "from"], hint: "נקודת התחלה מדויקת → since." }
    ]
  },
  {
    id: "present-perfect-continuous",
    name: "Present Perfect Continuous",
    level: "B2",
    when: "פעולה שהחלה בעבר ונמשכת עד עכשיו, עם דגש על משך. (have/has been + -ing)",
    signals: ["for", "since", "lately", "all day", "how long"],
    form: { aff: "have/has been + verb-ing", neg: "haven't/hasn't been + verb-ing", q: "Have/Has + subject + been + verb-ing?" },
    examples: [
      { en: "I've been studying English for three years.", he: "אני לומד אנגלית כבר שלוש שנים." },
      { en: "It's been raining all day.", he: "יורד גשם כל היום." }
    ],
    drills: [
      { sentence: "She's tired because she ___ all day.", answer: "has been working", options: ["has been working", "works", "worked", "is working"], hint: "פעולה נמשכת שמסבירה מצב עכשווי → Present Perfect Continuous." },
      { sentence: "How long ___ you ___ here?", answer: "have / been waiting", options: ["have / been waiting", "do / wait", "are / waiting", "did / wait"], hint: "'How long' + משך → have been + -ing." }
    ]
  },
  {
    id: "past-perfect",
    name: "Past Perfect",
    level: "B2",
    when: "פעולה שקרתה לפני פעולה אחרת בעבר. (had + V3)",
    signals: ["before", "after", "by the time", "already", "when"],
    form: { aff: "had + past participle (V3)", neg: "hadn't + V3", q: "Had + subject + V3?" },
    examples: [
      { en: "The train had left before we arrived.", he: "הרכבת יצאה לפני שהגענו." },
      { en: "She had never seen snow before that trip.", he: "היא מעולם לא ראתה שלג לפני הטיול ההוא." }
    ],
    drills: [
      { sentence: "By the time we got there, the movie ___.", answer: "had started", options: ["had started", "started", "starts", "has started"], hint: "פעולה שקדמה לפעולה אחרת בעבר → Past Perfect." },
      { sentence: "He couldn't get in because he ___ his keys.", answer: "had forgotten", options: ["had forgotten", "forgot", "forgets", "has forgotten"], hint: "הסיבה קדמה לתוצאה בעבר → had + V3." }
    ]
  },
  {
    id: "future-will",
    name: "Future — will",
    level: "A2",
    when: "החלטות ספונטניות, הבטחות, תחזיות. (will + base)",
    signals: ["tomorrow", "next week", "soon", "I think", "probably"],
    form: { aff: "will + base verb", neg: "won't + base", q: "Will + subject + base?" },
    examples: [
      { en: "I'll call you later.", he: "אני אתקשר אליך אחר כך." },
      { en: "It'll probably rain tomorrow.", he: "כנראה יירד גשם מחר." }
    ],
    drills: [
      { sentence: "Don't worry, I ___ help you.", answer: "will", options: ["will", "am", "would", "am going to"], hint: "החלטה/הבטחה ספונטנית → will." },
      { sentence: "The phone's ringing — I ___ get it.", answer: "will", options: ["will", "am getting", "get", "was getting"], hint: "החלטה ברגע הדיבור → will." }
    ]
  },
  {
    id: "future-going-to",
    name: "Future — going to",
    level: "A2",
    when: "כוונות/תוכניות מתוכננות מראש, וחיזוי לפי סימנים בהווה. (going to + base)",
    signals: ["planning to", "look", "already decided", "tonight"],
    form: { aff: "am/is/are going to + base", neg: "am/is/are not going to + base", q: "Am/Is/Are + subject + going to + base?" },
    examples: [
      { en: "We're going to visit my parents this weekend.", he: "אנחנו הולכים לבקר את ההורים שלי בסוף השבוע." },
      { en: "Look at those clouds — it's going to rain.", he: "תראה את העננים — עומד לרדת גשם." }
    ],
    drills: [
      { sentence: "I ___ start a new job next month.", answer: "am going to", options: ["am going to", "will", "go to", "am"], hint: "תוכנית שכבר הוחלטה → going to." },
      { sentence: "Watch out! You ___ fall.", answer: "are going to", options: ["are going to", "will", "fall", "go to"], hint: "חיזוי לפי סימן בהווה → going to." }
    ]
  },
  {
    id: "future-continuous",
    name: "Future Continuous",
    level: "B2",
    when: "פעולה שתהיה בעיצומה בנקודה עתידית. (will be + -ing)",
    signals: ["this time tomorrow", "at 8pm tonight", "all day tomorrow"],
    form: { aff: "will be + verb-ing", neg: "won't be + verb-ing", q: "Will + subject + be + verb-ing?" },
    examples: [
      { en: "This time tomorrow I'll be flying to New York.", he: "בשעה הזאת מחר אהיה בטיסה לניו יורק." },
      { en: "Don't call at 9 — I'll be sleeping.", he: "אל תתקשר ב-9, אהיה ישן." }
    ],
    drills: [
      { sentence: "At noon tomorrow we ___ the exam.", answer: "will be taking", options: ["will be taking", "will take", "are taking", "take"], hint: "פעולה נמשכת בנקודה עתידית → will be + -ing." }
    ]
  },
  {
    id: "future-perfect",
    name: "Future Perfect",
    level: "C1",
    when: "פעולה שתסתיים לפני נקודה עתידית מסוימת. (will have + V3)",
    signals: ["by then", "by 2030", "by the time", "before"],
    form: { aff: "will have + past participle (V3)", neg: "won't have + V3", q: "Will + subject + have + V3?" },
    examples: [
      { en: "By next year, I'll have finished my degree.", he: "עד שנה הבאה אסיים את התואר." },
      { en: "They'll have left by the time you arrive.", he: "הם כבר יעזבו עד שתגיע." }
    ],
    drills: [
      { sentence: "By 6pm, she ___ the report.", answer: "will have finished", options: ["will have finished", "will finish", "finishes", "has finished"], hint: "פעולה שתושלם לפני זמן עתידי → will have + V3." }
    ]
  },
  {
    id: "conditionals",
    name: "Conditionals (if)",
    level: "B2",
    when: "משפטי תנאי: אפס/ראשון/שני/שלישי. (If ...)",
    signals: ["if", "unless", "would", "as long as"],
    form: { aff: "1st: If + present, ... will · 2nd: If + past, ... would · 3rd: If + had+V3, ... would have+V3", neg: "unless = if not", q: "What would you do if ...?" },
    examples: [
      { en: "If it rains, we'll stay home. (1st)", he: "אם יירד גשם, נישאר בבית." },
      { en: "If I were rich, I'd travel the world. (2nd)", he: "אם הייתי עשיר, הייתי מטייל בעולם." },
      { en: "If I had known, I would have helped. (3rd)", he: "אם הייתי יודע, הייתי עוזר." }
    ],
    drills: [
      { sentence: "If I ___ you, I'd apologize.", answer: "were", options: ["were", "was", "am", "would be"], hint: "תנאי שני (דמיוני) → If I were." },
      { sentence: "If you heat ice, it ___.", answer: "melts", options: ["melts", "will melt", "would melt", "melted"], hint: "תנאי אפס (עובדה) → present + present." },
      { sentence: "If she ___ harder, she would have passed.", answer: "had studied", options: ["had studied", "studied", "studies", "would study"], hint: "תנאי שלישי (עבר דמיוני) → had + V3." }
    ]
  }
];
