let board = document.getElementById("board"), //mine
    arr = [],
    recovery = [],
    players = ["x", "o"],
    player = "x",
    pl1 = document.getElementById("name1"),
    pl2 = document.getElementById("name2"),
    rows = Number(localStorage.getItem("sizevalue")),
    fix = String("repeat(" + rows + ",1fr)"),
    myLength = 0,
    mySound = new sound("clickS.wav"),
    score1=0,
    score2=0,
    lowestGame=100,
    clock = document.getElementById("stopwatch"),
    msec = 0,
    hr = 0,
    min = 0,
    sec = 0,
    timerState = false;
if (!(score1>0) && !(score2>0)){
  score1=0, score2=0;
}

pl1.innerText = "(X) " + localStorage.getItem("textvalue1");
pl2.innerText = "(O) " + localStorage.getItem("textvalue2");
document.getElementById("board").style.gridTemplateColumns = fix;

function updateScore(){
  score1 = (Number(localStorage.getItem("score1")) + score1);
  document.getElementById("score1").innerText = score1;
  localStorage.setItem("score1", score1);

  score2 = (Number(localStorage.getItem("score2")) + score2);
  document.getElementById("score2").innerText = score2;
  localStorage.setItem("score2", score2);

  return
}

function checkLowest(num){
   if (num<lowestGame){
     lowestGame=num
     document.getElementById("lowest").innerText=lowestGame
   }
}

function timer() {
  if (timerState) {
    msec++;
    if (msec == 100) {
      sec++;
      msec = 0;
    }
    if (sec == 60) {
      min++;
      sec = 0;
    }
    if (min == 60) {
      hr++;
      min = 0;
      sec = 0;
    }
    if (sec < 10 && min < 10 && hr < 10) {
      clock.innerHTML = `0${hr}:0${min}:0${sec}:${msec}`;
    } else if (min < 10 && hr < 10) {
      clock.innerHTML = `0${hr}:0${min}:${sec}:${msec}`;
    } else if (hr < 10) {
      clock.innerHTML = `0${hr}:${min}:${sec}:${msec}`;
    } else {
      clock.innerHTML = `${hr}:${min}:${sec}:${msec}`;
    }
    setTimeout("timer()", 10);
  }
}

function stopTimer() {
  (hr = 0), (min = 0), (sec = 0), (msec = 0);
  clock.innerHTML = "00:00:00:0";
  timerState = false;
}

function startTimer() {
  (hr = 0), (min = 0), (sec = 0), (msec = 0);
  clock.innerHTML = "00:00:00:0";
  timerState = true;
  timer();
}

function startGame() {
  startTimer();
  arr=[]
  recovery=[]
  for (i = 0; i < rows * rows; i++) {
    let elem = document.createElement("div");
    elem.className = "cell";
    board.appendChild(elem);
    elem.id = i;
    elem.onclick = click;
  }
}

function restartGame() {location.replace("./game.html");}

function backStep() {
  let step = recovery[recovery.length - 1];
  let cellToRemove = document.getElementById(step);
  cellToRemove.classList.remove("check");
  cellToRemove.innerText = "";
  player == "x" ? (player = "o") : (player = "x");
  arr.pop();
  recovery.pop();
}

function sound(src) {
  this.sound = document.createElement("audio");
  this.sound.src = src;
  this.play = function () {
    this.sound.play();
  };
}

function click(event) {
  mySound.play();
  let v = event.target;
  let id = event.target.id;
  arr[id] = player;
  recovery.push(id);
  v.innerText = player;
  v.style.backgroundImage=`url(${player}.PNG)`;
  let myLength=arr.reduce((v,i)=>(i)?v+1:v,0);
  if (myLength >= rows) {
    check();
  }
  v.classList.add("check");
  player == "x" ? (player = "o") : (player = "x");
}

let winTable2 = [];
function winTable() {
  for (i = 0; i < rows * 2 + 2; i += rows) {
    if (i < rows) {
      let horizon = [];
      for (n = 0; n < rows * rows; n++) {
        horizon.push(n);
      }
      while (horizon.length) {
        winTable2.push(horizon.splice(0, rows));
      }
    }
    if (i == rows) {
      for (n = 0; n < rows; n++) {
        let z = range2(n, rows);
        winTable2.push(z);
      }
    }
    if (i == rows * 2) {
      let diagonal1 = range3(0, rows);
      winTable2.push(diagonal1);
      let diagonal2 = range4(rows - 1, rows);
      winTable2.push(diagonal2);
    }
  }
}

winTable();
function win() {
  let x = document.createElement("DIV");
  let t = document.createTextNode(player + " wins this round!");
  x.className = "win";
  x.appendChild(t);
  document.body.appendChild(x);
}
function check() {
  for (i of winTable2) {
    let temp = [];
    for (n in i) {
      temp.push(arr[i[n]]);
      if (temp.length == rows) {
        if (temp.every((element) => element == player)) {
          if(player=="x"){
            score1+=1;
            document.createElement("div");
            updateScore();
            // alert(player + " wins this round!");

          }
          if(player=="o"){
            score2+=1;
            updateScore();
            // alert(player + " wins this round!");
          }
          checkLowest(arr.reduce((v,i)=>(i)?v+1:v,0));
          stopTimer();
          board.classList.add("check");
          win();
          setTimeout(()=>{
            restartGame();
          }, 3000)
        }
      }
    }
  }
}

function range2(start, rows) {
  return Array(rows)
    .fill()
    .map((_, idx) => start + idx * rows);
}

function range3(start, rows) {
  return Array(rows)
    .fill()
    .map((_, idx) => start + idx * (rows + 1));
}

function range4(start, rows) {
  return Array(rows)
    .fill()
    .map((_, idx) => start + idx * (rows - 1));
}

startGame();