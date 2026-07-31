/* English Coach — Technical English decks
 * Tailored for software / networking / QA engineering (your world).
 * Pushed into EC.vocabulary (loads after vocabulary.js).
 */
window.EC = window.EC || {};
EC.vocabulary = EC.vocabulary || [];

EC.vocabulary.push(
  {
    id: "tech-software",
    title: "Technical — Software & Dev",
    emoji: "💻",
    level: "C1",
    words: [
      { en: "deploy", he: "לפרוס גרסה (לסביבה)", pos: "verb", ipa: "dih-PLOY", example: "We deploy to production every Friday.", exampleHe: "אנחנו פורסים לסביבת הייצור כל יום שישי." },
      { en: "rollback", he: "חזרה לגרסה קודמת", pos: "noun", ipa: "ROHL-bak", example: "We had to do a rollback after the crash.", exampleHe: "היינו צריכים לחזור לגרסה קודמת אחרי הקריסה." },
      { en: "root cause", he: "שורש הבעיה", pos: "noun", ipa: "root KAWZ", example: "Let's find the root cause first.", exampleHe: "בוא קודם נמצא את שורש הבעיה." },
      { en: "reproduce", he: "לשחזר (תקלה)", pos: "verb", ipa: "ree-pruh-DOOS", example: "I can't reproduce the bug.", exampleHe: "אני לא מצליח לשחזר את התקלה." },
      { en: "edge case", he: "מקרה קצה", pos: "noun", ipa: "EJ kays", example: "This fails on an edge case.", exampleHe: "זה נכשל במקרה קצה." },
      { en: "deprecated", he: "הוצא משימוש / מיושן", pos: "adj", ipa: "DEP-rih-kay-tid", example: "That API is deprecated now.", exampleHe: "ה-API הזה הוצא משימוש עכשיו." },
      { en: "workaround", he: "פתרון עוקף", pos: "noun", ipa: "WURK-uh-round", example: "There's a temporary workaround.", exampleHe: "יש פתרון עוקף זמני." },
      { en: "merge", he: "למזג (קוד)", pos: "verb", ipa: "murj", example: "Can you merge the branch?", exampleHe: "אתה יכול למזג את הענף?" },
      { en: "patch", he: "טלאי / עדכון תיקון", pos: "noun", ipa: "pach", example: "They released a patch overnight.", exampleHe: "הם שחררו טלאי במהלך הלילה." },
      { en: "backward compatible", he: "תאימות לאחור", pos: "adj", ipa: "BAK-werd kum-PAT-uh-bl", example: "The update is backward compatible.", exampleHe: "העדכון תואם לאחור." },
      { en: "scalable", he: "ניתן להרחבה / מדרוג", pos: "adj", ipa: "SKAY-luh-bl", example: "The design has to be scalable.", exampleHe: "הארכיטקטורה חייבת להיות ניתנת להרחבה." },
      { en: "rollout", he: "הפצה / השקה הדרגתית", pos: "noun", ipa: "ROHL-out", example: "We're doing a phased rollout.", exampleHe: "אנחנו עושים הפצה הדרגתית." }
    ]
  },
  {
    id: "tech-networking",
    title: "Technical — Networking, QA & Systems",
    emoji: "🛰️",
    level: "C1",
    words: [
      { en: "throughput", he: "תפוקה (קצב עיבוד/העברה)", pos: "noun", ipa: "THROO-poot", example: "Throughput dropped under load.", exampleHe: "התפוקה ירדה תחת עומס." },
      { en: "latency", he: "השהיה / זמן תגובה", pos: "noun", ipa: "LAY-ten-see", example: "We measured end-to-end latency.", exampleHe: "מדדנו השהיה מקצה לקצה." },
      { en: "bottleneck", he: "צוואר בקבוק", pos: "noun", ipa: "BOT-l-nek", example: "The database is the bottleneck.", exampleHe: "בסיס הנתונים הוא צוואר הבקבוק." },
      { en: "downtime", he: "זמן השבתה", pos: "noun", ipa: "DOUN-tym", example: "The upgrade caused zero downtime.", exampleHe: "השדרוג לא גרם לשום זמן השבתה." },
      { en: "failover", he: "מעבר לגיבוי בעת כשל", pos: "noun", ipa: "FAYL-oh-ver", example: "Failover to the standby node worked.", exampleHe: "המעבר לצומת הגיבוי עבד." },
      { en: "packet loss", he: "אובדן חבילות", pos: "noun", ipa: "PAK-it laws", example: "We saw packet loss on that link.", exampleHe: "ראינו אובדן חבילות בקישור הזה." },
      { en: "baseline", he: "קו בסיס / נקודת ייחוס", pos: "noun", ipa: "BAYS-lyn", example: "Let's capture a baseline first.", exampleHe: "בוא קודם ניקח מדידת בסיס." },
      { en: "flaky", he: "לא יציב / הפכפך (בדיקה)", pos: "adj", ipa: "FLAY-kee", example: "That test is flaky — it fails randomly.", exampleHe: "הבדיקה הזאת לא יציבה — נכשלת אקראית." },
      { en: "regression", he: "נסיגה / רגרסיה (שבירה של תקין)", pos: "noun", ipa: "rih-GRESH-un", example: "This is a regression from the last build.", exampleHe: "זו רגרסיה מהגרסה הקודמת." },
      { en: "uptime", he: "זמן פעילות תקין", pos: "noun", ipa: "UP-tym", example: "We target 99.99% uptime.", exampleHe: "אנחנו מכוונים ל-99.99% זמינות." },
      { en: "redundancy", he: "יתירות (גיבוי מובנה)", pos: "noun", ipa: "rih-DUN-den-see", example: "The system has full redundancy.", exampleHe: "למערכת יש יתירות מלאה." },
      { en: "provision", he: "להקצות / להקים משאבים", pos: "verb", ipa: "pruh-VIZH-un", example: "We provisioned two new nodes.", exampleHe: "הקצינו שני צמתים חדשים." }
    ]
  }
);
