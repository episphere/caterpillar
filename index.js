console.log(`${location.href}index.js loaded\n${Date()}`);

// importing only basic functionality of export.js
// no UI components included, no auth thrigger

(async function(){
    //lala = await import('../gpt/min.js')
    caterpillar = await import('./caterpillar.js')
    //console.log('hello')
})();