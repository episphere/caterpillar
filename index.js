console.log(`${location.href}index.js loaded\n${Date()}`);

// importing only basic functionality of export.js
// no UI components included, no auth thrigger

/*
import { 
    key,
    check4key,
    completions,
    embeddings,
    listModels,
    retrieveModel,
    models 
} from "../gpt/export.js";


(async function(){
    lala = await import('../gpt/min.js')
})()
*/

(async function(){
    //lala = await import('../gpt/min.js')
    lala = await import('./caterpillar.js')
    //console.log('hello')
})();