window.onload = function (e) {

  gridDom = document.querySelector("grid");
  



  createGrid();
  createPlayers();
  console.log(currentPlayer());
};



// ------------------------------------------------
  // 🔨 Actions

const currentPlayer = function(){
  return players[turn % players.length];
}

const boxClicked = function(boxObj){
  //stage of game play? 
  console.log("ℹ️ Clicked on box " + boxObj.posY + boxObj.posX )
  if (!state === "play") return 
  else {
    if (!boxObj.owned){
      const thisPlayer = currentPlayer();
      boxObj.owned = thisPlayer.num;
      boxObj.node.classList.add(thisPlayer.token);
      if (!checkVictory(boxObj)){
        turn++
      } else win();
    } 
  }
  //state of the square?
  //
}


const createPlayers = function(){
  for (let i = 0; i < rules.players.value; i++) { 
    let thisPlayer = {
      named: `Player ${i}`,
      token: tokens[i],
      num: i
    }
    players.push(thisPlayer);
  }
}

const checkVictory = function(obj){
  const directions = [[-1, 0],[-1,1],[0,1],[1,1],[1,0],[1,-1],[0,-1],[-1,-1]]; 
  directions.forEach(dir => 
    probeMatches(obj.posY, obj.posX, dir[0], dir[1]));
}

const probeMatches = function(y1, x1, ydir, xdir){
  console.log("y " + ydir + " x: " + xdir)
  let y = y1;
  let x = x1;
  // check for X matchs in one direction
  for(let m = 1; m < rules.toWin.value+1; m++ ){
    if (m >= rules.toWin.value) win();
    y = moveOnAxis(y, ydir, 1);
    x = moveOnAxis(x, xdir, 1);
    if (!isBoxInsideBoard(y, x)) break;
    if (!isMatch(gridObj[y][x])) break;
  }
  // once a non match is found or we hit edge of board,
  // check back in opposite direction from end point  
  for(let m = 0; m < rules.toWin.value+1; m++ ){
    if (m >= rules.toWin.value) win();
    y = moveOnAxis(y, ydir, -1);
    x = moveOnAxis(x, xdir, -1);
    if (!isBoxInsideBoard(y, x)) break;
    if (!isMatch(gridObj[y][x])) break;
  }
};

//a = either x or y
const moveOnAxis = function(a, adir, direction){
  if (direction == 1) return a + adir 
  else return a - adir; 
}

const isBoxInsideBoard = function(y, x){
  if (y > boardSize -1 || y < 0 || x > boardSize -1 || x < 0){
    return false
  } else return true
}

const isMatch = function(obj){
  const player = currentPlayer();
  const playerNum = player.num
  if (obj.owned === playerNum){ 
    console.log("box " + obj.posX + " " + obj.posY + " is match "); 
    return true}
  else {
    console.log("box " + obj.posX + " " + obj.posY + " not match "); 
    return false} 
}

const win = function(){
  console.log("You won!");
  createGrid();
}

//listener to update player when a turn passes js?


// ------------------------------------------------
  // 🔨 FUNCTIONS TO MAKE GRID OBJECTS AND HTML

  const createGrid = function () {
    gridDom.innerHTML = " "; //clear inner html of grid
    boardSize = parseInt(rules.size.value.charAt(0)); //set board size as int based on rules
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
      const boxNode = makeNode("box", nodeId, `box${row} ${box}`);
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
      attrObj.class = cl ? cl + " " + attrValue : attrValue;}});
  for (key in attrObj) {
    el.setAttribute(key, attrObj[key]);
  } return el;
};


