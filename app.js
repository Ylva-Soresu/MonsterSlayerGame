/*
//Define vars to hold time values
let seconds = 0;
let minutes = 0;
let hours = 0;

//Define vars to hold "display" value
let displaySeconds=0;
let displayMinutes=0;
let displayHours=0;

//define var to hold setInterval() function
let interval = null;
//define var to hold stopwatch status
let status="stopped";

function stopwatch() {
  seconds++;
  if (seconds / 60 === 1) {
    seconds = 0;
    minutes++;
  
  if (minutes / 60 === 1) {
    minutes = 0;
    hours++;
  }
}

//If seconds/minutes/hours are only one digit, add a leading = to the value
if(seconds < 10){
displaySeconds="0" + seconds.toString();
}
else{
  displaySeconds=seconds
}
if(minutes < 10){
  displayMinutes="0" + minutes.toString();
  }
  else{
    displayMinutes=minutes
  }

  if(hours < 10){
    displayHours ="0" + hours.toString();
  }
  else{
    displayHours = hours;
  }


  //Display updated time values to user
  document.getElementById("tracker").innerHTML = displayHours +":"+ displayMinutes +":"+ displaySeconds;

}

window.setInterval(stopWatch, 1000);

function startStop(){

  if(status === "stopped"){

    //start the stop watch
    interval = window.setInterval(stopwatch, 1000);
    document.getElementById("start").innerHTML = "Fight!";
    status ="started";
  }
 
}
*/
function getRandomValue(max, min) {
  return Math.floor(Math.random() * (max - min)) + min;

}

const app = Vue.createApp({
  data() {
    return {
      playerHealth: 100,
      monsterHealth: 100,
      currentRound: 0,
      winner: null,
      logMessages: [],
      healsleft: 3,
    };
  },
  computed: {
    monsterBarStyles() {
      if (this.monsterHealth <= 0) {
        return { width: "0%" };
      }
      return { width: this.monsterHealth + "%" };
    },
    playerBarStyles() {
      if (this.playerHealth <= 0) {
        return { width: "0%" };
      }
      return { width: this.playerHealth + "%" };
    },
    mayUseSpecialAttack() {
      return this.currentRound % 3 !== 0;
    },
    mayUseHeal() {

      return this.healsleft <= 0;

    },
  },
  watch: {
    playerHealth(value) {
      if (value <= 0 && this.monsterHealth <= 0) {
        //draw
        this.winner = "draw";
      } else if (value <= 0) {
        //player lost
        this.winner = "monster";
        this.healsleft++
      }
    },
    monsterHealth(value) {
      if (value <= 0 && this.playerHealth <= 0) {
        //draw
        this.winner = "draw";
      } else if (value <= 0) {
        //monster lost
        this.winner = "player";
      }
    },
  },
  methods: {
    attackMonster() {
      this.currentRound++;
      const attackValue = getRandomValue(17, 12);
      this.monsterHealth -= attackValue;

      this.battleLogMessage("player", "attack", attackValue);
      this.attackPlayer();
    },
    specialAttackMonster() {
      this.currentRound++;
      const attackValue = getRandomValue(33, 27);
      this.monsterHealth -= attackValue;

      this.battleLogMessage("player", "special-attack", attackValue);
      this.attackPlayer();
    },
    attackPlayer() {
      const attackValue = getRandomValue(19, 15);
      this.playerHealth -= attackValue;
      this.battleLogMessage("monster", "attack", attackValue);
    },
    healPlayer() {
      this.healsleft--;
      const healValue = getRandomValue(25, 18);

      if (this.playerHealth + healValue >= 100) {
        this.playerHealth = 100;
      } else {
        this.playerHealth += healValue;
      }
      if (this.healsleft < 0) {
        return this.healsleft = 0;
      }
      this.battleLogMessage("player", "heal", healValue);
      this.attackPlayer();
    },
    shield() {
      this.currentRound++;
      const attackValue = getRandomValue(15, 15);
      this.playerHealth += attackValue;

      this.battleLogMessage("player", "shield", attackValue);
      this.attackPlayer();
      if (attackValue === 15 && this.attackPlayer.attackValue === 15) {
        this.currentRound++;
      }
    },
    surrender() {
      this.winner = "monster";
    },

    startNewGame() {
      this.playerHealth = 100;
      this.monsterHealth = 100;
      this.winner = null;
      this.currentRound = 0;
      this.logMessages = [];
      this.timer = 0;
      this.healsleft = 3;
     /* window.clearInterval(interval);
      seconds=0;
      minutes=0;
      hours=0;
      document.getElementById("tracker").innerHTML="00:00:00";
      document.getElementById("startStop").innerHTML="Start the Timer";
      */
    },

    battleLogMessage(who, what, value) {
      this.logMessages.unshift({
        actionBy: who,
        actionType: what,
        actionValue: value,
      });
    },
  },
});

app.mount("#game");
