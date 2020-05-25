import { input, state, loop } from "./engine/screenstate.js"

export const name = "TEST1"
let action = false

export function init(){

}

export function update(){

  if (input.ACTION) {
    action = true
  }else if(action){
    state.next = "TEST2"
    action = false
  }

}

export function render(canvas, ctx){

  ctx.fillStyle = '#000000';
  ctx.font = 'bold 10px sans-serif';
  ctx.fillText('TEST1', 200, 200);
}
