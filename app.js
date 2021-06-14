function getRandomValue(max, min) {
  return Math.floor(Math.random() * (max - min)) + min;
}

const app = Vue.createApp({
  data() {
    return {
      timerEnabled: true,
      timerCount: 20,
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
    timeUp() {
      return this.timerCount;
    }

  },
  watch: {
    timerEnabled(value) {
      if (value) {
        setTimeout(() => {
          this.timerCount--;
        }, 1000);
      }
    },

    timerCount: {
      handler(value) {
        if (value > 0 && this.timerEnabled) {
          setTimeout(() => {
            this.timerCount--;
          }, 1000);
        } else if (value <= 0 && this.monsterHealth <= 0 && this.playerHealth <= 0) {
          this.winner = "draw";
        } else if (value <= 0 && this.playerHealth <= 0) {
          this.winner = "monster";
        } else if (value <= 0 && this.monsterHealth <= 0) {
          this.winner = "player";

        } else {
          this.winner = "timeUp";
        }



      },
      immediate: true, // This ensures the watcher is triggered upon creation
    },



    playerHealth(value) {
      if (value <= 0 && this.monsterHealth <= 0) {
        //draw

        this.winner = "draw";

      } else if (value <= 0) {
        //player lost

        this.winner = "monster";

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
        return (this.healsleft = 0);
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

      this.healsleft = 3;
      this.timerCount = 20;

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
