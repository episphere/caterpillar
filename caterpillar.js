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
    msgSegment(div)
    return div
}

function msgSegment(div, role='system',txt='You are a helpful assistant'){
    let id=crypto.randomUUID()
    msgs.push({
        role:role,
        content:txt,
        id:id
    })
    let di=document.createElement('div')
    di.contentEditable=true
    di.style.marginTop='20px'
    di.style.border='solid'
    di.style.borderWidth='1px'
    di.style.padding='20px'
    di.style.width=div.clientWidth
    di.textContent=txt
    if(role=='system'){
        di.style.color='maroon'
    }else{
        
    }
    div.appendChild(di)
}

ui()

export {ui,msgs}