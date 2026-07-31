const paragraph = document.getElementById("paragraph");
const input = document.getElementById("input");

const timeDisplay = document.getElementById("time");
const wpmDisplay = document.getElementById("wpm");
const accuracyDisplay = document.getElementById("accuracy");
const mistakesDisplay = document.getElementById("mistakes");
const bestDisplay = document.getElementById("best");

const startBtn = document.getElementById("startBtn");
const restartBtn = document.getElementById("restartBtn");
const themeBtn = document.getElementById("themeBtn");
const soundBtn = document.getElementById("soundBtn");
const certificateBtn = document.getElementById("certificateBtn");

const progressBar = document.getElementById("progressBar");
const timeSelect = document.getElementById("timeSelect");

let timer;
let totalTime = 60;
let timeLeft = 60;
let started = false;

let correctChars = 0;
let mistakes = 0;
let sound = true;

let history = JSON.parse(localStorage.getItem("history")) || [];

bestDisplay.innerText =
localStorage.getItem("best") || 0;

loadParagraph();

function startGame(){

if(started) return;

started=true;

totalTime=parseInt(timeSelect.value);

timeLeft=totalTime;

timeDisplay.innerText=timeLeft;

input.disabled=false;

input.value="";

input.focus();

timer=setInterval(updateTimer,1000);

}

function updateTimer(){

timeLeft--;

timeDisplay.innerText=timeLeft;

let progress=((totalTime-timeLeft)/totalTime)*100;

progressBar.style.width=progress+"%";

if(timeLeft<=0){

clearInterval(timer);

finishGame();

}

}

function finishGame(){

input.disabled=true;

started=false;

let words=input.value.trim().split(/\s+/).filter(Boolean).length;

let minutes=totalTime/60;

let wpm=Math.round(words/minutes);

let accuracy=0;

if(input.value.length>0){

accuracy=Math.round((correctChars/input.value.length)*100);

}

wpmDisplay.innerText=wpm;

accuracyDisplay.innerText=accuracy+"%";

mistakesDisplay.innerText=mistakes;

saveBest(wpm);

saveHistory(wpm,accuracy);

updateLeaderboard();

drawChart();

alert("Test Completed");

}

input.addEventListener("input",checkTyping);

function checkTyping(){

let original=paragraph.innerText;

let typed=input.value;

correctChars=0;

mistakes=0;

for(let i=0;i<typed.length;i++){

if(typed[i]===original[i]){

correctChars++;

}else{

mistakes++;

}

}

mistakesDisplay.innerText=mistakes;

let accuracy=0;

if(typed.length>0){

accuracy=Math.round((correctChars/typed.length)*100);

}

accuracyDisplay.innerText=accuracy+"%";

let words=typed.trim().split(/\s+/).filter(Boolean).length;

let elapsed=(totalTime-timeLeft)/60;

let wpm=elapsed>0?Math.round(words/elapsed):0;

wpmDisplay.innerText=wpm;

}
// ================================
// Restart Button
// ================================

restartBtn.addEventListener("click", () => {

    clearInterval(timer);

    started = false;
    correctChars = 0;
    mistakes = 0;

    totalTime = parseInt(timeSelect.value);
    timeLeft = totalTime;

    timeDisplay.innerText = totalTime;
    wpmDisplay.innerText = "0";
    accuracyDisplay.innerText = "100%";
    mistakesDisplay.innerText = "0";

    progressBar.style.width = "0%";

    input.value = "";
    input.disabled = true;

    loadParagraph();

});

// ================================
// Theme Toggle
// ================================

themeBtn.addEventListener("click", () => {

    document.body.classList.toggle("dark");

    if(document.body.classList.contains("dark")){
        themeBtn.innerHTML = "☀ Light Mode";
    }else{
        themeBtn.innerHTML = "🌙 Dark Mode";
    }

});

// ================================
// Sound Button
// ================================

soundBtn.addEventListener("click", () => {

    sound = !sound;

    if(sound){
        soundBtn.innerHTML = "🔊 Sound ON";
    }else{
        soundBtn.innerHTML = "🔇 Sound OFF";
    }

});

// ================================
// Start Button
// ================================

startBtn.addEventListener("click", startGame);

// ================================
// Best Score
// ================================

function saveBest(score){

    let best = localStorage.getItem("best");

    if(best == null || score > Number(best)){

        localStorage.setItem("best", score);

        bestDisplay.innerText = score;

    }

}

// ================================
// Save History
// ================================

function saveHistory(wpm, accuracy){

    history.push({
        wpm: wpm,
        accuracy: accuracy
    });

    localStorage.setItem(
        "history",
        JSON.stringify(history)
    );

}

// ================================
// Leaderboard
// ================================

function updateLeaderboard(){

    const table = document.getElementById("leaderboard");

    table.innerHTML = "";

    history.sort((a,b)=>b.wpm-a.wpm);

    history.slice(0,10).forEach((item,index)=>{

        table.innerHTML += `

        <tr>

            <td>${index+1}</td>

            <td>${item.wpm}</td>

            <td>${item.accuracy}%</td>

        </tr>

        `;

    });

}

updateLeaderboard();
// ================================
// Chart.js
// ================================

let chart;

function drawChart() {

    const ctx = document.getElementById("myChart");

    const labels = history.map((item, index) => "Test " + (index + 1));

    const data = history.map(item => item.wpm);

    if(chart){
        chart.destroy();
    }

    chart = new Chart(ctx, {

        type: "line",

        data: {

            labels: labels,

            datasets: [{

                label: "Typing Speed (WPM)",

                data: data,

                borderWidth: 3,

                tension: .3,

                fill: false

            }]

        },

        options: {

            responsive: true,

            plugins: {

                legend: {

                    display: true

                }

            }

        }

    });

}

// ================================
// Certificate
// ================================

certificateBtn.addEventListener("click", () => {

    const wpm = wpmDisplay.innerText;

    const accuracy = accuracyDisplay.innerText;

    const win = window.open("", "_blank");

    win.document.write(`
        <html>

        <head>

        <title>Certificate</title>

        <style>

        body{

            font-family:Arial;

            text-align:center;

            padding:80px;

        }

        h1{

            color:#2563eb;

        }

        h2{

            margin-top:30px;

        }

        </style>

        </head>

        <body>

        <h1>Typing Speed Test Certificate</h1>

        <hr>

        <h2>Congratulations!</h2>

        <h3>You completed the Typing Speed Test.</h3>

        <p><b>Speed :</b> ${wpm} WPM</p>

        <p><b>Accuracy :</b> ${accuracy}</p>

        <br>

        <p>Date : ${new Date().toLocaleDateString()}</p>

        </body>

        </html>
    `);

    win.print();

});

// ================================
// Random Paragraph
// ================================

function newParagraph(){

    loadParagraph();

}

timeSelect.addEventListener("change",()=>{

    totalTime=parseInt(timeSelect.value);

    timeLeft=totalTime;

    timeDisplay.innerText=totalTime;

});

// ================================
// Sound Effect
// ================================

input.addEventListener("keypress",()=>{

    if(!sound) return;

    const audio=new Audio(
        "https://actions.google.com/sounds/v1/foley/click.ogg"
    );

    audio.play();

});

// ================================
// Initialize
// ================================

window.onload=()=>{

    loadParagraph();

    updateLeaderboard();

    drawChart();

    bestDisplay.innerText=
    localStorage.getItem("best") || 0;

}