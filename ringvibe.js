import { input, state, loop, view } from "./engine/screenstate.js"
import * as utils from "./engine/bc/utils.js"
import * as music from "./engine/js/music.js"

export const name = "RINGVIBE"
let action = false
let atrig = 0
let cancel = false
let ctrig = 0

let i = 0
let j = 0

let rotate = 0
let rwidth = 15
let val = 2
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

  // [0]Score, [1]Time, [2]Level, [3]Timebar, [4]Scoreholder, [5]TimeHolder
  ra.push(0, 500, 0, 1000, 0, 0)
  // [6]movex, [7]movey, [8]windx, [9]windy, [10]spawn, [11]windcount
  ra.push(0, 0, 0, 0, 0, 0)
  // [12]link, [13]delay, [14]diff
  ra.push(0, 500, 0)


  //music.addSong("fallen.mp3")
  //music.addSong("sky.mp3")
  music.addSong("maptick.wav")

  for(i = 0; i < 7; i++){
    rings.push(i)
    rx.push(i*60)
    ry.push(i*40+75)
  }
}

export function update(){

  // Rotate the ring
  rotate = rotate%360
  rotate += (ra[6] + ra[7])/2 == 0 ?
            (ra[6] + ra[7] < 0 ? -1 : 1) :
            (ra[6] + ra[7]);

  // This handles the action presses
  if (input.ACTION) {
    //if(!music.isMusicPlaying())
      //music.playMusic("fallen.mp3")
    action = true
    atrig += 1;
  }else if(action){
    //music.playSong("fallen.mp3")

    action = false
    atrig = 0;
  }

  // This handles the cancel presses
  if (input.CANCEL) {
    //if(music.isMusicPlaying())
    //  music.stopMusic()
    //music.stopAllSongs()
    cancel = true
    ctrig += 1;
  }else if(cancel){
    ctrig = 0
    cancel = false
  }

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
        ra[1] -= ra[14]
      }
      ra[13] -= ra[14]
    }
    ra[13] -= ra[12]
    if(ra[13] < ra[1]){
      ra[1] -= ra[12]
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

        ra[4] = ra[5] = ra[12] = 0
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

        ra[4] = ra[5] = ra[12] = 0
        createExp(rings[i], rx[i], ry[i])
        rings[i] = 0;
      }
    }
  }


  // This allows for lingering action presses
  //if(atrig){
    //atrig = false
  //}

  // This allows for lingering control presses
  //if(ctrig){
    //ctrig = false
  //}
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
  ctx.fillStyle = 'gray'
  ctx.fillRect(0, 0, view.sizex, 40)
  ctx.fillStyle = 'darkgray'
  ctx.fillRect(5, 5, view.sizex-10, 30)

  for(i = 1, j = 0; i <= ra[0]; i*=10, j++);

  let tmpstr = '#'
  tmpstr += ([1,2,3,0,-1,-2,-3].includes((6-ra[2])%6)) ? "FF" : "00";
  tmpstr += ([2,-2].includes((6-ra[2])%6)) ? "A5" : ([3,4,-3,-4].includes((6-ra[2])%6)) ? "FF" : "00";
  tmpstr += ([-5,5,0].includes((6-ra[2])%6)) ? "FF" : "00";
  ctx.fillStyle = tmpstr
  ctx.fillRect(5, 5, ra[1]*(view.sizex-10)/ra[3], 30)

  ctx.fillStyle = '#000000';
  ctx.font = 'bold 30px sans-serif';
  ctx.fillText(ra[0], (view.sizex/2)-8-2-(j*7), 31-2);

  ctx.fillStyle = '#000000';
  ctx.font = 'bold 30px sans-serif';
  ctx.fillText(ra[0], (view.sizex/2)-8+2-(j*7), 31+2);

  ctx.fillStyle = '#000000';
  ctx.font = 'bold 30px sans-serif';
  ctx.fillText(ra[0], (view.sizex/2)-8-2-(j*7), 31+2);

  ctx.fillStyle = '#000000';
  ctx.font = 'bold 30px sans-serif';
  ctx.fillText(ra[0], (view.sizex/2)-8+2-(j*7), 31-2);

  ctx.fillStyle = '#FFFFFF';
  ctx.font = '30px sans-serif';
  ctx.fillText(ra[0], (view.sizex/2)-8-(j*7), 31);



}
