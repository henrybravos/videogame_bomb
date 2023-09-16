const canvas = document.querySelector("#game");
const spnLives = document.querySelector("#lives");
const spnLevel = document.querySelector("#level");
const btnUp = document.querySelector("#up");
const btnDown = document.querySelector("#down");
const btnRight = document.querySelector("#right");
const btnLeft = document.querySelector("#left");
const ctxGame = canvas.getContext("2d");
const posPlayer = {
  x: undefined,
  y: undefined,
};
const posWin = {
  x: undefined,
  y: undefined,
};
let elementSize;
const ELEMENT_SIZE = 10;
let level = 0,
  lives = 3,
  canvasSize;

/**
 * Method to render Game after: start game, change position, a collision
 */
function renderGame(numElements) {
  if (window.innerHeight > window.innerWidth) {
    canvasSize = window.innerWidth * 0.75;
  } else {
    canvasSize = window.innerHeight * 0.75;
  }
  elementSize = Math.floor(canvasSize / numElements) - 1;
  canvas.setAttribute("width", canvasSize);
  canvas.setAttribute("height", canvasSize);
  ctxGame.textAlign = "center";
  ctxGame.font = `${elementSize}px Verdana`;
  if (level >= maps.length) {
    level = 0;
    console.log("MAPS not found");
    return;
  }
  const map = maps[level]
    .trim()
    .split("\n")
    .map((element) => element.trim().split(""));

  map.forEach((row, y) => {
    row.forEach((col, x) => {
      //POSITION START GAME
      if (col === "O") {
        if (posPlayer.x === undefined && posPlayer.y === undefined) {
          posPlayer.x = x;
          posPlayer.y = y;
        }
      }
      //POSITION WIN GAME
      if (col === "I") {
        posWin.x = x;
        posWin.y = y;
      }
      //POSITION COLLISION GAME
      if (col === "X") {
        if (posPlayer.x === x && posPlayer.y === y) {
          setTimeout(() => {
            renderLoseLevel(
              elementSize * (x + 1) - elementSize / 2,
              elementSize * (y + 1) - elementSize / 10
            );
          }, 10);
        }
      }
      ctxGame.fillText(
        emojis[col],
        elementSize * (x + 1) - elementSize / 2,
        elementSize * (y + 1) - elementSize / 10
      );
    });
  });
  if (posPlayer.x === undefined || posPlayer.y === undefined) {
    console.log("Map not have the correct struct");
    return;
  }
  renderPlayer(
    elementSize * (posPlayer.x + 1) - elementSize / 2,
    elementSize * (posPlayer.y + 1) - elementSize / 10
  );
  renderInfo();
}

/**
 * render info bottom
 */
function renderInfo() {
  spnLives.innerHTML = emojis.HEART.repeat(lives);
  spnLevel.innerHTML = `${level + 1}/${maps.length}`;
}

/**
 * render the player in the game canvas
 * @param {number} x horizontal position
 * @param {number} y vertical position
 */
function renderPlayer(x, y) {
  ctxGame.fillText(emojis.PLAYER, x, y);
  if (posPlayer.x === posWin.x && posPlayer.y === posWin.y) {
    //change LEVEL
    if (level + 1 === maps.length) {
      console.log("FINISH");
      return;
    }
    level++;
    renderWin();
  }
}

/**
 * render BOMB COLLISION, --LEVEL
 * @param {number} x Position in horizontal
 * @param {number} y Position in vertical
 */
function renderLoseLevel(x, y) {
  ctxGame.font = `${elementSize * 2}px Verdana`;
  ctxGame.fillText(emojis.BOMB_COLLISION, x, y);
  ctxGame.font = `${elementSize}px Verdana`;
  if (lives > 1) {
    lives--;
  } else {
    lives = 3;
    if (level) {
      level--;
    }
  }
  posPlayer.x = undefined;
  posPlayer.y = undefined;
  setTimeout(() => {
    renderGame(ELEMENT_SIZE);
  }, 1000);
}

function renderWin() {
  console.log("WINN!");
  ctxGame.clearRect(0, 0, canvasSize, canvasSize);
  ctxGame.textAlign = "center";
  ctxGame.fillText("next level", canvasSize / 2, canvasSize / 2);
  setTimeout(() => {
    renderGame(ELEMENT_SIZE);
  }, 1000);
}

/**
 * move player to Up, too check if stay in box
 */
function moveUp() {
  if (posPlayer.y > 0) {
    posPlayer.y -= 1;
    renderGame(ELEMENT_SIZE);
  }
}

/**
 * move player to Down, too check if stay in box
 */
function moveDown() {
  if (posPlayer.y < ELEMENT_SIZE - 1) {
    posPlayer.y += 1;
    renderGame(ELEMENT_SIZE);
  }
}

/**
 * move player to Right, too check if stay in box
 */
function moveRight() {
  if (posPlayer.x < ELEMENT_SIZE - 1) {
    posPlayer.x += 1;
    renderGame(ELEMENT_SIZE);
  }
}

/**
 * move player to Left, too check if stay in box
 */
function moveLeft() {
  if (posPlayer.x > 0) {
    posPlayer.x -= 1;
    renderGame(ELEMENT_SIZE);
  }
}

/**
 * event to move player according key press
 * @param {KeyboardEvent} e event when up key
 */
function onKeyUp(e) {
  switch (e.key) {
    case "ArrowRight":
      moveRight();
      break;
    case "ArrowLeft":
      moveLeft();
      break;
    case "ArrowDown":
      moveDown();
      break;
    case "ArrowUp":
      moveUp();
      break;
  }
}

window.addEventListener("load", () => renderGame(ELEMENT_SIZE));
window.addEventListener("resize", () => renderGame(ELEMENT_SIZE));
window.addEventListener("keyup", onKeyUp);
btnUp.onclick = moveUp;
btnDown.onclick = moveDown;
btnLeft.onclick = moveLeft;
btnRight.onclick = moveRight;
