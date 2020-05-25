import { input, state, loop, view } from "./engine/screenstate.js"
import * as utils from "./engine/bc/utils.js"
import * as music from "./engine/js/music.js"

export const name = "RINGVIBE"
let action = false
let atrig = false
let cancel = false
let ctrig = false

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

let score = 0
let time = 500
let level = 0
let tbar = 1000



// +positive for active rings
// -negative for selected rings
// 0 for destroyed rings

export function init(){

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
  rotate += val
  if(rotate > 360)
    rotate = 0
  else if(rotate < 0)
    rotate = 360

  // This handles the action presses
  if (input.ACTION) {
    //if(!music.isMusicPlaying())
      //music.playMusic("fallen.mp3")
    action = true
  }else if(action){
    //music.playSong("fallen.mp3")
    atrig = true
    action = false
  }

  // This handles the cancel presses
  if (input.CANCEL) {
    //if(music.isMusicPlaying())
    //  music.stopMusic()
    //music.stopAllSongs()
    cancel = true
  }else if(cancel){
    ctrig = true
    cancel = false
  }

  // Let's do some maintenance

  // This increases the time bar every level
  for(i = 1000, j = 0; i <= time; i*=2, j++);
  if(i > tbar){
    tbar = i;
    level = j;
  }

  // Tracks to see if a ring was missed
  let miss = true;

  // Main loop for rings
  for(i = 0; i < rings.length; i++){

    // If it is a real ring
    if (rings[i] > 0){
      // We will react a certain way if a ring is selected
      if(atrig && input.MOUSEX > rx[i]-(5*rwidth/3) &&
                  input.MOUSEX < rx[i]+(5*rwidth/3) &&
                  input.MOUSEY > ry[i]-(5*rwidth/3) &&
                  input.MOUSEY < ry[i]+(5*rwidth/3)){
          //change ring to selected
          //if(!music.isSongOn())
            //music.loopSong(rings[i]%2)
            //music.playSong(0)
          rings[i] *= -1;
          miss = false;

          music.playSong("maptick.wav")

      }
    }else if(rings[i] < 0){
      if(ctrig){
        createExp(rings[i], rx[i], ry[i])
        rings[i] = 0;
      }
    }
  }

  if(atrig && miss){
    for(i = 0; i < rings.length; i++){
      if(rings[i] < 0){
        createExp(rings[i], rx[i], ry[i])
        rings[i] = 0;
      }
    }
  }


  // This allows for lingering action presses
  if(atrig){
    //score += 10
    createExp(-parseInt(Math.random()*6), input.MOUSEX, input.MOUSEY)
    val *= -1
    atrig = false
  }

  // This allows for lingering control presses
  if(ctrig){
    if(val > 0){
      val += 1
      if(val > 5)
        val = 1
    }else if (val < 0){
      val -= 1
      if(val < -5)
        val = -1
    }
    ctrig = false
  }
}

function createExp(num, rx, ry){
  let notmade = true
  for(j = 0; j < exp.length; j++){
    if(exp[j] == 0){
      exp[j] = num
      ex[j] = rx
      ey[j] = ry
      es[j] = 0
      notmade = false
      break
    }
  }
  if(notmade){
    exp.push(num)
    ex.push(rx)
    ey.push(ry)
    es.push(0)
  }
}

export function render(canvas, ctx){

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

  for(i = 1, j = 0; i <= score; i*=10, j++);

  let tmpstr = '#'
  tmpstr += ([1,2,3,0,-1,-2,-3].includes((6-level)%6)) ? "FF" : "00";
  tmpstr += ([2,-2].includes((6-level)%6)) ? "A5" : ([3,4,-3,-4].includes((6-level)%6)) ? "FF" : "00";
  tmpstr += ([-5,5,0].includes((6-level)%6)) ? "FF" : "00";
  ctx.fillStyle = tmpstr
  ctx.fillRect(5, 5, time*(view.sizex-10)/tbar, 30)

  ctx.fillStyle = '#000000';
  ctx.font = 'bold 30px sans-serif';
  ctx.fillText(score, (view.sizex/2)-8-2-(j*7), 31-2);

  ctx.fillStyle = '#000000';
  ctx.font = 'bold 30px sans-serif';
  ctx.fillText(score, (view.sizex/2)-8+2-(j*7), 31+2);

  ctx.fillStyle = '#000000';
  ctx.font = 'bold 30px sans-serif';
  ctx.fillText(score, (view.sizex/2)-8-2-(j*7), 31+2);

  ctx.fillStyle = '#000000';
  ctx.font = 'bold 30px sans-serif';
  ctx.fillText(score, (view.sizex/2)-8+2-(j*7), 31-2);

  ctx.fillStyle = '#FFFFFF';
  ctx.font = '30px sans-serif';
  ctx.fillText(score, (view.sizex/2)-8-(j*7), 31);



}
