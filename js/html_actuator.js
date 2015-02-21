function HTMLActuator() {
  this.tileContainer    = document.querySelector(".tile-container");
  this.scoreContainer   = document.querySelector(".score-container");
  this.bestContainer    = document.querySelector(".best-container");
  this.messageContainer = document.querySelector(".game-message");
  
  this.logo				= document.getElementById("logo");

  this.score = 0;
}

HTMLActuator.prototype.actuate = function (grid, metadata) {
  var self = this;
  
  switch(metadata.level){
		case 1:self.logo.style.backgroundImage  = "url(img/sheep.gif)";break;
		case 2:self.logo.style.backgroundImage  = "url(img/dog.png)";break;
		case 3:self.logo.style.backgroundImage  = "url(img/bossxu.png)";break;
		default:self.logo.style.backgroundImage = "url(img/what.png)";
 }

  window.requestAnimationFrame(function () {
    self.clearContainer(self.tileContainer);

    grid.cells.forEach(function (column) {
      column.forEach(function (cell) {
        if (cell) {
          self.addTile(cell);
        }
      });
    });

    self.updateScore(metadata.score);
    self.updateBestScore(metadata.bestScore);
	
	

    if (metadata.terminated) {
      if (metadata.over) {
        self.message(false,metadata.score,metadata.level,metadata.noticeTimes); // You lose
      } else if (metadata.won) {
        self.message(true,metadata.score,metadata.level,metadata.noticeTimes); // You win!
      }
    }

  });
};

// Continues the game (both restart and keep playing)
HTMLActuator.prototype.continueGame = function () {
  this.clearMessage();
};

HTMLActuator.prototype.clearContainer = function (container) {
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }
};

HTMLActuator.prototype.addTile = function (tile) {
  var self = this;

  var wrapper   = document.createElement("div");
  var inner     = document.createElement("div");
  var position  = tile.previousPosition || { x: tile.x, y: tile.y };
  var positionClass = this.positionClass(position);

  // We can't use classlist because it somehow glitches when replacing classes
  var classes = ["tile", "tile-" + tile.value, positionClass];

  if (tile.value > 2048) classes.push("tile-super");

  this.applyClasses(wrapper, classes);

  inner.classList.add("tile-inner");
  inner.textContent = tile.value;

  if (tile.previousPosition) {
    // Make sure that the tile gets rendered in the previous position first
    window.requestAnimationFrame(function () {
      classes[2] = self.positionClass({ x: tile.x, y: tile.y });
      self.applyClasses(wrapper, classes); // Update the position
    });
  } else if (tile.mergedFrom) {
    classes.push("tile-merged");
    this.applyClasses(wrapper, classes);

    // Render the tiles that merged
    tile.mergedFrom.forEach(function (merged) {
      self.addTile(merged);
    });
  } else {
    classes.push("tile-new");
    this.applyClasses(wrapper, classes);
  }

  // Add the inner part of the tile to the wrapper
  wrapper.appendChild(inner);

  // Put the tile on the board
  this.tileContainer.appendChild(wrapper);
};

HTMLActuator.prototype.applyClasses = function (element, classes) {
  element.setAttribute("class", classes.join(" "));
};

HTMLActuator.prototype.normalizePosition = function (position) {
  var map = [
    [{r: 2, theta: 120}, {r: 2, theta: 90}, {r: 2, theta: 60}],
    [{r: 2, theta: 150}, {r: 1, theta: 120}, {r: 1, theta: 60}, {r: 2, theta: 30}],
    [{r: 2, theta: 180}, {r: 1, theta: 180}, {r: 0, theta: 0}, {r: 1, theta: 0}, {r: 2, theta: 0}],
    [{r: 2, theta: 210}, {r: 1, theta: 240}, {r: 1, theta: 300}, {r: 2, theta: 330}],
    [{r: 2, theta: 240}, {r: 2, theta: 270}, {r: 2, theta: 300}],
  ]
  return map[position.y][position.x];
};

HTMLActuator.prototype.positionClass = function (position) {
  position = this.normalizePosition(position);
  return "tile-position-" + position.r + "-" + position.theta;
};

HTMLActuator.prototype.updateScore = function (score) {
  this.clearContainer(this.scoreContainer);

  var difference = score - this.score;
  this.score = score;

  this.scoreContainer.textContent = this.score;

  if (difference > 0) {
    var addition = document.createElement("div");
    addition.classList.add("score-addition");
    addition.textContent = "+" + difference;

    this.scoreContainer.appendChild(addition);
  }
};

HTMLActuator.prototype.updateBestScore = function (bestScore) {
  this.bestContainer.textContent = bestScore;
};

HTMLActuator.prototype.message = function (won,score,level,noticeTimes) {
  var type    = won ? "game-won" : "game-over";
  var message;
  if(!won){
	switch(level){
	 case 2:message = "恭喜你超越花姐的最低水平，领先" + (score-44972) + "分";break;
	 case 3:message = "恭喜你超越花姐的最高水平，领先" + (score-120880) + "分";break;
	 default: message = "失败！离花姐的最低水平还有" + (44972-score) +"分，请继续努力！";
	}
  }
  else if(level === 1) message = "小有成就，解锁小羊logo";
  else if(level===2) message = "达到花姐的最低水平！解锁花姐的狗logo";
  else message = "达到花姐的最高水平！解锁花姐的徐总logo";

  this.messageContainer.classList.add(type);
  this.messageContainer.getElementsByTagName("p")[0].textContent = message;
};

HTMLActuator.prototype.clearMessage = function () {
  // IE only takes one value to remove at a time.
  this.messageContainer.classList.remove("game-won");
  this.messageContainer.classList.remove("game-over");
};
