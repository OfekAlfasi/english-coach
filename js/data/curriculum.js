/* English Coach — Curriculum: units -> lessons.
 * Each lesson references content by id; the session builder (games.js) turns
 * those references into a mixed, bite-sized exercise set (Duolingo-style).
 * refs: deck (vocab id), grammar (grammar id), tenses (array of tense ids),
 *       idioms (true = use idiom deck).
 */
window.EC = window.EC || {};

EC.curriculum = [
  {
    id: "u1",
    title: "Foundations",
    level: "A2",
    color: "#22c55e",
    lessons: [
      { id: "l1-1", title: "Everyday Words", emoji: "☕", deck: "everyday" },
      { id: "l1-2", title: "Present Simple & Continuous", emoji: "⏱️", tenses: ["present-simple", "present-continuous"] },
      { id: "l1-3", title: "Articles & Prepositions", emoji: "🔤", grammar: ["articles", "prepositions-time"] },
      { id: "l1-4", title: "Food & Dining Out", emoji: "🍔", deck: "food" }
    ]
  },
  {
    id: "u2",
    title: "Building Up",
    level: "B1",
    color: "#3b82f6",
    lessons: [
      { id: "l2-1", title: "Work & Business", emoji: "💼", deck: "work" },
      { id: "l2-2", title: "The Past Tenses", emoji: "⏮️", tenses: ["past-simple", "past-continuous"] },
      { id: "l2-3", title: "Feelings & Personality", emoji: "😊", deck: "feelings" },
      { id: "l2-4", title: "much/many · make/do", emoji: "⚖️", grammar: ["much-many", "make-do"] }
    ]
  },
  {
    id: "u3",
    title: "Fluency",
    level: "B2",
    color: "#8b5cf6",
    lessons: [
      { id: "l3-1", title: "Travel & Getting Around", emoji: "✈️", deck: "travel" },
      { id: "l3-2", title: "Present Perfect", emoji: "✅", tenses: ["present-perfect", "present-perfect-continuous"] },
      { id: "l3-3", title: "since/for · Word Order", emoji: "🧩", grammar: ["since-for", "adjective-order"] },
      { id: "l3-4", title: "Conditionals & Past Perfect", emoji: "🔀", tenses: ["conditionals", "past-perfect"] }
    ]
  },
  {
    id: "u4",
    title: "Sound Native",
    level: "C1",
    color: "#f59e0b",
    lessons: [
      { id: "l4-1", title: "Native-Level Vocabulary", emoji: "🎯", deck: "advanced" },
      { id: "l4-2", title: "The Future Tenses", emoji: "⏭️", tenses: ["future-will", "future-going-to", "future-continuous", "future-perfect"] },
      { id: "l4-3", title: "American Idioms & Slang", emoji: "🗽", idioms: true },
      { id: "l4-4", title: "Mixed Mastery", emoji: "🏆", deck: "advanced", grammar: ["make-do"], tenses: ["conditionals"], idioms: true }
    ]
  },
  {
    id: "u5",
    title: "Business English",
    level: "B2",
    color: "#0ea5e9",
    lessons: [
      { id: "l5-1", title: "Meetings & Email", emoji: "📧", deck: "business-comm" },
      { id: "l5-2", title: "Negotiation & Strategy", emoji: "🤝", deck: "business-strategy" }
    ]
  },
  {
    id: "u6",
    title: "Technical English",
    level: "C1",
    color: "#ef4444",
    lessons: [
      { id: "l6-1", title: "Software & Dev", emoji: "💻", deck: "tech-software" },
      { id: "l6-2", title: "Networking, QA & Systems", emoji: "🛰️", deck: "tech-networking" }
    ]
  }
];
