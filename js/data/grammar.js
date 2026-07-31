/* English Coach — Grammar topics
 * Focused on mistakes Hebrew speakers commonly make in American English.
 * Each topic: id, title, level, summary (he), rules[], examples[], quiz[].
 * quiz item: { prompt, options[], answer(index), explain(he) }
 */
window.EC = window.EC || {};

EC.grammar = [
  {
    id: "articles",
    title: "Articles: a / an / the",
    level: "A2",
    summary: "בעברית אין תווית 'a/an', ולכן דוברי עברית נוטים לשכוח אותה. באנגלית שם עצם ספיר ביחיד כמעט תמיד חייב תווית.",
    rules: [
      "a/an = לא מסוים (אחד מיני רבים). an לפני צליל תנועה: an apple, an hour.",
      "the = מסוים/ידוע לשני הצדדים, או יחיד במינו: the sun, the manager.",
      "אין תווית עם שמות עצם כלליים ברבים או בלתי ספירים: I like coffee. Dogs are loyal."
    ],
    examples: [
      { en: "I need a pen. (any pen)", he: "אני צריך עט (כלשהו)." },
      { en: "Close the door. (the specific one)", he: "תסגור את הדלת (הספציפית)." },
      { en: "She's an engineer.", he: "היא מהנדסת." }
    ],
    quiz: [
      { prompt: "She is ___ honest person.", options: ["a", "an", "the", "—"], answer: 1, explain: "'honest' מתחיל בצליל תנועה (ה-h שקטה) → an." },
      { prompt: "Can you pass ___ salt, please?", options: ["a", "an", "the", "—"], answer: 2, explain: "המלח הספציפי שעל השולחן → the." },
      { prompt: "I love ___ music.", options: ["a", "an", "the", "—"], answer: 3, explain: "מושג כללי/בלתי ספיר → בלי תווית." }
    ]
  },
  {
    id: "prepositions-time",
    title: "Prepositions of time: in / on / at",
    level: "A2",
    summary: "מילות היחס לזמן לא תמיד מקבילות לעברית. יש כלל ברור: at לשעות, on לימים ותאריכים, in לתקופות ארוכות.",
    rules: [
      "at + שעה/רגע: at 7pm, at noon, at night.",
      "on + יום/תאריך: on Monday, on July 4th, on my birthday.",
      "in + חודש/שנה/עונה/חלק ביום: in May, in 2026, in summer, in the morning."
    ],
    examples: [
      { en: "The meeting is at 3pm on Tuesday.", he: "הפגישה ב-15:00 ביום שלישי." },
      { en: "I was born in 1995.", he: "נולדתי ב-1995." }
    ],
    quiz: [
      { prompt: "See you ___ Friday.", options: ["in", "on", "at", "—"], answer: 1, explain: "יום בשבוע → on." },
      { prompt: "The store opens ___ 9am.", options: ["in", "on", "at", "—"], answer: 2, explain: "שעה מדויקת → at." },
      { prompt: "It's cold ___ winter.", options: ["in", "on", "at", "—"], answer: 0, explain: "עונה → in." }
    ]
  },
  {
    id: "much-many",
    title: "much / many / a lot of",
    level: "A2",
    summary: "many לספירים, much לבלתי ספירים. בחיוב האמריקאים לרוב מעדיפים 'a lot of' לשניהם.",
    rules: [
      "many + שם עצם ספיר ברבים: many people, many cars.",
      "much + שם עצם בלתי ספיר: much time, much money (בעיקר בשלילה/שאלה).",
      "a lot of / lots of → מתאים לשניהם, נפוץ בדיבור: a lot of friends, a lot of water."
    ],
    examples: [
      { en: "How many hours did you sleep?", he: "כמה שעות ישנת?" },
      { en: "We don't have much time.", he: "אין לנו הרבה זמן." }
    ],
    quiz: [
      { prompt: "How ___ people came?", options: ["much", "many", "a lot", "few"], answer: 1, explain: "people ספיר → many." },
      { prompt: "There isn't ___ milk left.", options: ["much", "many", "lot", "few"], answer: 0, explain: "milk בלתי ספיר בשלילה → much." }
    ]
  },
  {
    id: "make-do",
    title: "make vs. do",
    level: "B1",
    summary: "בעברית 'לעשות' אחד מכסה את שניהם, ולכן זו טעות נפוצה. do = פעילות/עבודה; make = ליצור/להפיק תוצאה.",
    rules: [
      "do → משימות, עבודה, מטלות: do homework, do the dishes, do business.",
      "make → יצירה/תוצאה: make a decision, make dinner, make a mistake, make money.",
      "צירופים קבועים ללמוד בעל פה: make sense, make sure, do a favor."
    ],
    examples: [
      { en: "I need to make a decision.", he: "אני צריך לקבל החלטה." },
      { en: "Did you do your homework?", he: "עשית שיעורי בית?" }
    ],
    quiz: [
      { prompt: "Please ___ me a favor.", options: ["make", "do", "give", "take"], answer: 1, explain: "'do someone a favor' — צירוף קבוע עם do." },
      { prompt: "Don't ___ the same mistake twice.", options: ["do", "make", "have", "give"], answer: 1, explain: "'make a mistake' — תוצאה שנוצרת → make." },
      { prompt: "She wants to ___ money online.", options: ["do", "make", "earn", "get"], answer: 1, explain: "'make money' — צירוף קבוע." }
    ]
  },
  {
    id: "since-for",
    title: "since vs. for",
    level: "B1",
    summary: "עם Present Perfect: for למשך זמן, since לנקודת התחלה. דוברי עברית מבלבלים כי 'מ...' מתורגם לשניהם.",
    rules: [
      "for + משך זמן: for two years, for a while, for ten minutes.",
      "since + נקודת זמן שבה זה התחיל: since 2020, since Monday, since I was a kid."
    ],
    examples: [
      { en: "I've worked here for five years.", he: "אני עובד כאן חמש שנים." },
      { en: "I've worked here since 2019.", he: "אני עובד כאן מאז 2019." }
    ],
    quiz: [
      { prompt: "We've been friends ___ high school.", options: ["for", "since", "from", "during"], answer: 1, explain: "נקודת התחלה (high school) → since." },
      { prompt: "He's been asleep ___ three hours.", options: ["for", "since", "from", "by"], answer: 0, explain: "משך זמן → for." }
    ]
  },
  {
    id: "adjective-order",
    title: "Word & adjective order",
    level: "B2",
    summary: "באנגלית שם התואר לפני שם העצם (שונה מעברית!), ולתארים מרובים יש סדר קבוע: opinion → size → age → color → origin → material.",
    rules: [
      "תואר לפני שם העצם: a red car (לא 'a car red').",
      "סדר תארים: a beautiful small old wooden table.",
      "תדירות (always/usually/never) לרוב לפני הפועל הראשי: I always drink coffee."
    ],
    examples: [
      { en: "a nice big blue backpack", he: "תיק גב יפה, גדול וכחול" },
      { en: "She rarely eats out.", he: "היא כמעט אף פעם לא אוכלת בחוץ." }
    ],
    quiz: [
      { prompt: "Choose the natural order:", options: ["a wooden small brown box", "a small brown wooden box", "a brown wooden small box", "a wooden brown small box"], answer: 1, explain: "size → color → material: small brown wooden." },
      { prompt: "I ___ late on weekends.", options: ["sleep usually", "usually sleep", "sleep late usually", "usually late sleep"], answer: 1, explain: "תואר תדירות לפני הפועל → usually sleep." }
    ]
  }
];
