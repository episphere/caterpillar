console.log(`${location.origin}gpt/min.js imported\n${Date()}`)

import * as min from '../gpt/min.js';

function caterpillar(div){
    if(!div){
        // try default div
        div=document.querySelector('#caterpillarDiv')
        if(!div){
            div=document.createElement('div')
        }
    }
    
    console.log('caterpillar div')
    return div
}

export {caterpillar}