window.onload = function (e) {
  
  // Load dom
  gridDom = document.querySelector("grid");
  body = document.querySelector("body");
  wrapper = document.querySelector("#wrapper");
  settings = document.querySelector("settings");
  startButton = document.querySelector("#start");

  //🧹
  refreshBoard();
  formatRulesPage();


  //connect up startbutton
  startButton.addEventListener("click", function(){
    startGame();
  }, false);

};



//🎬
const startGame = function(){
  refreshBoard();
  panCamera('showGrid');
  state = "play";
};

const panCamera = function(dest){
  //leave arg blank to pan back to menu/ rules
  wrapper.className = dest;
}


const drawGame = function(){
  console.log("draw game");
  panCamera(' ');
}

const win = function(matches){
  console.log( currentPlayer.named + " won!");
  matches.forEach(match => {
    let box = gridObj[match[0]][match[1]];
    box.node.classList.add('winningBox')
  
  });
  panCamera(' ');
}




//🧹
const refreshBoard = function(){
  //set boardSize to an int based on value in rules
  boardSize = parseInt(rules.size.value.charAt(0)); 
  createGrid();
  createPlayers();
  turn = 0;
  maxTurns = boardSize * boardSize;
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
  console.log("ℹ️ Clicked on box " + boxObj.posY + boxObj.posX )
  if (!state === "play") return 
  else {
    if (boxObj.owned === ''){
      boxObj.owned = currentPlayer.num;
      boxObj.node.classList.add(currentPlayer.token);
      checkVictory(boxObj); //this should be updated to return t/f
      if(turn === (maxTurns -1)) drawGame();
      else{
        turn++
        currentPlayer = players[turn % players.length];
        body.id = `hover${currentPlayer.token}`;
      } 
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
      return true;
    } else{
      y = moveOnAxis(y, ydir, 1);
      x = moveOnAxis(x, xdir, 1);
      if (!isBoxInsideBoard(y, x)) break;
      if (!isBoxAMatch(gridObj[y][x])) break;
    }
  }
  // once a non-match is found or we hit edge of board,
  // check back in opposite direction from end point
  cache = [ ]; 
  for(let m = 0; m < rules.toWin.value+1; m++ ){
    if (m > 0) cache.push([y,x]); //skip first cache, starting square isn't match
    if (m >= rules.toWin.value){
     win(cache);
     return true;
    } else {
      y = moveOnAxis(y, ydir, -1);
      x = moveOnAxis(x, xdir, -1);
      if (!isBoxInsideBoard(y, x)) break;
      if (!isBoxAMatch(gridObj[y][x])) break;
    }
  }
};

const moveOnAxis = function(a, adir, direction){
  //a = either x or y
  if (direction == 1) return a + adir 
  else return a - adir; 
}

const isBoxInsideBoard = function(y, x){
  if (y > boardSize -1 || y < 0 || x > boardSize -1 || x < 0){
    return false
  } else return true
}

const isBoxAMatch = function(obj){
  const player = currentPlayer;
  const playerNum = player.num
  if (obj.owned === playerNum) return true
  else return false
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
    }
  }
};


const disableRule = function(rule, value){
  const radioEl = document.getElementById(`${rule}${value}`);
  if (radioEl.checked == true){
    const defaultStr= rules[rule].default
    const defaultRuleId = `${rule}${defaultStr}`
    radioEl.checked = false;
    document.getElementById(defaultRuleId).checked = true;
  }; 
  radioEl.className = 'disabled';
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
    }else if (attr.charAt(0) === "^") {
      attrObj.type = attrValue;
    }else if (attr.charAt(0) === "$") {
      attrObj.name = attrValue;
    }else if (attr.charAt(0) === "4") {
    attrObj.for = attrValue;
  }
  });
  for (key in attrObj) {
    el.setAttribute(key, attrObj[key]);
  } return el;
};


