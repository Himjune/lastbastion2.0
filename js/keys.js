let player = document.querySelector('#playerContainer');

window.addEventListener('keydown', (e) => {
    //console.log('key', e);

    if (e.key==="Escape" && checkClass(document.querySelector('#fullContainer'),'fullscreen')) {
        toggleFullScreen();
    }
    
    if (e.key==="Enter" && !checkClass(document.querySelector('#fullContainer'),'fullscreen')) {
        toggleFullScreen();        
    }
});