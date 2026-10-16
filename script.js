/**
 * Typing Speed Test Pro - Core Engine
 * High precision timing, character-by-character live analysis, Web Audio synthesis,
 * Chart.js analytics, leaderboard persistence, and certificate generator.
 */

(() => {
    'use strict';

    // =========================================================================
    // DOM Elements
    // =========================================================================
    const paragraphBox = document.getElementById("paragraphBox");
    const paragraph = document.getElementById("paragraph");
    const input = document.getElementById("input");
    const typingArena = document.getElementById("typingArena");
    const focusHint = document.getElementById("focusHint");

    // Live Metrics HUD
    const timeDisplay = document.getElementById("time");
    const wpmDisplay = document.getElementById("wpm");
    const accuracyDisplay = document.getElementById("accuracy");
    const mistakesDisplay = document.getElementById("mistakes");
    const cpmDisplay = document.getElementById("cpm");
    const bestDisplay = document.getElementById("best");

    // Progress Bar
    const progressBar = document.getElementById("progressBar");
    const progressTime = document.getElementById("progressTime");
    const progressPercentage = document.getElementById("progressPercentage");

    // Controls
    const timeSelect = document.getElementById("timeSelect");
    const categorySelect = document.getElementById("categorySelect");
    const soundBtn = document.getElementById("soundBtn");
    const soundIcon = document.getElementById("soundIcon");
    const soundLabel = document.getElementById("soundLabel");
    const themeBtn = document.getElementById("themeBtn");
    const themeIcon = document.getElementById("themeIcon");
    const themeLabel = document.getElementById("themeLabel");

    // Action Buttons
    const startBtn = document.getElementById("startBtn");
    const restartBtn = document.getElementById("restartBtn");
    const newPassageBtn = document.getElementById("newPassageBtn");
    const certificateBtn = document.getElementById("certificateBtn");
    const resetChartBtn = document.getElementById("resetChartBtn");

    // Leaderboard
    const leaderboardBody = document.getElementById("leaderboard");
    const totalTestsCount = document.getElementById("totalTestsCount");

    // Result Modal
    const resultModal = document.getElementById("resultModal");
    const resultRankBadge = document.getElementById("resultRankBadge");
    const finalWpm = document.getElementById("finalWpm");
    const finalRawWpm = document.getElementById("finalRawWpm");
    const finalAccuracy = document.getElementById("finalAccuracy");
    const finalKeystrokes = document.getElementById("finalKeystrokes");
    const finalMistakes = document.getElementById("finalMistakes");
    const finalConsistency = document.getElementById("finalConsistency");
    const typistNameInput = document.getElementById("typistNameInput");
    const saveScoreBtn = document.getElementById("saveScoreBtn");
    const modalRestartBtn = document.getElementById("modalRestartBtn");
    const modalCertBtn = document.getElementById("modalCertBtn");
    const modalCloseBtn = document.getElementById("modalCloseBtn");
    const confettiCanvas = document.getElementById("confettiCanvas");

    // Certificate Modal
    const certModal = document.getElementById("certModal");
    const closeCertModalBtn = document.getElementById("closeCertModalBtn");
    const dismissCertBtn = document.getElementById("dismissCertBtn");
    const printCertBtn = document.getElementById("printCertBtn");
    const editCertName = document.getElementById("editCertName");
    const certCandidateName = document.getElementById("certCandidateName");
    const certWpm = document.getElementById("certWpm");
    const certAccuracy = document.getElementById("certAccuracy");
    const certRank = document.getElementById("certRank");
    const certDate = document.getElementById("certDate");

    const toastContainer = document.getElementById("toastContainer");

    // =========================================================================
    // Application State
    // =========================================================================
    let totalTime = parseInt(timeSelect.value, 10) || 60;
    let timeLeft = totalTime;
    let timerId = null;
    let startTime = null;
    let isTestRunning = false;
    let isTestCompleted = false;

    let currentText = "";
    let correctCharsCount = 0;
    let mistakeCount = 0;
    let totalKeystrokesCount = 0;
    let wpmSamples = []; // For consistency calculation

    // Sound Profiles: mechanical, typewriter, pop, mute
    const soundProfiles = ["mechanical", "typewriter", "pop", "mute"];
    let currentSoundProfile = localStorage.getItem("soundProfile") || "mechanical";

    // Theme: dark (default), light
    let currentTheme = localStorage.getItem("theme") || "dark";

    // History & Records
    let history = [];
    try {
        const stored = localStorage.getItem("history");
        history = stored ? JSON.parse(stored) : [];
        if (!Array.isArray(history)) history = [];
    } catch {
        history = [];
    }

    let personalBest = Number(localStorage.getItem("best")) || 0;
    bestDisplay.innerText = personalBest;

    let chartInstance = null;

    // =========================================================================
    // Zero-Latency Web Audio Synthesizer
    // =========================================================================
    let audioCtx = null;

    function getAudioContext() {
        if (!audioCtx) {
            const AudioContextClass = window.AudioContext || window.webkitAudioContext;
            if (AudioContextClass) {
                audioCtx = new AudioContextClass();
            }
        }
        if (audioCtx && audioCtx.state === "suspended") {
            audioCtx.resume();
        }
        return audioCtx;
    }

    function playKeySound(type = "key") {
        if (currentSoundProfile === "mute") return;
        const ctx = getAudioContext();
        if (!ctx) return;

        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        if (currentSoundProfile === "mechanical") {
            // Crisp Cherry MX mechanical click
            if (type === "space") {
                osc.type = "triangle";
                osc.frequency.setValueAtTime(140, now);
                osc.frequency.exponentialRampToValueAtTime(50, now + 0.05);
                gain.gain.setValueAtTime(0.18, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start(now);
                osc.stop(now + 0.05);
            } else if (type === "backspace") {
                osc.type = "sine";
                osc.frequency.setValueAtTime(260, now);
                osc.frequency.exponentialRampToValueAtTime(120, now + 0.04);
                gain.gain.setValueAtTime(0.15, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start(now);
                osc.stop(now + 0.04);
            } else if (type === "error") {
                osc.type = "sawtooth";
                osc.frequency.setValueAtTime(180, now);
                gain.gain.setValueAtTime(0.12, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start(now);
                osc.stop(now + 0.06);
            } else {
                // Key strike
                const pitch = 700 + Math.random() * 250;
                osc.type = "triangle";
                osc.frequency.setValueAtTime(pitch, now);
                osc.frequency.exponentialRampToValueAtTime(200, now + 0.025);
                gain.gain.setValueAtTime(0.12, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.025);
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start(now);
                osc.stop(now + 0.025);
            }
        } else if (currentSoundProfile === "typewriter") {
            // Metallic typewriter strike
            const osc2 = ctx.createOscillator();
            const gain2 = ctx.createGain();

            osc.type = "square";
            osc.frequency.setValueAtTime(900, now);
            osc.frequency.exponentialRampToValueAtTime(150, now + 0.04);

            gain.gain.setValueAtTime(0.08, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(now);
            osc.stop(now + 0.04);
        } else if (currentSoundProfile === "pop") {
            // Soft modern bubble pop
            osc.type = "sine";
            const pitch = type === "space" ? 380 : 540 + Math.random() * 120;
            osc.frequency.setValueAtTime(pitch, now);
            osc.frequency.exponentialRampToValueAtTime(120, now + 0.05);
            gain.gain.setValueAtTime(0.15, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(now);
            osc.stop(now + 0.05);
        }
    }

    function playCompletionChime() {
        if (currentSoundProfile === "mute") return;
        const ctx = getAudioContext();
        if (!ctx) return;

        const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
        notes.forEach((freq, idx) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            const time = ctx.currentTime + idx * 0.09;
            osc.type = "sine";
            osc.frequency.setValueAtTime(freq, time);
            gain.gain.setValueAtTime(0.15, time);
            gain.gain.exponentialRampToValueAtTime(0.001, time + 0.35);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(time);
            osc.stop(time + 0.35);
        });
    }

    // =========================================================================
    // Passage Loader & Character Renderer
    // =========================================================================
    function loadNewPassage(category = null) {
        const cat = category || categorySelect.value || "all";
        const minWords = totalTime <= 30 ? 45 : (totalTime <= 60 ? 80 : 160);

        if (typeof getRandomParagraph === "function") {
            currentText = getRandomParagraph(cat, minWords);
        } else {
            currentText = "The quick brown fox jumps over the lazy dog. Practice every day to master your keyboard speed.";
        }

        renderPassage();
        resetArenaScroll();
    }

    function renderPassage() {
        paragraph.innerHTML = "";
        const chars = currentText.split("");

        chars.forEach((char, index) => {
            const span = document.createElement("span");
            span.className = "char" + (index === 0 ? " current" : "");
            span.textContent = char;
            span.id = `char-${index}`;
            paragraph.appendChild(span);
        });
    }

    function resetArenaScroll() {
        if (paragraphBox) {
            paragraphBox.scrollTop = 0;
        }
    }

    // =========================================================================
    // High-Precision Timer & Test Execution
    // =========================================================================
    function startTest() {
        if (isTestRunning) return;

        isTestRunning = true;
        isTestCompleted = false;

        totalTime = parseInt(timeSelect.value, 10) || 60;
        timeLeft = totalTime;
        correctCharsCount = 0;
        mistakeCount = 0;
        totalKeystrokesCount = 0;
        wpmSamples = [];

        input.value = "";
        input.disabled = false;
        input.focus();

        focusHint.classList.remove("visible");

        updateHUD(0, 100, 0, 0);
        updateProgress(0);

        startTime = performance.now();
        clearInterval(timerId);
        timerId = setInterval(tick, 100);

        showToast("🚀 Test started! Keep typing steadily.");
    }

    function tick() {
        if (!isTestRunning) return;

        const now = performance.now();
        const elapsedSec = (now - startTime) / 1000;
        const remaining = Math.max(0, totalTime - elapsedSec);

        timeLeft = Math.ceil(remaining);
        timeDisplay.innerText = timeLeft;

        const progress = Math.min(100, (elapsedSec / totalTime) * 100);
        updateProgress(progress, Math.floor(elapsedSec));

        // Sample WPM every second for consistency
        if (elapsedSec > 1) {
            const currentWpm = calculateLiveWpm(elapsedSec);
            if (wpmSamples.length < Math.floor(elapsedSec)) {
                wpmSamples.push(currentWpm);
            }
        }

        if (remaining <= 0) {
            finishTest();
        }
    }

    function updateProgress(percentage, elapsedSec = 0) {
        progressBar.style.width = percentage.toFixed(1) + "%";
        progressPercentage.innerText = Math.round(percentage) + "%";
        progressTime.innerText = elapsedSec + "s";
    }

    function finishTest() {
        clearInterval(timerId);
        timerId = null;
        isTestRunning = false;
        isTestCompleted = true;

        input.disabled = true;
        updateProgress(100, totalTime);
        timeDisplay.innerText = "0";

        const elapsedMinutes = totalTime / 60;
        const rawWpm = Math.round((totalKeystrokesCount / 5) / elapsedMinutes) || 0;
        const netWpm = Math.max(0, Math.round(((correctCharsCount / 5) - mistakeCount) / elapsedMinutes)) || Math.round((correctCharsCount / 5) / elapsedMinutes);
        const accuracy = totalKeystrokesCount > 0 ? Math.max(0, Math.min(100, Math.round((correctCharsCount / totalKeystrokesCount) * 100))) : 100;
        const consistency = calculateConsistency();

        // Update HUD to final
        wpmDisplay.innerText = netWpm;
        accuracyDisplay.innerText = accuracy + "%";
        mistakesDisplay.innerText = mistakeCount;
        cpmDisplay.innerText = Math.round(correctCharsCount / elapsedMinutes);

        // Update Best Score
        saveBestRecord(netWpm);

        // Auto Save to history
        const defaultName = localStorage.getItem("lastTypistName") || "Typist";
        saveRecordToHistory(netWpm, rawWpm, accuracy, defaultName);

        playCompletionChime();
        openResultModal({
            netWpm,
            rawWpm,
            accuracy,
            totalKeystrokes: totalKeystrokesCount,
            mistakes: mistakeCount,
            consistency
        });
    }

    function calculateLiveWpm(elapsedSec) {
        const minutes = Math.max(0.01, elapsedSec / 60);
        return Math.max(0, Math.round((correctCharsCount / 5) / minutes));
    }

    function calculateConsistency() {
        if (wpmSamples.length < 2) return 95;
        const mean = wpmSamples.reduce((a, b) => a + b, 0) / wpmSamples.length;
        if (mean <= 0) return 90;
        const variance = wpmSamples.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / wpmSamples.length;
        const stdDev = Math.sqrt(variance);
        const coefficientOfVariation = (stdDev / mean) * 100;
        return Math.max(50, Math.min(100, Math.round(100 - coefficientOfVariation)));
    }

    function updateHUD(wpm, accuracy, mistakes, cpm) {
        wpmDisplay.innerText = wpm;
        accuracyDisplay.innerText = accuracy + "%";
        mistakesDisplay.innerText = mistakes;
        cpmDisplay.innerText = cpm;
    }

    // =========================================================================
    // Typing Input Event Handler
    // =========================================================================
    input.addEventListener("input", handleTyping);

    function handleTyping(e) {
        // Auto start on first keystroke
        if (!isTestRunning && !isTestCompleted) {
            startTest();
        }

        const typedText = input.value;
        const charSpans = paragraph.querySelectorAll(".char");
        const totalChars = currentText.length;

        // Auto extend text if user reached the end
        if (typedText.length >= totalChars - 10) {
            const extension = " " + getRandomParagraph(categorySelect.value, 40);
            currentText += extension;
            renderAdditionalChars(extension);
        }

        correctCharsCount = 0;
        mistakeCount = 0;
        totalKeystrokesCount = typedText.length;

        for (let i = 0; i < charSpans.length; i++) {
            const span = charSpans[i];
            const originalChar = currentText[i];
            const typedChar = typedText[i];

            span.classList.remove("correct", "incorrect", "space-error", "current");

            if (i < typedText.length) {
                if (typedChar === originalChar) {
                    span.classList.add("correct");
                    correctCharsCount++;
                } else {
                    span.classList.add("incorrect");
                    if (originalChar === " ") {
                        span.classList.add("space-error");
                    }
                    mistakeCount++;
                }
            } else if (i === typedText.length) {
                span.classList.add("current");
                scrollArenaToActiveChar(span);
            }
        }

        // Play audio feedback
        const inputType = e.inputType || "";
        if (inputType.includes("delete")) {
            playKeySound("backspace");
        } else {
            const lastChar = typedText[typedText.length - 1];
            if (lastChar === " ") {
                playKeySound("space");
            } else {
                const isMistake = typedText.length > 0 && typedText[typedText.length - 1] !== currentText[typedText.length - 1];
                playKeySound(isMistake ? "error" : "key");
            }
        }

        // Live calculation
        if (isTestRunning && startTime) {
            const elapsedMinutes = Math.max(0.01, (performance.now() - startTime) / 60000);
            const liveWpm = Math.max(0, Math.round((correctCharsCount / 5) / elapsedMinutes));
            const liveAcc = totalKeystrokesCount > 0 ? Math.max(0, Math.min(100, Math.round((correctCharsCount / totalKeystrokesCount) * 100))) : 100;
            const liveCpm = Math.round(correctCharsCount / elapsedMinutes);

            updateHUD(liveWpm, liveAcc, mistakeCount, liveCpm);
        }
    }

    function renderAdditionalChars(extraText) {
        const startIdx = paragraph.querySelectorAll(".char").length;
        extraText.split("").forEach((char, idx) => {
            const span = document.createElement("span");
            span.className = "char";
            span.textContent = char;
            span.id = `char-${startIdx + idx}`;
            paragraph.appendChild(span);
        });
    }

    function scrollArenaToActiveChar(activeSpan) {
        if (!activeSpan || !paragraphBox) return;
        const boxRect = paragraphBox.getBoundingClientRect();
        const spanRect = activeSpan.getBoundingClientRect();

        // If span is below 60% of box height, scroll down smoothly
        if (spanRect.top > boxRect.top + boxRect.height * 0.6) {
            paragraphBox.scrollTop += spanRect.height * 1.5;
        } else if (spanRect.top < boxRect.top + 10) {
            paragraphBox.scrollTop = Math.max(0, paragraphBox.scrollTop - spanRect.height * 2);
        }
    }

    // =========================================================================
    // Reset & Restart Controls
    // =========================================================================
    function restartTest() {
        clearInterval(timerId);
        timerId = null;
        isTestRunning = false;
        isTestCompleted = false;

        totalTime = parseInt(timeSelect.value, 10) || 60;
        timeLeft = totalTime;

        correctCharsCount = 0;
        mistakeCount = 0;
        totalKeystrokesCount = 0;
        wpmSamples = [];

        timeDisplay.innerText = totalTime;
        updateHUD(0, 100, 0, 0);
        updateProgress(0);

        input.value = "";
        input.disabled = false;
        input.focus();

        focusHint.classList.remove("visible");

        loadNewPassage();
        closeModals();
        showToast("🔄 Test reset. Start typing when ready!");
    }

    startBtn.addEventListener("click", () => {
        if (!isTestRunning) {
            startTest();
        } else {
            restartTest();
        }
    });

    restartBtn.addEventListener("click", restartTest);

    newPassageBtn.addEventListener("click", () => {
        if (isTestRunning) restartTest();
        loadNewPassage();
        showToast("🎲 New passage loaded.");
    });

    // Time Selection Change
    timeSelect.addEventListener("change", () => {
        totalTime = parseInt(timeSelect.value, 10) || 60;
        timeLeft = totalTime;
        timeDisplay.innerText = totalTime;
        restartTest();
    });

    // Category Change
    categorySelect.addEventListener("change", () => {
        restartTest();
    });

    // Arena Click / Focus
    typingArena.addEventListener("click", () => {
        input.focus();
        focusHint.classList.remove("visible");
    });

    input.addEventListener("focus", () => {
        focusHint.classList.remove("visible");
    });

    input.addEventListener("blur", () => {
        if (!isTestRunning && !isTestCompleted) {
            focusHint.classList.add("visible");
        }
    });

    // Global Keyboard Shortcuts
    window.addEventListener("keydown", (e) => {
        // Tab + Enter: Instant Restart
        if (e.key === "Tab") {
            e.preventDefault();
            restartTest();
            return;
        }

        // Escape: Close modals
        if (e.key === "Escape") {
            closeModals();
            return;
        }

        // Auto-focus input if typing normal characters
        if (!isTestCompleted && document.activeElement !== input && document.activeElement.tagName !== "INPUT" && document.activeElement.tagName !== "SELECT") {
            if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
                input.focus();
            }
        }
    });

    // =========================================================================
    // Sound & Theme Management
    // =========================================================================
    soundBtn.addEventListener("click", () => {
        const nextIndex = (soundProfiles.indexOf(currentSoundProfile) + 1) % soundProfiles.length;
        currentSoundProfile = soundProfiles[nextIndex];
        localStorage.setItem("soundProfile", currentSoundProfile);
        updateSoundUI();
        playKeySound("key");
        showToast(`🔊 Sound profile: ${currentSoundProfile.toUpperCase()}`);
    });

    function updateSoundUI() {
        const icons = {
            mechanical: "⌨️",
            typewriter: "🖨️",
            pop: "🫧",
            mute: "🔇"
        };
        const labels = {
            mechanical: "Mechanical",
            typewriter: "Typewriter",
            pop: "Bubble Pop",
            mute: "Muted"
        };
        soundIcon.innerText = icons[currentSoundProfile] || "🔊";
        soundLabel.innerText = labels[currentSoundProfile] || "Sound";
    }

    themeBtn.addEventListener("click", () => {
        currentTheme = currentTheme === "dark" ? "light" : "dark";
        localStorage.setItem("theme", currentTheme);
        applyTheme();
        showToast(`🎨 Theme switched to ${currentTheme.toUpperCase()} mode`);
    });

    function applyTheme() {
        if (currentTheme === "light") {
            document.body.classList.add("light-theme");
            themeIcon.innerText = "☀";
            themeLabel.innerText = "Light Mode";
        } else {
            document.body.classList.remove("light-theme");
            themeIcon.innerText = "🌙";
            themeLabel.innerText = "Dark Mode";
        }
        if (chartInstance) {
            drawChart();
        }
    }

    // =========================================================================
    // Leaderboard & History
    // =========================================================================
    function saveBestRecord(wpm) {
        if (wpm > personalBest) {
            personalBest = wpm;
            localStorage.setItem("best", personalBest);
            bestDisplay.innerText = personalBest;
            showToast(`🎉 New Personal Best: ${wpm} WPM!`);
        }
    }

    function saveRecordToHistory(netWpm, rawWpm, accuracy, name) {
        const record = {
            id: Date.now(),
            name: name.trim() || "Typist",
            wpm: netWpm,
            rawWpm: rawWpm,
            accuracy: accuracy,
            duration: totalTime,
            category: categorySelect.value || "all",
            date: new Date().toLocaleDateString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })
        };

        history.push(record);
        // Limit history to 50 items
        if (history.length > 50) history.shift();

        try {
            localStorage.setItem("history", JSON.stringify(history));
        } catch {
            // Storage full handling
        }

        updateLeaderboardTable();
        drawChart();
    }

    function updateLeaderboardTable() {
        if (!leaderboardBody) return;
        leaderboardBody.innerHTML = "";

        totalTestsCount.innerText = `${history.length} Tests Taken`;

        if (history.length === 0) {
            leaderboardBody.innerHTML = `<tr><td colspan="6" class="empty-state">No tests recorded yet. Complete a test to enter the leaderboard!</td></tr>`;
            return;
        }

        // Create sorted copy by WPM descending WITHOUT mutating history array!
        const sorted = [...history].sort((a, b) => b.wpm - a.wpm).slice(0, 10);

        sorted.forEach((item, index) => {
            const rankClass = index === 0 ? "rank-1" : (index === 1 ? "rank-2" : (index === 2 ? "rank-3" : "rank-other"));
            const rankIcon = index === 0 ? "🥇" : (index === 1 ? "🥈" : (index === 2 ? "🥉" : (index + 1)));

            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td><span class="rank-badge ${rankClass}">${rankIcon}</span></td>
                <td><strong>${escapeHTML(item.name || "Typist")}</strong></td>
                <td><span style="color: var(--accent-emerald); font-weight: 700;">${item.wpm}</span> <small>WPM</small></td>
                <td>${item.accuracy}%</td>
                <td><span class="badge-pro" style="font-size:0.65rem;">${item.duration}s</span></td>
                <td style="color: var(--text-muted); font-size: 0.8rem;">${item.date}</td>
            `;
            leaderboardBody.appendChild(tr);
        });
    }

    resetChartBtn.addEventListener("click", () => {
        if (confirm("Are you sure you want to clear your test history and leaderboard?")) {
            history = [];
            localStorage.removeItem("history");
            updateLeaderboardTable();
            drawChart();
            showToast("🧹 Test history cleared.");
        }
    });

    // =========================================================================
    // Chart.js Visualization
    // =========================================================================
    function drawChart() {
        const ctx = document.getElementById("myChart");
        if (!ctx) return;

        if (chartInstance) {
            chartInstance.destroy();
        }

        const isLight = document.body.classList.contains("light-theme");
        const gridColor = isLight ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.08)";
        const textColor = isLight ? "#64748b" : "#94a3b8";

        // Show last 15 tests chronologically
        const displayData = history.slice(-15);
        const labels = displayData.map((_, idx) => `#${idx + 1}`);
        const wpmData = displayData.map(item => item.wpm);
        const accData = displayData.map(item => item.accuracy);

        chartInstance = new Chart(ctx, {
            type: "line",
            data: {
                labels: labels.length ? labels : ["Sample"],
                datasets: [
                    {
                        label: "Speed (WPM)",
                        data: wpmData.length ? wpmData : [0],
                        borderColor: "#6366f1",
                        backgroundColor: "rgba(99, 102, 241, 0.15)",
                        borderWidth: 3,
                        pointBackgroundColor: "#06b6d4",
                        pointRadius: 5,
                        pointHoverRadius: 7,
                        tension: 0.35,
                        fill: true,
                        yAxisID: "y"
                    },
                    {
                        label: "Accuracy (%)",
                        data: accData.length ? accData : [100],
                        borderColor: "#10b981",
                        backgroundColor: "transparent",
                        borderWidth: 2,
                        borderDash: [5, 5],
                        pointRadius: 3,
                        tension: 0.2,
                        yAxisID: "y1"
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: "top",
                        labels: {
                            color: textColor,
                            font: { family: "'Plus Jakarta Sans', sans-serif", weight: "600", size: 12 }
                        }
                    },
                    tooltip: {
                        backgroundColor: isLight ? "#ffffff" : "#1e293b",
                        titleColor: isLight ? "#0f172a" : "#f8fafc",
                        bodyColor: isLight ? "#475569" : "#cbd5e1",
                        borderColor: "rgba(99, 102, 241, 0.3)",
                        borderWidth: 1,
                        padding: 10,
                        displayColors: true
                    }
                },
                scales: {
                    x: {
                        grid: { color: gridColor },
                        ticks: { color: textColor }
                    },
                    y: {
                        type: "linear",
                        display: true,
                        position: "left",
                        title: { display: true, text: "WPM", color: textColor },
                        grid: { color: gridColor },
                        ticks: { color: textColor },
                        suggestedMin: 0
                    },
                    y1: {
                        type: "linear",
                        display: true,
                        position: "right",
                        title: { display: true, text: "Accuracy %", color: textColor },
                        grid: { drawOnChartArea: false },
                        ticks: { color: textColor, max: 100, min: 50 },
                        suggestedMax: 100
                    }
                }
            }
        });
    }

    // =========================================================================
    // Result Modal & Confetti
    // =========================================================================
    function getSkillTier(wpm) {
        if (wpm >= 110) return { label: "⚡ GRANDMASTER TYPIST", title: "Grandmaster" };
        if (wpm >= 85) return { label: "🚀 MASTER TYPIST", title: "Master" };
        if (wpm >= 65) return { label: "🏎️ PRO TYPIST", title: "Pro" };
        if (wpm >= 45) return { label: "💨 INTERMEDIATE", title: "Intermediate" };
        if (wpm >= 25) return { label: "🌱 DEVELOPING", title: "Developing" };
        return { label: "🐣 NOVICE", title: "Novice" };
    }

    function openResultModal(stats) {
        const tier = getSkillTier(stats.netWpm);
        resultRankBadge.innerText = tier.label;

        finalWpm.innerText = stats.netWpm;
        finalRawWpm.innerText = stats.rawWpm;
        finalAccuracy.innerText = stats.accuracy + "%";
        finalKeystrokes.innerText = stats.totalKeystrokes;
        finalMistakes.innerText = stats.mistakes;
        finalConsistency.innerText = stats.consistency + "%";

        typistNameInput.value = localStorage.getItem("lastTypistName") || "";

        resultModal.removeAttribute("hidden");
        launchConfetti();
    }

    saveScoreBtn.addEventListener("click", () => {
        const name = typistNameInput.value.trim() || "Typist";
        localStorage.setItem("lastTypistName", name);

        // Update the last history record name
        if (history.length > 0) {
            history[history.length - 1].name = name;
            try {
                localStorage.setItem("history", JSON.stringify(history));
            } catch {}
            updateLeaderboardTable();
        }
        showToast(`✅ Saved to leaderboard as "${name}"`);
    });

    modalRestartBtn.addEventListener("click", () => {
        closeModals();
        restartTest();
    });

    modalCertBtn.addEventListener("click", () => {
        closeModals();
        openCertificateModal();
    });

    modalCloseBtn.addEventListener("click", closeModals);

    // =========================================================================
    // Certificate Generator Modal
    // =========================================================================
    certificateBtn.addEventListener("click", openCertificateModal);

    function openCertificateModal() {
        const name = localStorage.getItem("lastTypistName") || "Master Typist";
        const wpm = wpmDisplay.innerText !== "0" ? wpmDisplay.innerText : (personalBest || "65");
        const acc = accuracyDisplay.innerText !== "100%" ? accuracyDisplay.innerText : "98%";
        const tier = getSkillTier(parseInt(wpm, 10));

        editCertName.value = name;
        certCandidateName.innerText = name;
        certWpm.innerText = wpm;
        certAccuracy.innerText = acc;
        certRank.innerText = tier.title;

        const options = { year: "numeric", month: "long", day: "numeric" };
        certDate.innerText = new Date().toLocaleDateString(undefined, options);

        certModal.removeAttribute("hidden");
    }

    editCertName.addEventListener("input", (e) => {
        const newName = e.target.value.trim() || "Master Typist";
        certCandidateName.innerText = newName;
        localStorage.setItem("lastTypistName", newName);
    });

    printCertBtn.addEventListener("click", () => {
        window.print();
    });

    closeCertModalBtn.addEventListener("click", closeModals);
    dismissCertBtn.addEventListener("click", closeModals);

    function closeModals() {
        resultModal.setAttribute("hidden", "true");
        certModal.setAttribute("hidden", "true");
    }

    // Close when clicking outside of modal card
    [resultModal, certModal].forEach(overlay => {
        overlay.addEventListener("click", (e) => {
            if (e.target === overlay) {
                closeModals();
            }
        });
    });

    // =========================================================================
    // Lightweight Confetti Particle Engine
    // =========================================================================
    function launchConfetti() {
        if (!confettiCanvas) return;
        const ctx = confettiCanvas.getContext("2d");
        const w = (confettiCanvas.width = confettiCanvas.offsetWidth);
        const h = (confettiCanvas.height = confettiCanvas.offsetHeight);

        const colors = ["#6366f1", "#06b6d4", "#10b981", "#f59e0b", "#ec4899", "#8b5cf6"];
        const particles = [];
        const count = 70;

        for (let i = 0; i < count; i++) {
            particles.push({
                x: w / 2,
                y: h / 2,
                vx: (Math.random() - 0.5) * 12,
                vy: (Math.random() - 0.8) * 10 - 2,
                size: Math.random() * 7 + 4,
                color: colors[Math.floor(Math.random() * colors.length)],
                alpha: 1,
                rotation: Math.random() * 360,
                rotSpeed: (Math.random() - 0.5) * 10
            });
        }

        let animationFrame;
        function updateParticles() {
            ctx.clearRect(0, 0, w, h);
            let active = false;

            particles.forEach(p => {
                p.x += p.vx;
                p.y += p.vy;
                p.vy += 0.22; // gravity
                p.vx *= 0.98; // drag
                p.alpha -= 0.012;
                p.rotation += p.rotSpeed;

                if (p.alpha > 0) {
                    active = true;
                    ctx.save();
                    ctx.globalAlpha = Math.max(0, p.alpha);
                    ctx.translate(p.x, p.y);
                    ctx.rotate((p.rotation * Math.PI) / 180);
                    ctx.fillStyle = p.color;
                    ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
                    ctx.restore();
                }
            });

            if (active) {
                animationFrame = requestAnimationFrame(updateParticles);
            } else {
                ctx.clearRect(0, 0, w, h);
                cancelAnimationFrame(animationFrame);
            }
        }

        updateParticles();
    }

    // =========================================================================
    // Toast Notification System
    // =========================================================================
    function showToast(message) {
        if (!toastContainer) return;
        const toast = document.createElement("div");
        toast.className = "toast";
        toast.innerText = message;
        toastContainer.appendChild(toast);

        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 3000);
    }

    function escapeHTML(str) {
        return str.replace(/[&<>'"]/g, tag => ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            "'": "&#39;",
            "\"": "&quot;"
        }[tag] || tag));
    }

    // =========================================================================
    // Initialization Lifecycle
    // =========================================================================
    function init() {
        applyTheme();
        updateSoundUI();
        loadNewPassage();
        updateLeaderboardTable();
        drawChart();

        // Focus hint
        focusHint.classList.add("visible");
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }

})();