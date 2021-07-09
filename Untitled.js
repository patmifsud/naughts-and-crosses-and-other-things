function checkForVictory(row,col){
    if(getAdj(row,col,0,1)+getAdj(row,col,0,-1) > 2){
      return true;
    } else {
      if(getAdj(row,col,1,0) > 2){
        return true;
      } else {
        if(getAdj(row,col,-1,1)+getAdj(row,col,1,-1) > 2){
          return true;
        } else {
          if(getAdj(row,col,1,1)+getAdj(row,col,-1,-1) > 2){
            return true;
          } else {
            return false;
          }
        }
      }
    }
  }
  
  function getAdj(row,col,row_inc,col_inc){
    if(cellVal(row,col) == cellVal(row+row_inc,col+col_inc)){
      return 1+getAdj(row+row_inc,col+col_inc,row_inc,col_inc);
    } else {
      return 0;
    }
  }
  
  function cellVal(row,col){
    if(gameField[row] == undefined || gameField[row][col] == undefined){
      return -1;
    } else {
      return gameField[row][col];
    }
  }





const checkForMatch = function(boxObj, perimiter){
    //will check ring of boxes for same token as player token
    const radius = perimiter -1; 
    const boxesToCheck = traceRadius(1, boxObj.posY, boxObj.posX);
    return false
  }
  
  const traceRadius = function(radius, y, x){
    //returns array of box objects in given radius when inside grid
    const invRadius = (rules.winCondition.value - radius);
    const top = ((y - invRadius) < boardSize ? (y - invRadius) : '');
    const bottom = ((y + invRadius) >= 0 ? (y + invRadius) : '');
    const right = ((x + invRadius) < boardSize ? (x + invRadius) : '');
    const left = ((x - invRadius) >= 0 ? (x - invRadius) : '');
    console.log(`top ${top}, bottom ${bottom}, left ${left}, right ${right}`);
    return [`top ${top}, bottom ${bottom}, left ${left}, right ${right}`];
  }
  




  const endY = (ydir < 0 ? y1 - yir : y1 + ydir );
  const endX = (xdir < 0 ? x1 - xdir : x1 + xdir );
  i++;
  console.log(endY + " " + endX);
  if (isBoxInsideBoard(endY, endX)){
    if (isMatch(gridObj[endY][endX])){
      console.log("it matches!")
   } else {
    return false
   }
  }