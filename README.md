# ⌨️ Typing Speed Test Pro

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)
[![Status](https://img.shields.io/badge/Status-Active-emerald.svg)]()

**Typing Speed Test Pro** is a modern, high-performance web application designed to measure and elevate your keyboard speed, precision, and consistency. Built using modern HTML5, CSS3, and JavaScript, it features real-time character-by-character analysis, zero-latency Web Audio sound synthesis, live WPM calculations, customizable durations and text categories, analytics charts, and printable verification certificates.

---

## ✨ Features

- ⚡ **Real-Time Character Feedback & Cursor Caret**: Dynamic character highlighting for correct keys, mistakes, and untyped spaces, accompanied by a smoothly gliding cursor.
- ⏱️ **Drift-Free Precision Timer**: Utilizes `performance.now()` delta timestamps for exact, millisecond-accurate elapsed time calculation.
- 🔊 **Zero-Latency Web Audio Synthesizer**: Built-in sound effects without external network requests:
  - **Mechanical**: Crisp Cherry MX Blue tactile switch clicks.
  - **Typewriter**: Classic mechanical typewriter key-strikes.
  - **Bubble Pop**: Modern, muted bubble feedback.
  - **Mute**: Quiet mode for distraction-free typing.
- 📊 **Dual Performance HUD & Analytics**:
  - **Net WPM & Gross WPM**: Standardized 5-character word metrics.
  - **Accuracy & Mistakes**: Real-time error rate tracking.
  - **CPM (Characters Per Minute)**: Precise keystroke speed tracking.
  - **Consistency Score**: Statistical variance score measuring typing rhythm.
  - **Chart.js Progression**: Chronological visual graph tracking your speed and accuracy over tests.
- 📜 **Official Printable Certificate**:
  - Auto-evaluates skill tiers (*Grandmaster*, *Master*, *Pro*, *Intermediate*, *Novice*).
  - Customizable candidate name with print-optimized styling (`Ctrl + P` / Save as PDF).
- 🏆 **Personal Best & Top Leaderboard**:
  - Tracks top 10 best scores with rank medals (🥇, 🥈, 🥉).
  - LocalStorage persistence with custom player handles.
- 🎨 **Adaptive Themes**:
  - Obsidian Dark Mode (default with ambient glow).
  - Clean Slate Light Mode.
- 📚 **Rich Text Categories & Infinite Text Stream**:
  - Standard passages, Technology & Programming, Famous Quotes, Literature, and Code snippets.
  - Seamless sentence extension so fast typists never hit a dead end.

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
| :--- | :--- |
| <kbd>Tab</kbd> | Instant Restart Test |
| <kbd>Esc</kbd> | Close any open modal or reset |
| Any Key | Auto-focus and start typing immediately |

---

## 📐 Metrics & Formulas

- **Gross WPM**:  
  $$\text{Gross WPM} = \frac{\text{Total Characters Typed} / 5}{\text{Time (Minutes)}}$$

- **Net WPM**:  
  $$\text{Net WPM} = \max\left(0, \frac{(\text{Correct Characters} / 5) - \text{Mistakes}}{\text{Time (Minutes)}}\right)$$

- **Accuracy**:  
  $$\text{Accuracy} = \left(\frac{\text{Correct Characters}}{\text{Total Characters Typed}}\right) \times 100\%$$

- **Consistency**:  
  Calculated via the inverse coefficient of variation of continuous 1-second WPM samples:
  $$\text{Consistency} = \max\left(50\%, 100\% - \left(\frac{\sigma}{\mu} \times 100\right)\right)$$

---

## 📂 Project Architecture

```
typing-speed-test/
├── index.html        # Semantic HTML5 markup, accessible HUD, and modal dialogs
├── style.css         # Modern glassmorphism, responsive grid, animations, and print media rules
├── script.js         # Core typing engine, Web Audio synthesis, Chart.js rendering, and state management
├── paragraphs.js     # Curated categorized text passages and dynamic multi-sentence generator
└── README.md         # Documentation, feature highlights, and usage guide
```

---

## 🚀 Quick Start

1. Clone or download this repository:
   ```bash
   git clone https://github.com/Rahul-prajapati-05/Typing-Speed-Test-Pro.git
   ```
2. Open `index.html` in any modern web browser (Chrome, Edge, Firefox, Safari, Brave).
3. Start typing immediately!

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
