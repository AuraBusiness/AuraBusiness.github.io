
/* ===== AURA PREMIUM NAVIGATION ===== */


/* smooth small scroll buttons */

function pageDown(){

window.scrollBy({

top:300,

behavior:"smooth"

});

}



function pageUp(){

window.scrollBy({

top:-300,

behavior:"smooth"

});

}



/* section navigation */

let auraSections=[];

let auraCurrent=0;



function loadAuraSections(){

auraSections=[

document.querySelector("header"),

...document.querySelectorAll("section")

];

}



window.addEventListener("load",()=>{

loadAuraSections();

});



function goAuraSection(index){

if(!auraSections[index]) return;

auraCurrent=index;

auraSections[index].scrollIntoView({

behavior:"smooth",

block:"start"

});

}



/* keyboard laptop navigation */

document.addEventListener("keydown",e=>{


if(e.key==="ArrowDown"){

pageDown();

}



if(e.key==="ArrowUp"){

pageUp();

}



});



/* mobile swipe */

let auraStartX=0;


document.addEventListener("touchstart",e=>{

auraStartX=e.touches[0].clientX;

},{passive:true});



document.addEventListener("touchend",e=>{


let endX=e.changedTouches[0].clientX;

let distance=auraStartX-endX;



if(Math.abs(distance)<100)return;



if(distance>0){

if(auraCurrent<auraSections.length-1){

goAuraSection(auraCurrent+1);

}

}



if(distance<0){

if(auraCurrent>0){

goAuraSection(auraCurrent-1);

}

}


},{passive:true});



/* top button */

function scrollToTop(){

window.scrollTo({

top:0,

behavior:"smooth"

});

}



