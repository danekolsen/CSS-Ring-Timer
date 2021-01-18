//Todos v1.0
//Fix number and bell icon placement
//Setup tracker for number of sessions completed, with data stored in cookie
//Make responsive
//Light/Dark mode
//Use Grid for responsiveness

//Todos future versions
//Decide how to fill in hour ring with only one hour on clock
//Fix hour ring visibility on countdown
//Setup different color themes with css variables and allow user to choose themes
//Sound library with choices for user?
//Move code into React component
//Publish as npm package

//INITIALIZE ALL GLOBAL VARIABLES
var ringTimer;
var cyclesComplete = 0;
var hourDeg = 0;
var secDeg = 0;
var minDeg = 0;
var pomoStart = 30;
var pomoMin = 30;
var pomoSec = 0;
var timerRunning = false;
var incDeg = 360 / pomoStart;
var infoShow = false;

//PUT ALL NEEDED ELEMENTS IN VARIABLES FOR CLEAN CODE
var hourText = document.getElementById("hourText");
var minuteText = document.getElementById("minuteText");
var secondText = document.getElementById("secondText");
// var hourRing = document.getElementById('hourRing')
var minuteRing = document.getElementById("minuteRing");
var secondRing = document.getElementById("secondRing");
var clockBtn = document.getElementById("clock-btn");
var sound = document.getElementById("myAudio");
var plusBtn = document.getElementById("plus");
var minusBtn = document.getElementById("minus");
var counter = document.getElementById("counter");
var info = document.getElementById("info");
var infoMod = document.getElementById("info-mod");
var checks = document.getElementById("checks");

// var hourRingColor = getComputedStyle(document.documentElement).getPropertyValue('--hour-ring-color')
var minuteRingColor = getComputedStyle(
  document.documentElement
).getPropertyValue("--minute-ring-color");
var secondRingColor = getComputedStyle(
  document.documentElement
).getPropertyValue("--second-ring-color");
var ringBgColor = getComputedStyle(document.documentElement).getPropertyValue(
  "--body-color"
);

//SET HEIGHT AND WIDTH FOR CLOCK RINGS

function setClockSize() {
  var clock = document.getElementById("ringClock");
  console.log("element width is: " + clock.clientWidth);
  let root = document.documentElement;
  // root.style.setProperty('--hour-ring-size', (clock.clientWidth *1)+'px')
  root.style.setProperty("--min-ring-size", clock.clientWidth * 0.9 + "px");
  root.style.setProperty("--sec-ring-size", clock.clientWidth * 0.8 + "px");
  root.style.setProperty("--front-ring-size", clock.clientWidth * 0.7 + "px");
}

//SHOW/HIDE INFO
info.addEventListener("click", showInfo);

function showInfo() {
  infoShow = !infoShow;
  if (infoShow == true) {
    infoMod.style.visibility = `visible`;
    infoMod.classList.add("animated", "fadeInLeft", "faster");
  } else {
    infoMod.classList.remove("fadeInLeft");
    infoMod.classList.add("fadeOutLeft");
    setTimeout(function() {
      infoMod.style.visibility = `hidden`;
      infoMod.classList.remove("animated", "fadeOutLeft", "faster");
    }, 500);
  }
}

//FUNCTION FOR CHANGING THE CLOCK USING THE + OR - BUTTONS
function changeTime(sign) {
  //Stops clock from going below zero
  if ((pomoMin == 0 || pomoStart == 0) && sign == "-") {
    console.log("Can't set clock below zero!");
  } else {
    if (timerRunning == true) {
      if (pomoMin > pomoStart) {
        if (sign == "+") {
          pomoMin += 1;
          minuteRing.style.background = `#222222`;
          minDeg = 0;
          incDeg = 360 / pomoMin;
        } else if (sign == "-") {
          pomoMin -= 1;
          minDeg += incDeg;
          minuteRing.style.background = `conic-gradient(#5f27cd ${minDeg}deg, #222222 0)`;
        }
      } else {
        if (sign == "+") {
          pomoMin += 1;
          minDeg -= incDeg;
          minuteRing.style.background = `conic-gradient(#5f27cd ${minDeg}deg, #222222 0)`;
        } else if (sign == "-") {
          pomoMin -= 1;
          minDeg += incDeg;
          minuteRing.style.background = `conic-gradient(#5f27cd ${minDeg}deg, #222222 0)`;
        }
      }
    } else {
      if (sign == "+") {
        pomoStart += 1;
        pomoMin += 1;
        incDeg = 360 / pomoStart;
      } else if (sign == "-") {
        pomoStart -= 1;
        pomoMin -= 1;
        incDeg = 360 / pomoStart;
      }
    }
    clockSet();
  }
}

//SWITCHES THE TIMER ON AND OFF
function clockSwitch() {
  timerRunning ? reset() : start();
  timerRunning = !timerRunning;
}

//SETS START/STOP BUTTON PROPERTIES
function setButton(state) {
  if (state == "start") {
    clockBtn.innerText = "Stop";
    clockBtn.style.backgroundColor = "red";
  } else if (state == "reset") {
    clockBtn.innerText = "Reset";
    clockBtn.style.backgroundColor = "#222222";
  } else if (state == "stop") {
    clockBtn.innerText = "Start";
    clockBtn.style.backgroundColor = "#2ed573";
  }
}

function start() {
  if (pomoStart == 0 && pomoSec == 0) {
    timerEnding();
  } else {
    pomoSec = 60;
    pomoMin = pomoStart - 1;
    ringTimer = setInterval(function() {
      countDown();
    }, 100);
    setButton("start");
    minuteRing.style.background = `#222222`;
    secondRing.style.background = `#222222`;
    // hourRing.style.background = '#222222'
  }
}

function countDown() {
  if (pomoSec == 0 && pomoMin == 0) {
    clearInterval(ringTimer);
    timerEnding();
  } else if (pomoSec == 0) {
    pomoMin -= 1;
    pomoSec = 59;
    minDeg += incDeg;
    secondRing.style.background = `#222222`;
    minuteRing.style.background = `conic-gradient(#5f27cd ${minDeg}deg, #222222 0)`;
    secDeg = 0;
  } else {
    pomoSec -= 1;
    secDeg += 6;
    secondRing.style.background = `conic-gradient(#54a0ff ${secDeg}deg, #222222 0)`;
  }
  clockSet();
}

function timerEnding() {
  minuteRing.style.background = `#5f27cd`;
  secondRing.style.background = `#54a0ff`;
  document.getElementById("pomo").style.visibility = `hidden`;
  document.getElementById("bellIcon").style.visibility = `visible`;
  document
    .getElementById("bellIcon")
    .classList.add("animated", "infinite", "flash", "slow");
  sound.play();
  setButton("reset");
  plusBtn.disabled = true;
  minusBtn.disabled = true;
  cyclesComplete += 1;
  checks.insertAdjacentHTML(
    "beforeend",
    '<i class="material-icons md-36 animated bounceIn slow">check_circle_outline</i>'
  );
  if (cyclesComplete % 5 == 0) {
    checks.insertAdjacentHTML("beforeend", "<br>");
  }
  checks.scrollTop = checks.scrollHeight;
}

function reset() {
  clearInterval(ringTimer);
  pomoMin = pomoStart;
  pomoSec = 0;
  secDeg = 0;
  minDeg = 0;
  clockSet();
  setButton("stop");
  document
    .getElementById("bellIcon")
    .classList.remove("animated", "infinite", "flash", "slow");
  document.getElementById("bellIcon").style.visibility = `hidden`;
  document.getElementById("pomo").style.visibility = `visible`;
  minuteRing.style.background = `#222222`;
  secondRing.style.background = `#222222`;
  // hourRing.style.background = '#222222'
  plusBtn.disabled = false;
  minusBtn.disabled = false;
  sound.pause();
  sound.currentTime = 0;
}

//SETS CLOCK TEXT
function clockSet() {
  var tempMin;
  if (pomoMin < 10 || pomoMin % 60 < 10) {
    tempMin = "0" + (pomoMin % 60);
  } else if (pomoMin % 60 >= 10) {
    tempMin = pomoMin % 60;
  } else {
    tempMin = pomoMin;
  }
  hourText.innerText = `${
    pomoMin >= 60 ? "0" + Math.floor(pomoMin / 60) : "00"
  }h`;
  hourText.style.opacity = `${pomoMin >= 60 ? "1" : "0"}`;
  // hourRing.style.visibility = pomoMin >= 60 ? 'visible': 'hidden'
  minuteText.innerText = tempMin + "m";
  secondText.innerText = `${pomoSec > 9 ? pomoSec : "0" + pomoSec}s`;
}

//INITIALIZES CLOCK ON PAGE LOAD
clockSet();
setClockSize();
