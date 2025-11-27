// Variables pour le timer
var timer;
var timeLeft = 900; // 15 minutes en secondes (15 * 60)

// Variables pour les joueurs
var players = [];
var nextPlayerId = 1;

function formatTime(seconds) {
  var minutes = Math.floor(seconds / 60);
  var secs = seconds % 60;
  return minutes + ":" + (secs < 10 ? "0" : "") + secs;
}

function updateTimer() {
  var timerDisplay = document.getElementById("timer-display");
  if (timerDisplay) {
    timerDisplay.textContent = "Temps: " + formatTime(timeLeft);
  }
}

function addPlayer() {
  var nameInput = document.getElementById("player-name-input");
  var playerName = nameInput.value.trim();

  if (playerName === "") {
    alert("Please enter a player name");
    return;
  }

  var player = {
    id: nextPlayerId++,
    name: playerName,
    points: 0,
  };

  players.push(player);
  nameInput.value = "";
  renderPlayers();
}

function removePlayer(playerId) {
  players = players.filter(function (p) {
    return p.id !== playerId;
  });
  renderPlayers();
}

function addPoints(playerId, points) {
  var player = players.find(function (p) {
    return p.id === playerId;
  });
  if (player) {
    player.points += points;
    renderPlayers();
  }
}

function renderPlayers() {
  var playersList = document.getElementById("players-list");
  playersList.innerHTML = "";

  // Trier les joueurs par points (du plus grand au plus petit)
  var sortedPlayers = players.slice().sort(function (a, b) {
    return b.points - a.points;
  });

  sortedPlayers.forEach(function (player, index) {
    var rank = index + 1;
    var rankEmoji = "";

    // Ajouter des emojis pour le top 3
    if (rank === 1) rankEmoji = "🥇";
    else if (rank === 2) rankEmoji = "🥈";
    else if (rank === 3) rankEmoji = "🥉";

    var playerCard = document.createElement("div");
    playerCard.className = "player-card";
    playerCard.innerHTML = `
      <div class="player-rank">${rankEmoji} #${rank}</div>
      <div class="player-info">
        <h3>${player.name}</h3>
        <p class="player-points">${player.points} points</p>
      </div>
      <div class="player-controls">
        <button class="btn-points btn-minus" onclick="addPoints(${player.id}, -1)">-1</button>
        <button class="btn-points btn-plus" onclick="addPoints(${player.id}, 1)">+1</button>
        <button class="btn-points btn-plus-big" onclick="addPoints(${player.id}, 5)">+5</button>
        <button class="btn-remove" onclick="removePlayer(${player.id})">🗑️</button>
      </div>
    `;
    playersList.appendChild(playerCard);
  });
}

function showAlert(message) {
  var timerContainer = document.getElementById("timer-container");
  var alertDiv = document.getElementById("difficulty-alert");

  // Jouer le son ding pour les alertes de changement de difficulté
  if (message.includes("Change difficulty")) {
    var dingSound = document.getElementById("ding-sound");
    if (dingSound) {
      dingSound.currentTime = 0;
      dingSound.volume = 1.0;
      dingSound.play().catch(function (error) {
        console.log("Erreur lecture ding:", error);
      });
    }
  }

  if (!alertDiv) {
    alertDiv = document.createElement("div");
    alertDiv.id = "difficulty-alert";

    // Détecter la taille d'écran
    var isMobile = window.innerWidth <= 768;
    var isSmallMobile = window.innerWidth <= 480;
    var isTinyMobile = window.innerWidth <= 375;

    var padding = isTinyMobile
      ? "20px 25px"
      : isSmallMobile
      ? "25px 30px"
      : isMobile
      ? "30px 40px"
      : "40px 70px";
    var fontSize = isTinyMobile
      ? "20px"
      : isSmallMobile
      ? "24px"
      : isMobile
      ? "28px"
      : "36px";
    var borderWidth = isMobile ? "3px" : "4px";
    var borderRadius = isMobile ? "20px" : "25px";

    alertDiv.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: linear-gradient(135deg, #E94A52 0%, #EE7719 100%);
      color: #FCF4E9;
      padding: ${padding};
      border-radius: ${borderRadius};
      font-size: ${fontSize};
      font-weight: 800;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
      z-index: 10000;
      text-align: center;
      border: ${borderWidth} solid #FFD104;
      font-family: 'Poppins', sans-serif;
      max-width: 90%;
      width: auto;
      line-height: 1.3;
    `;
    document.body.appendChild(alertDiv);
  }

  alertDiv.textContent = message;
  alertDiv.style.display = "block";

  // Ajouter l'animation de pulsation
  timerContainer.style.animation = "shake 0.5s ease-in-out";

  setTimeout(function () {
    alertDiv.style.display = "none";
    timerContainer.style.animation = "fadeIn 0.8s ease-out";
  }, 3000);
}

function startTimer() {
  if (timer) {
    clearInterval(timer);
  }

  timeLeft = 900; // 15 minutes
  updateTimer();

  timer = setInterval(function () {
    timeLeft--;
    updateTimer();

    // Alerte à 10 minutes (5 min écoulées)
    if (timeLeft === 600) {
      showAlert("⚠️ Change difficulty! ⚠️");
    }

    // Alerte à 5 minutes (10 min écoulées)
    if (timeLeft === 300) {
      showAlert("⚠️ Change difficulty! ⚠️");
    }

    if (timeLeft <= 0) {
      clearInterval(timer);
      var timerDisplay = document.getElementById("timer-display");
      if (timerDisplay) {
        timerDisplay.textContent = "Time's out!";
      }

      // Jouer le son gong à la fin du timer
      var gongSound = document.getElementById("gong-sound");
      if (gongSound) {
        gongSound.currentTime = 0;
        gongSound.volume = 1.0;
        gongSound.play().catch(function (error) {
          console.log("Erreur lecture gong:", error);
        });

        // Arrêter le son après 5 secondes
        setTimeout(function () {
          gongSound.pause();
          gongSound.currentTime = 0;
        }, 5000);
      }

      showAlert("🎉 Time's out ! 🎉");
    }
  }, 1000);
}

// Attacher l'événement au bouton
document.addEventListener("DOMContentLoaded", function () {
  var startBtn = document.getElementById("start-timer-btn");
  if (startBtn) {
    startBtn.addEventListener("click", startTimer);
  }

  var addPlayerBtn = document.getElementById("add-player-btn");
  if (addPlayerBtn) {
    addPlayerBtn.addEventListener("click", addPlayer);
  }

  var playerNameInput = document.getElementById("player-name-input");
  if (playerNameInput) {
    playerNameInput.addEventListener("keypress", function (e) {
      if (e.key === "Enter") {
        addPlayer();
      }
    });
  }

  renderPlayers();

  // Ajouter le style simple
  var style = document.createElement("style");
  style.textContent = `
    #players-container {
      background: #FCF4E9;
      padding: 40px;
      border-radius: 30px;
      width: 450px;
      max-height: 90vh;
      overflow-y: auto;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    }
    
    #players-container h2 {
      color: #2E52A0;
      font-size: 28px;
      font-weight: 800;
      margin-bottom: 30px;
      text-align: center;
    }
    
    #add-player-section {
      display: flex;
      gap: 12px;
      margin-bottom: 30px;
    }
    
    #player-name-input {
      flex: 1;
      padding: 15px 20px;
      border: 2px solid #2E52A0;
      border-radius: 12px;
      font-size: 16px;
      font-family: 'Inter', sans-serif;
      outline: none;
      transition: all 0.3s;
    }
    
    #player-name-input:focus {
      border-color: #EE7719;
      box-shadow: 0 0 0 3px rgba(238, 119, 25, 0.1);
    }
    
    #add-player-btn {
      padding: 15px 30px;
      background: #FFD104;
      color: #2E52A0;
      border: none;
      border-radius: 12px;
      font-weight: 700;
      font-size: 16px;
      cursor: pointer;
      transition: all 0.3s;
      white-space: nowrap;
    }
    
    #add-player-btn:hover {
      background: #EE7719;
      transform: scale(1.05);
    }
    
    .player-card {
      background: white;
      padding: 20px;
      border-radius: 15px;
      margin-bottom: 15px;
      border: 2px solid #2E52A0;
      position: relative;
      transition: all 0.3s;
    }
    
    .player-card:hover {
      transform: translateX(5px);
      box-shadow: 0 5px 20px rgba(46, 82, 160, 0.2);
    }
    
    .player-rank {
      position: absolute;
      top: 15px;
      right: 20px;
      font-size: 18px;
      font-weight: 700;
      color: #EE7719;
      background: #FFD104;
      padding: 6px 14px;
      border-radius: 20px;
    }
    
    .player-info h3 {
      color: #2E52A0;
      margin: 0 0 10px 0;
      font-size: 20px;
      font-weight: 700;
      padding-right: 80px;
    }
    
    .player-points {
      color: #EE7719;
      font-size: 24px;
      font-weight: 800;
      margin: 0 0 15px 0;
    }
    
    .player-controls {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
    }
    
    .btn-points {
      padding: 10px 20px;
      border: none;
      border-radius: 10px;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.2s;
      font-size: 16px;
    }
    
    .btn-minus {
      background: #E94A52;
      color: #FCF4E9;
    }
    
    .btn-minus:hover {
      background: #c0392b;
      transform: scale(1.1);
    }
    
    .btn-plus {
      background: #EE7719;
      color: #FCF4E9;
    }
    
    .btn-plus:hover {
      background: #d35400;
      transform: scale(1.1);
    }
    
    .btn-plus-big {
      background: #FFD104;
      color: #2E52A0;
      font-weight: 800;
    }
    
    .btn-plus-big:hover {
      background: #f39c12;
      transform: scale(1.1);
    }
    
    .btn-remove {
      background: #E94A52;
      color: #FCF4E9;
      border: none;
      padding: 10px 16px;
      border-radius: 10px;
      cursor: pointer;
      font-size: 18px;
      margin-left: auto;
      transition: all 0.2s;
    }
    
    .btn-remove:hover {
      background: #c0392b;
      transform: scale(1.15);
    }
    
    .btn-points:active, .btn-remove:active {
      transform: scale(0.95);
    }
  `;
  document.head.appendChild(style);
});
