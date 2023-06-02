console.log(`${location.origin}gpt/min.js imported\n${Date()}`)

import * as min from '../gpt/min.js';

let msgs = []

function ui(div){
    if(!div){
        // try default div
        div=document.querySelector('#caterpillarDiv')
        if(!div){
            div=document.createElement('div')
        }
    }
    
    console.log('assembling caterpillar div ...')
    div.innerHTML=`
        Model: <select id='model'></select>
        <br>Temperature: <input id="temperatureNum" size="4" value="0.7"><input id="temperatureRange" type="range" value="0.7" min="0" max="2" step="0.1" size="10">`
    // select model
    let model=div.querySelector('#model')
    min.listModels().then(x=>{
        x.data.forEach(x=>{
            let opt = document.createElement('option')
            opt.value=opt.textContent=x.id
            model.appendChild(opt)
        })
        model.value='gpt-3.5-turbo'
    })
    // select temperatureNum
    let temperatureNum=div.querySelector('#temperatureNum')
    let temperatureRange=div.querySelector('#temperatureRange')
    temperatureRange.onchange=function(){
        temperatureNum.value=temperatureRange.value
    }
    temperatureNum.onchange=function(){
        if(temperatureNum.value>2){temperatureNum.value=2}
        if(temperatureNum.value<0){temperatureNum.value=0}
        temperatureRange.value=temperatureNum.value
    }
    addSegmentTo(div)
    return div
}

function addSegmentTo(div, role='system',txt='You are a helpful assistant'){
    let id=crypto.randomUUID()
    let seg=document.createElement('div')
    seg.role=role
    seg.txt=txt
    seg.contentEditable=true
    seg.style.marginTop='20px'
    seg.style.border='solid'
    seg.style.borderWidth='1px'
    seg.style.padding='20px'
    seg.style.width=div.clientWidth
    //seg.textContent=`${msgs.length}) ${txt}`
    seg.textContent=txt
    switch(role) {
      case 'system':
        seg.style.color='maroon'
        break;
      case 'user':
        seg.style.color='blue'
        break;
      case 'assistant':
        seg.style.color='green'
        break;
      default:
        error('role not found')
    }
    
    seg.onkeyup= async function(evt){
        if((!evt.shiftKey)&(evt.keyCode==13)){
            seg.contentEditable=false
            seg.textContent=`${msgs.length}) ${seg.txt}`
            if(role!=='user'){
                addSegmentTo(div,'user','u r a user')
            }else{
                let segi = await addSegmentTo(div,'assistant','...')
                //debugger
            }
            msgs.push({
                role:role,
                content:txt
            })
            console.log(msgs)
        }
    }
    div.appendChild(seg)
    seg.focus()
    // --- move cursor to the end of segment
    let range = document.createRange()
    range.selectNodeContents(seg)
    range.collapse(false)
    let selection = window.getSelection()
    selection.removeAllRanges()
    selection.addRange(range)
    // ---
    return seg
}

ui()

export {ui,msgs}