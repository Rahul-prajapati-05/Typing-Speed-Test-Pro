const paragraphs = [

"The quick brown fox jumps over the lazy dog. Practice every day to improve your typing speed and accuracy.",

"Technology is changing the world faster than ever before. Learning programming helps solve real world problems.",

"Success comes to those who work consistently. Small daily improvements create big achievements over time.",

"Artificial intelligence is transforming education, healthcare, finance, and many other industries around the world.",

"Reading books every day improves vocabulary, communication skills, and overall knowledge in different subjects.",

"Web development combines creativity with logical thinking to build interactive and useful websites for everyone.",

"Typing quickly and accurately is an important skill for students, developers, writers, and office professionals.",

"JavaScript is one of the most popular programming languages used to create dynamic and interactive web pages.",

"Practice makes a person perfect. Never stop learning because knowledge is the key to success in life.",

"Cloud computing provides flexible resources that businesses can use without maintaining expensive hardware systems.",

"Cyber security protects systems, networks, and data from unauthorized access and digital attacks.",

"Healthy habits such as regular exercise, proper sleep, and balanced nutrition improve both body and mind.",

"Open source software allows developers from around the world to collaborate and improve applications together.",

"Every challenge is an opportunity to learn something new and become stronger than before.",

"Computer science teaches problem solving, logical thinking, and software development using different programming languages.",

"Time management helps students complete assignments, prepare for exams, and maintain a healthy work life balance.",

"Machine learning enables computers to recognize patterns and make predictions from available data.",

"Good communication skills are just as important as technical knowledge during placement interviews.",

"Consistency beats motivation because disciplined effort produces long term results and continuous improvement.",

"The internet connects billions of people and provides access to information from almost every field of knowledge."

];

// Function to get random paragraph
function loadParagraph() {
    const randomIndex = Math.floor(Math.random() * paragraphs.length);
    document.getElementById("paragraph").innerText = paragraphs[randomIndex];
}

// Load first paragraph automatically
window.onload = loadParagraph;