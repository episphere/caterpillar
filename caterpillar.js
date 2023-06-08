console.log(`${location.origin}gpt/min.js imported\n${Date()}`)

import * as min from '../gpt/min.js';

function txt2innerHTML(div){
    let h = div.innerHTML
    //if(txt[0]=='<'){ // html
    //    return txt
    //}else{
    //    return '<p>'+txt.replaceAll('\n','<br>')+'</p>'
    //}
    div.innerHTML=h
}

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
    div.onresize=function(){
        return Math.min(div.clientWidth,200)
    }
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
            seg.txt=seg.textContent
            seg.textContent=`${msgs.length}) ${seg.txt}`
            msgs.push({
                role:role,
                content:seg.txt
            })
            if(role!=='user'){ // not a user --> become a user
                let segUser = addSegmentTo(div,'user','')
                //debugger
            }else{ // a user, ask the assistant
                let segAssistant = await addSegmentTo(div,'assistant','...')
                segAssistant.contentEditable=false
                let res = await min.completions(JSON.stringify(msgs),div.querySelector('#model').value,'user',parseFloat(div.querySelector('#temperatureNum').value))
                let resContent=res.choices[0].message.content
                console.log(res)
                if(resContent[0]=='{'){
                    resContent=JSON.parse(resContent).content
                } else if(resContent[0]=='['){
                    resContent=JSON.parse(resContent)[0].content
                }
                segAssistant.textContent=`${msgs.length}) ${resContent}`
                msgs.push({
                    role:'assistant',
                    content:resContent
                })
                segAssistant.txt=resContent
                //console.log(msgs)
                txt2innerHTML(segAssistant)
                let segUser = addSegmentTo(div,'user','')
                //debugger
            }
            //txt2innerHTML(seg)
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