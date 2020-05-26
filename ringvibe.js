import { input, state, loop, view } from "./engine/screenstate.js"
import * as utils from "./engine/bc/utils.js"
import * as music from "./engine/js/music.js"
import * as jslix from "./engine/js/jslix.js"

export const name = "RINGVIBE"
let action = false
let atrig = 0
let cancel = false
let ctrig = 0

let i = 0
let j = 0

let rotate = 0
let save = 0
let level = 0
let rwidth = 15
let rings = []
let rx = []
let ry = []
let exp = []
let ex = []
let ey = []
let es = []
let ra = []

let movey = 0
let movex = 0
let windx = 0
let windy = 0
let spawn = 0
let windcount = 0

// +positive for active rings
// -negative for selected rings
// 0 for destroyed rings

export function init(){

  ra.push(-1)
  music.addSong("maptick.wav")
  jslix.addImage("rtitle.png")

}

export function update(){

  // This handles the action presses
  if (input.ACTION) {
    action = true
    atrig += 1;
  }else if(action){
    action = false
    atrig = 0;
  }

  // This handles the cancel presses
  if (input.CANCEL) {
    cancel = true
    ctrig += 1;
  }else if(cancel){
    ctrig = 0
    cancel = false
  }

  // What to do when the game just starts
  if(ra[0] <= 0){
    if(ra[0] < 0){
      for(i = 0; i < rings.length; i++){
        if(rings[i] > 0)
          rings[i] *= -1
        if(rings[i] != 0)
          createExp(rings[i], rx[i], ry[i])
      }

      // Reset all the ring actions
      ra = []
      // [0]Score, [1]Time, [2]Level, [3]Timebar, [4]Scoreholder, [5]TimeHolder
      ra.push(0, 500, 0, 1000, 0, 0)
      // [6]movex, [7]movey, [8]windx, [9]windy, [10]spawn, [11]windcount
      ra.push(0, 0, 0, 0, 0, 0)
      // [12]link, [13]delay, [14]diff, [15]drain,
      ra.push(0, 500, 0, 0)

      // Reset all the rings
      rings = []
      rx = []
      ry = []

      for(i = 0; i < 7; i++){
        createRing(i, i*60, i*40+75)
      }
    }

    rx[1] = rx[4] = (view.sizex/2)
    rx[0] = rx[5] = (view.sizex/3)
    rx[2] = rx[3] = (2*view.sizex/3)
    ry[0] = ry[2] = (view.sizey/3)
    ry[3] = ry[5] = (2*view.sizey/3)
    ry[1] = (view.sizey/5)
    ry[4] = (4*view.sizey/5)
  }

  // Rotate the ring
  rotate = rotate%360
  rotate += (ra[6] + ra[7])/2 == 0 ?
            (ra[6] + ra[7] < 0 ? -1 : 1) :
            (ra[6] + ra[7]);

  // Ring spawn sequence
  if(ra[0] > 0){
    ra[10] = parseInt((Math.random()*view.sizex)-(view.sizex/2))
    if(ra[7] != 0 && ra[10] >= 0 && ra[10] < (view.sizex/40)){
      createRing(parseInt(Math.random()*6)+1,
                ra[10]*40, (ra[7] > 0) ? -100 : view.sizey+100)
    }else if(ra[6] != 0 && ra[10] < 0 && ra[10] > -(view.sizey/40)){
      createRing(parseInt(Math.random()*6)+1,
                (ra[6] > 0) ? -100 : view.sizex+100, -(ra[10]*40)+1)
    }
  }

  // Wind change sequence
  if(ra[8] == 0 && ra[9] == 0){
    ra[8] = parseInt(Math.random()*11)-6
    ra[9] = parseInt(Math.random()*11)-6
    ra[11] = 0
  }

  // Let's do some maintenance
  if(ra[0] > 0){
    if(ra[11]++%25 == 0){
      if(ra[6] != ra[8])
        ra[6] += (ra[6] < ra[8]) ? 1 : -1
      if(ra[7] != ra[9])
        ra[7] += (ra[7] < ra[9]) ? 1 : -1
      if(ra[13] < ra[1]){
        //ra[15] += 1
        ra[15] = ra[2]+1
      }
      ra[13] -= ra[14]
    }
    ra[13] -= ra[12]
    if(ra[13] < ra[1]){
      ra[1] -= ra[15]
    }else{
      ra[15] = 0
    }
    if(ra[11] > 1000){
	     ra[8] = ra[9] = 0;
       ra[14] += 1
	  }
  }

  // This increases the time bar every level
  for(i = 1000, j = 0; i <= ra[1]; i*=2, j++);
  if(i > ra[3]){
    ra[3] = i;
    ra[2] = j;
  }

  // Tracks to see if a ring was missed
  let miss = true;

  // Main loop for rings
  for(i = 0; i < rings.length; i++){

    // If it is a real ring
    if (rings[i] > 0){
      // We will react a certain way if a ring is selected
      if(atrig == 1 && input.MOUSEX > rx[i]-(5*rwidth/3) &&
                  input.MOUSEX < rx[i]+(5*rwidth/3) &&
                  input.MOUSEY > ry[i]-(5*rwidth/3) &&
                  input.MOUSEY < ry[i]+(5*rwidth/3)){
          //change ring to selected
          //if(!music.isSongOn())
            //music.loopSong(rings[i]%2)
            //music.playSong(0)
          ra[4] += ((rings[i]-1)%6+1)*10;
	        ra[5] += (6-((rings[i]-1)%6))*10;
          ra[13] += ra[5]+(ra[12]*10)
          rings[i] *= -1;
          miss = false;

          music.playSong("maptick.wav")
          ra[12] += 1

      }

      rx[i] += ra[6]
      ry[i] += ra[7]
    }else if(rings[i] < 0){
      if(ctrig == 1){
        ra[0] += ra[4]
        ra[1] += ra[5]

        ra[13] = ra[1]

        ra[4] = ra[5] = ra[12] = ra[15] = 0
        createExp(rings[i], rx[i], ry[i])
        rings[i] = 0;
      }
    }
    if(rx[i] < -127 || ry[i] < -127 || rx[i] > view.sizex+127 || ry[i] > view.sizey+127)
      rings[i] = 0
  }

  if(atrig == 1 && miss){
    for(i = 0; i < rings.length; i++){
      if(rings[i] < 0){
        ra[0] += ra[4]
        ra[1] += ra[5]

        ra[13] = ra[1]

        ra[4] = ra[5] = ra[12] = ra[15] = 0
        createExp(rings[i], rx[i], ry[i])
        rings[i] = 0;
      }
    }
  }

  // Lose sequence
  if(ra[1] < 0){
    save = ra[0]
    ra[0] = -1
    if(ra[2] > level)
      level = ra[2]
  }
}

function createRing(num, x, y){
  let notmade = true
  for(j = 0; j < rings.length; j++){
    if(rings[j] === 0){
      rings[j] = num
      rx[j] = x
      ry[j] = y
      notmade = false
      break
    }
  }
  if(notmade){
    rings.push(num)
    rx.push(x)
    ry.push(y)
  }
}

function createExp(num, x, y){
  let notmade = true
  for(j = 0; j < exp.length; j++){
    if(exp[j] === 0){
      exp[j] = num
      ex[j] = x
      ey[j] = y
      es[j] = 0
      notmade = false
      break
    }
  }
  if(notmade){
    exp.push(num)
    ex.push(x)
    ey.push(y)
    es.push(0)
  }
}

export function render(canvas, ctx){

  // Make the background black
  ctx.fillStyle = "black"
  ctx.fillRect(0, 0, view.sizex, view.sizey)

  // Let's make an explosion wherever a user clicks
  for(i = 0; i < exp.length; i++){
    if(exp[i] < 0){
      let tmpstr = '#'
      tmpstr += ([1,2,3,0,-1,-2,-3].includes(exp[i] % 6)) ? "FF" : "00";
      tmpstr += ([2,-2].includes(exp[i] % 6)) ? "A5" : ([3,4,-3,-4].includes(exp[i] % 6)) ? "FF" : "00";
      tmpstr += ([-5,5,0].includes(exp[i] % 6)) ? "FF" : "00";

      for(j = 0; j < 8; j++){
        ctx.strokeStyle = tmpstr;
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.arc(ex[i]+(([4, 5, 7].includes(j) ? es[i] : -es[i])*([0, 2].includes(j) ? 0 : 1)),
                ey[i]+(([2, 3, 7].includes(j) ? es[i] : -es[i])*([4, 6].includes(j) ? 0 : 1)),
                2, 0, 2 * Math.PI);
        ctx.stroke();
      }

      es[i] += 7;
      if(es[i] > view.sizex && es[i] > view.sizey){
        exp[i] = 0;
        es[i] = 0;
      }
    }
  }

  // Level Color
  let tmpstr = '#'
  tmpstr += ([1,2,3,0,6,-1,-2,-3].includes(6-ra[2]%6)) ? "FF" : "00";
  tmpstr += ([2,-2].includes(6-ra[2]%6)) ? "A5" : ([3,4,-3,-4].includes(6-ra[2]%6)) ? "FF" : "00";
  tmpstr += ([-5,5,0,6].includes(6-ra[2]%6)) ? "FF" : "00";


  ctx.fillStyle = tmpstr;
  ctx.font = '20px sans-serif';

  // Draw the link chain
  if(ra[12] > 1)
    ctx.fillText('x'+ra[12]+' LINK', 5, 62)
  // Draw the current level
  if(ra[0] > 0)
    ctx.fillText('LEVEL '+(ra[2]+1), view.sizex-100, view.sizey-15)
  else
    ctx.drawImage(jslix.getImg(0), (view.sizex/5), (2*view.sizey/5),
                                  (3*view.sizex/5), (view.sizey/5))

  for(i = 0; i < rings.length; i++){

    if(rings[i] != 0){
      let tmpstr = '#'
      tmpstr += ([1,2,3,0,-1,-2,-3].includes(rings[i] % 6)) ? "FF" : "00";
      tmpstr += ([2,-2].includes(rings[i] % 6)) ? "A5" : ([3,4,-3,-4].includes(rings[i] % 6)) ? "FF" : "00";
      tmpstr += ([-5,5,0].includes(rings[i] % 6)) ? "FF" : "00";

      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 8;
      ctx.beginPath();
      ctx.arc(rx[i], ry[i], rwidth, 0, 2 * Math.PI);
      ctx.stroke();

      ctx.strokeStyle = tmpstr;
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.arc(rx[i], ry[i], rwidth, 0, 2 * Math.PI);
      ctx.stroke();

      for(j = 0; j < 4; j++){
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.arc(rx[i], ry[i], rwidth, (rotate/360+j/2)*Math.PI, (rotate/360+j/2+1/4)*Math.PI);
        ctx.stroke();
      }

      // This determines the selectability of the rings
      if(rings[i] < 0){
        ctx.strokeStyle = 'darkgray'
        ctx.lineWidth = 4
        ctx.beginPath();
        ctx.moveTo(rx[i]-(5*rwidth/3)+(5*rwidth/3), ry[i]-(5*rwidth/3));
        ctx.lineTo(rx[i]-(5*rwidth/3), ry[i]-(5*rwidth/3));
        ctx.lineTo(rx[i]-(5*rwidth/3), ry[i]-(5*rwidth/3)+(5*rwidth/3));
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(rx[i]+(5*rwidth/3)-(5*rwidth/3), ry[i]+(5*rwidth/3));
        ctx.lineTo(rx[i]+(5*rwidth/3), ry[i]+(5*rwidth/3));
        ctx.lineTo(rx[i]+(5*rwidth/3), ry[i]+(5*rwidth/3)-(5*rwidth/3));
        ctx.stroke()

        ctx.strokeStyle = 'gray'
        ctx.lineWidth = 2
        ctx.beginPath();
        ctx.moveTo(rx[i]-(5*rwidth/3)+(5*rwidth/3), ry[i]-(5*rwidth/3));
        ctx.lineTo(rx[i]-(5*rwidth/3), ry[i]-(5*rwidth/3));
        ctx.lineTo(rx[i]-(5*rwidth/3), ry[i]-(5*rwidth/3)+(5*rwidth/3));
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(rx[i]+(5*rwidth/3)-(5*rwidth/3), ry[i]+(5*rwidth/3));
        ctx.lineTo(rx[i]+(5*rwidth/3), ry[i]+(5*rwidth/3));
        ctx.lineTo(rx[i]+(5*rwidth/3), ry[i]+(5*rwidth/3)-(5*rwidth/3));
        ctx.stroke()
      }
    }
  }

  // This renders the timer bar, for what that is worth
  ctx.fillStyle = 'darkgray'
  if(ra[2] >= 6)
    ctx.fillStyle = (ra[2] >= 12 ? 'white' : 'yellow')
  ctx.fillRect(0, 0, view.sizex, 40)
  if(level >= 6)
    ctx.fillText(level >= 12 ? 'MASTER' : 'LEGEND', view.sizex-100, 62)
  if(ra[0] <= 0){
    let tmp = (ra[12] == 0) ? "CLICK RINGS TO LINK" : "TAP SCREEN TO CLEAR"
    let tmpx = ctx.measureText(tmp).width
    ctx.fillText(tmp, ((view.sizex/2)-(tmpx/2)), view.sizey-15)
  }
  ctx.fillStyle = 'gray'
  if(ra[2] >= 6)
    ctx.fillStyle = (ra[2] >= 12 ? 'lightgray' : 'black')
  ctx.fillRect(5, 5, view.sizex-10, 30)


  for(i = 1, j = 0; i <= ((ra[0] > 0) ? ra[0] : save); i*=10, j++);

  ctx.fillStyle = tmpstr
  ctx.fillRect(5, 5, ra[1]*(view.sizex-10)/ra[3], 30)

  // Score Text
  drawText(ctx, (ra[0] > 0) ? ra[0] : save, '30px sans-serif', 'white', 'black', (view.sizex/2)-8-(j*7), 31, 2)

}

function drawText(ctx, text, font, fg, bg, tx, ty, offset){

  for(let h = 0; h < 5; h++){
    ctx.fillStyle = (h < 4) ? bg : fg;
    ctx.font = ((h < 4) ? "bold " : "") + font;
    ctx.fillText(text, tx+((h%2)?-offset:offset*(h<4)?1:0),
                       ty+((h<2)?-offset:offset*(h<4)?1:0));
  }
}
