/**
 * Typing Speed Test Pro - Curated Paragraphs Library
 * Rich categorized passages and infinite generator for all typing modes and speeds.
 */

const paragraphCategories = {
    standard: [
        "The quick brown fox jumps over the lazy dog. Practice every day to improve your typing speed, muscle memory, and overall keyboard accuracy.",
        "Success comes to those who work consistently with dedication. Small daily improvements create monumental achievements when sustained over time.",
        "Healthy habits such as regular exercise, deep sleep, and balanced nutrition provide lasting energy that elevates both mind and body.",
        "Reading thought-provoking books sharpens your vocabulary, enhances analytical reasoning, and expands your perspective on diverse global cultures.",
        "Time management is the subtle art of prioritizing meaningful tasks over trivial distractions to unlock sustained personal freedom and productivity.",
        "Consistency always beats raw motivation because disciplined effort produces reliable momentum when enthusiasm inevitably fluctuates.",
        "Every unexpected setback carries within it an invaluable lesson that prepares you for greater responsibilities and challenges in the future.",
        "Clear communication is rooted in active listening, empathy, and the ability to articulate complex thoughts into simple, understandable concepts."
    ],
    tech: [
        "JavaScript powers the modern interactive web, enabling developers to build lightning-fast web applications, real-time servers, and mobile software.",
        "Cloud computing provides scalable infrastructure on demand, allowing startups and enterprises to deploy global systems without purchasing physical servers.",
        "Artificial intelligence and deep learning models analyze massive datasets to discover intricate patterns, automate workflows, and assist human decision making.",
        "Cybersecurity safeguards digital infrastructure by implementing multi-factor authentication, cryptographic algorithms, and proactive threat modeling.",
        "Open source software thrives on transparent collaboration, allowing engineers worldwide to audit code, fix bugs, and create foundational tools.",
        "Modern frontend frameworks utilize reactive state management, virtual dom reconciliation, and optimized bundling to deliver silky smooth user interfaces.",
        "Clean architecture emphasizes separation of concerns, unit testability, and resilient interfaces that withstand constant product evolution.",
        "Distributed databases maintain fault tolerance and eventual consistency across independent regions through distributed consensus protocols like Raft and Paxos."
    ],
    quotes: [
        "The only way to do great work is to love what you do. If you haven't found it yet, keep looking. Do not settle. - Steve Jobs",
        "It does not matter how slowly you go as long as you do not stop. Perseverance will always outshine talent when talent ceases to work. - Confucius",
        "In the middle of difficulty lies opportunity. When everything seems to be going against you, remember that airplanes take off against the wind. - Albert Einstein",
        "The greatest glory in living lies not in never falling, but in rising every time we fall. Resilience defines true mastery. - Nelson Mandela",
        "Wisdom begins with curiosity, flourishes through continuous questioning, and deepens through humble self-reflection and practical experience.",
        "The future belongs to those who prepare for it today. Tomorrow's breakthroughs are built upon the quiet disciplines cultivated in the present hour.",
        "Simplicity is the prerequisite for reliability. Complex systems always conceal intricate failure modes waiting for the right moment to surface."
    ],
    literature: [
        "It was the best of times, it was the worst of times, it was the age of wisdom, it was the age of foolishness, it was the epoch of belief, it was the epoch of incredulity.",
        "All happy families are alike; each unhappy family is unhappy in its own way. Beneath the placid surface of routine lies the tempest of human emotion.",
        "The sea was calm and dark, reflecting millions of shimmering stars that whispered ancient secrets to the lone ship gliding silently across the horizon.",
        "Autumn arrived quietly, painting the forest canopy in fiery hues of amber, bronze, and crimson, while cool breezes carried the fragrance of pine and rain.",
        "Within the labyrinth of cobblestone corridors and flickering gas lamps, the forgotten clockmaker worked tirelessly to assemble a mechanism that could mend time."
    ],
    code: [
        "const calculateWPM = (chars, timeInSeconds) => Math.round((chars / 5) / (timeInSeconds / 60));",
        "function debounce(fn, delay = 200) { let timer; return (...args) => { clearTimeout(timer); timer = setTimeout(() => fn(...args), delay); }; }",
        "const status = user.isLoggedIn ? (user.role === 'admin' ? 200 : 204) : 401; if (status !== 200) { throw new Error('Access Denied'); }",
        "async function fetchMetrics(endpoint) { const res = await fetch(endpoint, { headers: { 'Accept': 'application/json' } }); return res.json(); }",
        "export default function useLocalStorage(key, initialValue) { const [val, setVal] = useState(() => JSON.parse(localStorage.getItem(key)) ?? initialValue); return [val, setVal]; }"
    ]
};

// Flattened list for backward compatibility
const paragraphs = [
    ...paragraphCategories.standard,
    ...paragraphCategories.tech,
    ...paragraphCategories.quotes,
    ...paragraphCategories.literature
];

/**
 * Returns a randomized paragraph based on category and target word length.
 * Can assemble multiple sentences so typists never run out of text during long tests.
 */
function getRandomParagraph(category = "all", minWords = 45) {
    let pool = [];
    if (category === "all" || !paragraphCategories[category]) {
        pool = [...paragraphCategories.standard, ...paragraphCategories.tech, ...paragraphCategories.quotes, ...paragraphCategories.literature];
    } else {
        pool = [...paragraphCategories[category]];
    }

    // Shuffle pool
    const shuffled = [...pool].sort(() => 0.5 - Math.random());
    let selectedText = "";
    let wordCount = 0;

    for (const text of shuffled) {
        selectedText += (selectedText ? " " : "") + text;
        wordCount = selectedText.split(/\s+/).length;
        if (wordCount >= minWords) break;
    }

    return selectedText || pool[0];
}

/**
 * Legacy support for direct calls
 */
function loadParagraph() {
    const el = document.getElementById("paragraph");
    if (el) {
        el.innerText = getRandomParagraph("all", 50);
    }
}