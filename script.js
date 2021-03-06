window.onload = function (e) {
  
  // Load dom
  gridDom = document.querySelector("grid");
  body = document.querySelector("body");
  wrapper = document.querySelector("#wrapper");
  settings = document.querySelector("settings");
  startButton = document.querySelector("#start");
  endButton = document.querySelector("#end");
  info = document.querySelector("section");
  turnWinDisplay = document.querySelector("#turnWinInfo");
  turnTokens = document.querySelector("#turnTokens");
  underRug = document.querySelector(".underRug");
  //🧹
  refreshBoard();
  formatRulesPage();


  // preload sounds
  soundRef.forEach((name) => {
    sounds[name] = new Audio(`assets/sound/${name}.wav`);
  } )

  // preload images
  preloadImages.forEach((name) => {
    const img = makeNode('img', '.preload', '');
    img.src = `assets/${name}`;
    underRug.append(img);
  } )

  //connect up buttons
  startButton.addEventListener("click", function(){
    startGame();
    playSound('start');
  }, false);
  endButton.addEventListener("click", function(){
    playSound('back');
    updateDisabledRules();
    gameState = 0;
    panCamera('');
  }, false);
};



//🎬
const startGame = function(){
  refreshBoard();
  panCamera('showGrid');
  gameState = 1;
  endButton.className = '';
};

const panCamera = function(dest){
  //leave arg blank to pan back to menu/ rules
  wrapper.className = dest;
}

const drawGame = function(){
  playSound('draw');
  gameState = 0;
  endButton.className = 'gameEnd';
}

const win = function(matches){
  playSound('win');
  gameState = 0;
  matches.forEach(match => {
    let box = gridObj[match[0]][match[1]];
    box.node.classList.add('winningBox')
  });
  endButton.className = 'gameEnd';
}




//🧹
const refreshBoard = function(){
  //set boardSize to an int based on value in rules
  boardSize = parseInt(rules.size.value.charAt(0)); 
  createGrid();
  createPlayers();
  turn = 0;
  maxTurns = boardSize * boardSize;
  buildInfoPannel();
}


// players
const createPlayers = function(){
  players = [];
  for (let i = 0; i < rules.players.value; i++) { 
    player = playerFactory(`Player ${i+1}`, tokens[i], i);
    players.push(thisPlayer)};
  currentPlayer = players[0];
  updateUiPlayerTokens();
}

const playerFactory = function(named, token, num){
  return thisPlayer = {
    named: named,
    token: token,
    num: num
  }
}

const updateUiPlayerTokens = function(){
  body.id = `hover${currentPlayer.token}`;
}

const boxClicked = function(boxObj){
  //stage of game play? 
  if (!gameState) return; 
  if (boxObj.owned === ''){
    playSound(currentPlayer.token);
    boxObj.owned = currentPlayer.num;
    boxObj.node.classList.add(currentPlayer.token);
    checkVictory(boxObj); //this should be updated to return t/f
    if(turn === (maxTurns -1)) drawGame();
    else{
      turn++
      currentPlayer = players[turn % players.length];
      body.id = `hover${currentPlayer.token}`;
      updateTurnWinDisplay();
    } 
  }
}


//--------------------------------------------------
// Check for matches/ win

const checkVictory = function(obj){
  for (let i = 0; i < directions8.length; i++){
    const dir = directions8[i];
    if (probeMatches(obj.posY, obj.posX, dir[0], dir[1])){
      return true;
    }
  }
}

const probeMatches = function(y1, x1, ydir, xdir){
  let y = y1;
  let x = x1;
  let cache = [ ];
  // check for X matches in one direction
  for(let m = 1; m < rules.toWin.value+1; m++ ){
    cache.push([y,x]);
    if (m >= rules.toWin.value) {
      win(cache); 
      return true;}
      y = moveOnAxis(y, ydir, 1);
      x = moveOnAxis(x, xdir, 1);
      if (!isBoxInsideBoard(y, x)) break;
      if (!isBoxAMatch(gridObj[y][x])) break;
  }
  // once a non-match is found or we hit edge of board,
  // check back in opposite direction from end point
  cache = [ ]; 
  for(let m = 0; m < rules.toWin.value+1; m++ ){
    if (m > 0) cache.push([y,x]); //skip first cache, starting square isn't match
    if (m >= rules.toWin.value){
     win(cache);
     return true;}
    y = moveOnAxis(y, ydir, -1);
    x = moveOnAxis(x, xdir, -1);
    if (!isBoxInsideBoard(y, x)) break;
    if (!isBoxAMatch(gridObj[y][x])) break;
  }
}


const moveOnAxis = function(a, adir, direction){
  //a = either x or y
  if (direction == 1) return a + adir;
  return a - adir; 
}

const isBoxInsideBoard = function(y, x){
  if (y > boardSize -1 || y < 0 || x > boardSize -1 || x < 0){
    return false
  } return true
}

const isBoxAMatch = function(obj){
  const player = currentPlayer;
  return obj.owned === player.num 
}



//--------------------------------------------------
// Rules screen
const formatRulesPage = function(){
  for (const rule in rules) {
    const thisRule = rules[rule];
    const heading = makeNode('h2', ``, `${thisRule.title}`);
    const container = makeNode('div', `#${rule} .setting`, ' ' );
    container.append(heading, makeRuleForm(thisRule, rule));
    settings.append(container);
  }
  selectDefaultRules();
  updateDisabledRules();
}


const makeRuleForm = function(thisRule, name){
  const div = makeNode('div', `.options`, ` `);
  for (let i in thisRule.options) {
    const option = thisRule.options[i];
    const id = `${name}${option}`
    const radio = makeNode('input', `^radio $${name} #${id}`, ``);
    const radioLabel = makeNode('label', `4${id}`, `${option}`);
    radio.addEventListener("click", function(){
      playSound('button');
      changeRule(name, option);}, false);
    div.append(radio, radioLabel);
  }
  return div;
}


const changeRule = function(rule, newValue){
  rules[rule].value = newValue;
  refreshBoard();
  updateDisabledRules();
}


const selectDefaultRules = function(){
  for (const rule in rules) {
    const thisRule = rules[rule];
    const radioId = `${rule}${thisRule.value}`
    document.getElementById(radioId).checked = true;
  }
}


const updateDisabledRules = function(){
  //Reset disabled rules
  const radios = document.querySelectorAll('input');
  for(radio of radios){ radio.classList.remove('disabled')} 
  //Disable new rules based on board size
  if (boardSize < 6){
    disableRule("players", 4);
    disableRule("toWin", 5);
    if (boardSize < 5){
      disableRule("players", 3);
      disableRule("toWin", 4);
    }}
};


const disableRule = function(rule, value){
  const radioEl = document.getElementById(`${rule}${value}`);
  if (radioEl.checked == true){
    const defaultOptionStr = rules[rule].default;
    const defaultRuleId = `${rule}${defaultOptionStr}`
    rules[rule].value = defaultOptionStr;
    radioEl.checked = false;
    document.getElementById(defaultRuleId).checked = true;
  }; 
  radioEl.className = 'disabled';
}



const playSound = function(sound){
  sounds[sound].currentTime = 0;
  sounds[sound].play();
}

//listener to update player when a turn passes js?


// ------------------------------------------------
  // 🔨 FUNCTIONS TO MAKE GRID OBJECTS AND HTML

  const createGrid = function () {
    gridDom.innerHTML = " "; //clear inner html of grid
    for (let row = 0; row < boardSize; row++) { //make rows of boxes
        gridObj[row] = {}; // add a row child obj in the grid obj
        gridDom.append(makeNode("row", `#row${row}`, "")); //add html node to dom
        const rowDom = document.querySelector(`#row${row}`);
        createBoxes(row, rowDom);
    };
  };


const createBoxes = function (row, rowDom) {
  for (let box = 0; box < boardSize; box++) {
      const nodeId = `#box${row}${box}`;
      const boxTokenDiv = makeNode("token", " ", " ");
      const boxNode = makeNode("box", nodeId, boxTokenDiv);
      boxNode.addEventListener("click", function(){
          boxClicked(gridObj[row][box]);
      }, false);
      rowDom.append(boxNode);
      gridObj[row][box] = {
          posX: box,
          posY: row,
          owned: '',
          node: document.querySelector(nodeId) 
      };
  };
}


// -----
// funcitons to make info pannel html

const buildInfoPannel = function(){
  updateTurnWinDisplay();
  buildTurnTokens();
}

const updateTurnWinDisplay = function(){
  const turnSpan = makeNode("span", '.turnPannel', `Turn ${turn} `);
  const winSpan = makeNode("span", '.win', `${rules.toWin.value} to win`);
  turnWinDisplay.innerHTML = '';
  turnWinDisplay.append(turnSpan, winSpan);
}

const buildTurnTokens = function(){
  turnTokens.innerHTML = '';

  players.forEach((player) => { 
    console.log(makeNode("div", `.turn .${player.token}`, ``))
    const tokenImg = makeNode("div", `.turn .${player.token}`, ``);
    turnTokens.append(tokenImg);
  } );
}


// ------------------------------------------------
  // 🔨 FUNCTIONS TO MAKE DOM ELEMENTS
  
// 🏭
// factory to make a html node | based loosly on https://bit.ly/3qE9WB8
const makeNode = function (type, attributes, ...content) {
  let el = makeElement(type, attributes);
  content.forEach((child) => {
    if (typeof child === "string") {
      el.innerHTML = child;
      // used to be: el.appendChild(document.createTextNode(child));
    } else el.append(child);
  }); return el;
};


// 🏭
// factory to turn '.class .class #id' into attributes
const makeElement = function (type, attributes) {
  let el = document.createElement(type);
  const attrArray = attributes.split(" ");
  let attrObj = {};
  // once i learn regex can probably reduce this to a couple lines
  attrArray.forEach((attr) => {
    let attrValue = attr.slice(1);
    if (attr.charAt(0) === "#") {
      attrObj.id = attrValue;
    } else if (attr.charAt(0) === ".") {
      const cl = attrObj.class;
      attrObj.class = cl ? cl + " " + attrValue : attrValue;
    } else if (attr.charAt(0) === "^") {
      attrObj.type = attrValue;
    } else if (attr.charAt(0) === "$") {
      attrObj.name = attrValue;
    } else if (attr.charAt(0) === "4") {
    attrObj.for = attrValue;
  }
  });
  for (key in attrObj) {
    el.setAttribute(key, attrObj[key]);
  } return el;
};


