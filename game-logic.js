
let rules = {
  size:{
    value: "5x5",
    options:["3x3", "4x4", "5x5", "6x6", "7x7", "8x8", "9x9"],
    title: "Board Size",
    desc: "How many squares do you want your board to have?"
  },
  players:{
    value: 2,
    options:[1, 2, 3, 4],
    title: "Players",
    desc: "How many (human) players do you want your game to have?"
  }, 
  toWin:{
    value: 3,
    options:[3, 4, 5],
    title: "Number needed to win",
    desc: "How many peices do you need to line up to win the match?"
  }, 
  flick:{
    value: "no",
    options:["no", "once per game", "twice per game"],
    title: "Flick oppoents peices",
    desc: "Are you allowed to flick your opponents peices off the board?"
  }, 
  overwrite:{
    value: "no",
    options:["no", "once per game"],
    title: "Overwrite opponents peices?",
    desc: "Are you allowed to overwrite your opponents peices?"
  }, 
  peicesPerTurn:{
    value: 1,
    options:[1,2],
    title: "Pieces per turn",
    desc: "How many peices can you place per turn?"
  }, 
};


// player object = named (string) token(string) num(int)
// boxObj object = posY (int) posX (int) owned(player object) node(html dom node)



let gridObj = {};
let gridDom = ''

let boardSize = 0

let players = [];
let currentPlayer2 = '';
let tokens = ["x", "o", "triangle", "square"];

let state = "play";
let turn = 1;


