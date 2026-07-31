/* English Coach — Vocabulary decks
 * Tailored for a Hebrew speaker aiming for native-level American English.
 * Each word: en (English), he (Hebrew), pos (part of speech),
 * ipa (American pronunciation hint), example + exampleHe.
 * Attaches to the global EC namespace (classic script, no build step).
 */
window.EC = window.EC || {};

EC.vocabulary = [
  {
    id: "everyday",
    title: "Everyday Essentials",
    emoji: "☕",
    level: "A2",
    words: [
      { en: "afford", he: "יכולת כלכלית לקנות", pos: "verb", ipa: "uh-FORD", example: "I can't afford a new car right now.", exampleHe: "אני לא יכול להרשות לעצמי מכונית חדשה עכשיו." },
      { en: "borrow", he: "לשאול (לקחת בהשאלה)", pos: "verb", ipa: "BAR-oh", example: "Can I borrow your charger?", exampleHe: "אפשר לשאול את המטען שלך?" },
      { en: "lend", he: "להשאיל (לתת בהשאלה)", pos: "verb", ipa: "lend", example: "She lent me twenty bucks.", exampleHe: "היא השאילה לי עשרים דולר." },
      { en: "errand", he: "סידור/מטלה קטנה", pos: "noun", ipa: "AIR-und", example: "I have a few errands to run downtown.", exampleHe: "יש לי כמה סידורים לעשות במרכז." },
      { en: "chore", he: "מטלת בית", pos: "noun", ipa: "chor", example: "Doing the dishes is my least favorite chore.", exampleHe: "שטיפת כלים היא המטלה הכי פחות אהובה עליי." },
      { en: "handy", he: "שימושי/שנוח להשתמש בו", pos: "adj", ipa: "HAN-dee", example: "Keep a flashlight handy.", exampleHe: "כדאי להחזיק פנס בהישג יד." },
      { en: "spare", he: "פנוי/רזרבי", pos: "adj", ipa: "spair", example: "Do you have a spare minute?", exampleHe: "יש לך רגע פנוי?" },
      { en: "throw away", he: "לזרוק לפח", pos: "phrasal", ipa: "throh uh-WAY", example: "Don't throw away the receipt.", exampleHe: "אל תזרוק את הקבלה." },
      { en: "run out of", he: "להיגמר (לאזול)", pos: "phrasal", ipa: "run OUT uhv", example: "We ran out of milk.", exampleHe: "נגמר לנו החלב." },
      { en: "figure out", he: "להבין/לפצח", pos: "phrasal", ipa: "FIG-yer out", example: "I finally figured out the problem.", exampleHe: "סוף סוף הבנתי את הבעיה." },
      { en: "on purpose", he: "בכוונה", pos: "phrase", ipa: "on PUR-pus", example: "I didn't do it on purpose.", exampleHe: "לא עשיתי את זה בכוונה." },
      { en: "at least", he: "לפחות", pos: "phrase", ipa: "at LEEST", example: "It'll take at least an hour.", exampleHe: "זה ייקח לפחות שעה." }
    ]
  },
  {
    id: "work",
    title: "Work & Business",
    emoji: "💼",
    level: "B1",
    words: [
      { en: "deadline", he: "מועד אחרון להגשה", pos: "noun", ipa: "DED-line", example: "The deadline is Friday at noon.", exampleHe: "המועד האחרון הוא יום שישי בצהריים." },
      { en: "reach out", he: "לפנות/ליצור קשר", pos: "phrasal", ipa: "reech OUT", example: "Feel free to reach out if you have questions.", exampleHe: "אתה מוזמן לפנות אם יש לך שאלות." },
      { en: "follow up", he: "לעקוב/לחזור לנושא", pos: "phrasal", ipa: "FOL-oh up", example: "I'll follow up with you next week.", exampleHe: "אני אחזור אליך בשבוע הבא." },
      { en: "on the same page", he: "מתואמים/מסכימים", pos: "idiom", ipa: "on thuh saym payj", example: "Let's make sure we're on the same page.", exampleHe: "בוא נוודא שאנחנו מתואמים." },
      { en: "touch base", he: "ליצור קשר קצר לעדכון", pos: "idiom", ipa: "tuch bays", example: "Let's touch base tomorrow morning.", exampleHe: "בוא נעשה תיאום קצר מחר בבוקר." },
      { en: "workload", he: "עומס עבודה", pos: "noun", ipa: "WURK-lohd", example: "My workload has been crazy lately.", exampleHe: "עומס העבודה שלי מטורף לאחרונה." },
      { en: "raise", he: "העלאת שכר", pos: "noun", ipa: "rayz", example: "She asked her boss for a raise.", exampleHe: "היא ביקשה מהבוס העלאה." },
      { en: "quit", he: "להתפטר/לפרוש", pos: "verb", ipa: "kwit", example: "He quit his job last month.", exampleHe: "הוא התפטר מהעבודה בחודש שעבר." },
      { en: "handle", he: "לטפל ב/להתמודד עם", pos: "verb", ipa: "HAN-dl", example: "I can handle it, don't worry.", exampleHe: "אני יכול לטפל בזה, אל תדאג." },
      { en: "in charge of", he: "אחראי על", pos: "phrase", ipa: "in charj uhv", example: "Who's in charge of the project?", exampleHe: "מי אחראי על הפרויקט?" },
      { en: "get back to", he: "לחזור עם תשובה ל", pos: "phrasal", ipa: "get BAK too", example: "Let me get back to you on that.", exampleHe: "תן לי לחזור אליך עם תשובה על זה." },
      { en: "brainstorm", he: "לסיעור מוחות", pos: "verb", ipa: "BRAYN-storm", example: "We brainstormed a few ideas.", exampleHe: "עשינו סיעור מוחות על כמה רעיונות." }
    ]
  },
  {
    id: "feelings",
    title: "Feelings & Personality",
    emoji: "😊",
    level: "B1",
    words: [
      { en: "overwhelmed", he: "מוצף/עמוס רגשית", pos: "adj", ipa: "oh-ver-WELMD", example: "I feel overwhelmed with all this work.", exampleHe: "אני מרגיש מוצף מכל העבודה הזאת." },
      { en: "excited", he: "נרגש/מתרגש", pos: "adj", ipa: "ik-SY-tid", example: "I'm so excited for the trip!", exampleHe: "אני כל כך מתרגש לקראת הטיול!" },
      { en: "annoyed", he: "מעוצבן/מוטרד", pos: "adj", ipa: "uh-NOYD", example: "I was annoyed by the noise.", exampleHe: "התעצבנתי מהרעש." },
      { en: "confident", he: "בטוח בעצמו", pos: "adj", ipa: "KON-fih-dent", example: "She's confident about the exam.", exampleHe: "היא בטוחה בעצמה לגבי המבחן." },
      { en: "awkward", he: "מביך/לא נעים", pos: "adj", ipa: "AWK-werd", example: "There was an awkward silence.", exampleHe: "הייתה שתיקה מביכה." },
      { en: "easygoing", he: "רגוע/נוח לבריות", pos: "adj", ipa: "EE-zee-goh-ing", example: "He's really easygoing.", exampleHe: "הוא ממש רגוע ונוח." },
      { en: "stubborn", he: "עקשן", pos: "adj", ipa: "STUB-ern", example: "Don't be so stubborn.", exampleHe: "אל תהיה כזה עקשן." },
      { en: "grateful", he: "אסיר תודה", pos: "adj", ipa: "GRAYT-ful", example: "I'm grateful for your help.", exampleHe: "אני אסיר תודה על העזרה שלך." },
      { en: "look forward to", he: "לצפות בכיליון עיניים", pos: "phrasal", ipa: "look FOR-werd too", example: "I look forward to seeing you.", exampleHe: "אני מצפה לראות אותך." },
      { en: "freak out", he: "להיכנס לפאניקה", pos: "phrasal", ipa: "freek OUT", example: "Don't freak out, it's fine.", exampleHe: "אל תיכנס לפאניקה, הכל בסדר." },
      { en: "calm down", he: "להירגע", pos: "phrasal", ipa: "kahm DOUN", example: "Take a breath and calm down.", exampleHe: "קח נשימה ותירגע." },
      { en: "get along", he: "להסתדר עם", pos: "phrasal", ipa: "get uh-LONG", example: "They get along really well.", exampleHe: "הם מסתדרים ממש טוב." }
    ]
  },
  {
    id: "food",
    title: "Food & Dining Out",
    emoji: "🍔",
    level: "A2",
    words: [
      { en: "grab a bite", he: "לתפוס משהו לאכול", pos: "idiom", ipa: "grab uh byt", example: "Let's grab a bite before the movie.", exampleHe: "בוא נתפוס משהו לאכול לפני הסרט." },
      { en: "takeout", he: "אוכל לקחת (טייק אווי)", pos: "noun", ipa: "TAYK-out", example: "Let's just order takeout tonight.", exampleHe: "בוא פשוט נזמין טייק אווי הערב." },
      { en: "leftovers", he: "שאריות אוכל", pos: "noun", ipa: "LEFT-oh-verz", example: "I had leftovers for lunch.", exampleHe: "אכלתי שאריות לצהריים." },
      { en: "check", he: "חשבון (במסעדה)", pos: "noun", ipa: "chek", example: "Can we get the check, please?", exampleHe: "אפשר לקבל את החשבון, בבקשה?" },
      { en: "tip", he: "טיפ/תשר", pos: "noun", ipa: "tip", example: "We left a 20% tip.", exampleHe: "השארנו טיפ של 20 אחוז." },
      { en: "craving", he: "השתוקקות למאכל מסוים", pos: "noun", ipa: "KRAY-ving", example: "I have a craving for pizza.", exampleHe: "יש לי חשק עז לפיצה." },
      { en: "starving", he: "גווע ברעב", pos: "adj", ipa: "STAR-ving", example: "I'm starving, let's eat.", exampleHe: "אני גווע ברעב, בוא נאכל." },
      { en: "appetizer", he: "מנה ראשונה", pos: "noun", ipa: "AP-ih-ty-zer", example: "We ordered a few appetizers.", exampleHe: "הזמנו כמה מנות ראשונות." },
      { en: "spicy", he: "חריף", pos: "adj", ipa: "SPY-see", example: "This sauce is too spicy for me.", exampleHe: "הרוטב הזה חריף לי מדי." },
      { en: "to go", he: "לקחת (לא לאכול במקום)", pos: "phrase", ipa: "too goh", example: "I'll have a coffee to go.", exampleHe: "אני אקח קפה לדרך." },
      { en: "pick up", he: "לאסוף/לקחת", pos: "phrasal", ipa: "pik UP", example: "Can you pick up dinner on the way?", exampleHe: "אתה יכול לאסוף ארוחת ערב בדרך?" },
      { en: "split", he: "לחלק (בין אנשים)", pos: "verb", ipa: "split", example: "Let's split the bill.", exampleHe: "בוא נחלק את החשבון." }
    ]
  },
  {
    id: "travel",
    title: "Travel & Getting Around",
    emoji: "✈️",
    level: "B1",
    words: [
      { en: "layover", he: "עצירת ביניים (בטיסה)", pos: "noun", ipa: "LAY-oh-ver", example: "We had a two-hour layover in Chicago.", exampleHe: "הייתה לנו עצירת ביניים של שעתיים בשיקגו." },
      { en: "check in", he: "לבצע צ'ק אין", pos: "phrasal", ipa: "chek IN", example: "We need to check in two hours early.", exampleHe: "אנחנו צריכים לעשות צ'ק אין שעתיים מראש." },
      { en: "carry-on", he: "מזוודת יד/עלייה למטוס", pos: "noun", ipa: "KAR-ee-on", example: "I only travel with a carry-on.", exampleHe: "אני נוסע רק עם מזוודת יד." },
      { en: "book", he: "להזמין (כרטיס/מקום)", pos: "verb", ipa: "book", example: "I booked a hotel downtown.", exampleHe: "הזמנתי מלון במרכז העיר." },
      { en: "get around", he: "להתנייד/לנוע במקום", pos: "phrasal", ipa: "get uh-ROUND", example: "It's easy to get around by subway.", exampleHe: "קל להתנייד ברכבת התחתית." },
      { en: "sold out", he: "אזל/נמכר במלואו", pos: "phrase", ipa: "sohld OUT", example: "The show is sold out.", exampleHe: "המופע אזל." },
      { en: "on time", he: "בזמן", pos: "phrase", ipa: "on TYM", example: "The train left on time.", exampleHe: "הרכבת יצאה בזמן." },
      { en: "delayed", he: "מתעכב/מעוכב", pos: "adj", ipa: "dih-LAYD", example: "Our flight got delayed.", exampleHe: "הטיסה שלנו התעכבה." },
      { en: "head", he: "לפנות/לנוע לכיוון", pos: "verb", ipa: "hed", example: "We're heading downtown.", exampleHe: "אנחנו בדרך למרכז העיר." },
      { en: "sightseeing", he: "סיור תיירותי", pos: "noun", ipa: "SYT-see-ing", example: "We spent the day sightseeing.", exampleHe: "בילינו את היום בסיורים." },
      { en: "jet lag", he: "יעפת (עייפות מטיסה)", pos: "noun", ipa: "JET lag", example: "I'm still fighting jet lag.", exampleHe: "אני עדיין נאבק ביעפת." },
      { en: "downtown", he: "מרכז העיר", pos: "noun", ipa: "DOUN-toun", example: "Let's meet downtown.", exampleHe: "בוא ניפגש במרכז העיר." }
    ]
  },
  {
    id: "advanced",
    title: "Sound Native (C1)",
    emoji: "🎯",
    level: "C1",
    words: [
      { en: "eventually", he: "בסופו של דבר", pos: "adv", ipa: "ih-VEN-choo-uh-lee", example: "He eventually agreed.", exampleHe: "בסופו של דבר הוא הסכים." },
      { en: "actually", he: "למעשה/בעצם", pos: "adv", ipa: "AK-choo-uh-lee", example: "Actually, I changed my mind.", exampleHe: "בעצם, שיניתי את דעתי." },
      { en: "kind of", he: "די/משהו כמו (סוג של)", pos: "phrase", ipa: "KYN-duh", example: "It's kind of complicated.", exampleHe: "זה די מסובך." },
      { en: "no big deal", he: "לא נורא/לא עניין גדול", pos: "idiom", ipa: "noh big deel", example: "It's no big deal, really.", exampleHe: "זה ממש לא נורא." },
      { en: "make sense", he: "להיות הגיוני", pos: "phrase", ipa: "mayk SENS", example: "That actually makes sense.", exampleHe: "זה בעצם הגיוני." },
      { en: "keep up", he: "לעמוד בקצב", pos: "phrasal", ipa: "keep UP", example: "I can't keep up with the news.", exampleHe: "אני לא מצליח לעמוד בקצב החדשות." },
      { en: "point out", he: "להצביע על/לציין", pos: "phrasal", ipa: "point OUT", example: "She pointed out a mistake.", exampleHe: "היא הצביעה על טעות." },
      { en: "come across", he: "להיתקל ב/להיראות כ", pos: "phrasal", ipa: "kum uh-KROS", example: "I came across an old photo.", exampleHe: "נתקלתי בתמונה ישנה." },
      { en: "turn out", he: "להתברר (בסוף)", pos: "phrasal", ipa: "turn OUT", example: "It turned out fine.", exampleHe: "בסוף זה הסתדר." },
      { en: "regardless", he: "ללא קשר/בכל מקרה", pos: "adv", ipa: "rih-GARD-lis", example: "We'll go regardless of the weather.", exampleHe: "נלך בכל מקרה, לא משנה מזג האוויר." },
      { en: "get the hang of", he: "לתפוס את העניין", pos: "idiom", ipa: "get thuh HANG uhv", example: "You'll get the hang of it.", exampleHe: "תתפוס את העניין מהר." },
      { en: "for the most part", he: "ברובו/בגדול", pos: "phrase", ipa: "for thuh mohst part", example: "For the most part, it works well.", exampleHe: "בגדול, זה עובד טוב." }
    ]
  }
];
