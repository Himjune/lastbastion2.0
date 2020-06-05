const MAIN_VIDEO_POS = {
    width: 1280,
    height: 720,
    top: 0,
    left: 0
}

const SUB_VIDEO_POS = {
    width: 0.3,
    height: 0.25,
    top: 0.4,
    left: 0
}

const SUB_SYNC_VIDEO_POS = {
    width: 1,
    height: 1,
    top: 0.25,
    left: 0
}

function placeSubVideoContainer(subContainerElement) {
    let targetWidth = Math.floor(MAIN_VIDEO_POS.width*SUB_VIDEO_POS.width);
    let targetHeight = Math.floor(MAIN_VIDEO_POS.height*SUB_VIDEO_POS.height);

    let targetTop = Math.floor(MAIN_VIDEO_POS.top+MAIN_VIDEO_POS.height*SUB_VIDEO_POS.top);
    let targetLeft = Math.floor(MAIN_VIDEO_POS.left+MAIN_VIDEO_POS.width*SUB_VIDEO_POS.left);

    subContainerElement.style.width = targetWidth+'px';
    subContainerElement.style.height = targetHeight+'px';
    subContainerElement.style.top = targetTop+'px';
    subContainerElement.style.left = targetLeft+'px';
}

function makeRatioSize (element, ratio, isMain) {
    let parent = element.parentElement;

    let isFullWidth = true;
    let targetWidth = parent.offsetWidth;
    let targetHeight = Math.floor(targetWidth*ratio);
    let targetLeft = 0;
    let targetTop = Math.floor((parent.offsetHeight - targetHeight)/2);

    if (parent.offsetHeight > 0 && targetHeight > parent.offsetHeight) {
        isFullWidth = false;
        targetHeight = parent.offsetHeight

        ratio = 1/ratio;
        targetWidth = Math.floor(targetHeight*ratio);

        targetTop = 0;
        targetLeft =  Math.floor((parent.offsetWidth - targetWidth)/2);
    }

    if (isMain) {
        MAIN_VIDEO_POS.width = targetWidth;
        MAIN_VIDEO_POS.height = targetHeight;
        MAIN_VIDEO_POS.top = targetTop;
        MAIN_VIDEO_POS.left = targetLeft;
    }

    element.style.width = targetWidth+'px';
    element.style.height = targetHeight+'px';
    element.style.top = targetTop+'px';
    element.style.left = targetLeft+'px';

    return isFullWidth;
}  

function handleRatioContainers () {
    // MAIN
    let container = document.querySelectorAll('.main-video-container')[0];
    makeRatioSize(container.querySelectorAll('.video-16-9')[0], 0.5625, true);

    // SUB
    container = document.querySelectorAll('.sub-video-container')[0];
    placeSubVideoContainer(container);
    makeRatioSize(container.querySelectorAll('.video-16-9')[0], 0.5625, false);
}

window.addEventListener("resize", handleRatioContainers);
handleRatioContainers();

/*
    SUB RESIZE
*/

function subContainerResize (e) {
    const MINSIZE = 175;
    const MINPOS = 50;

    let targetX = e.clientX;
    if (targetX < MINPOS) targetX = MINPOS;
    if (targetX > MAIN_VIDEO_POS.width-2) targetX = MAIN_VIDEO_POS.width-2;
    
    let relativeWidth = (targetX-MAIN_VIDEO_POS.left-SUB_VIDEO_POS.left*MAIN_VIDEO_POS.width);
    if (relativeWidth < MINSIZE) relativeWidth = MINSIZE;
    relativeWidth = relativeWidth/MAIN_VIDEO_POS.width;
    if (relativeWidth > 1) relativeWidth = 1;

    let targetY = e.clientY;
    if (targetY < MINPOS) targetY = MINPOS;
    if (targetY > MAIN_VIDEO_POS.height-2) targetY = MAIN_VIDEO_POS.height-2;

    let relativeHeight = (targetY-MAIN_VIDEO_POS.top-SUB_VIDEO_POS.top*MAIN_VIDEO_POS.height);
    if (relativeHeight < MINSIZE) relativeHeight = MINSIZE;
    relativeHeight = relativeHeight/MAIN_VIDEO_POS.height;
    if (relativeHeight > 1) relativeHeight = 1;

    SUB_VIDEO_POS.width = relativeWidth;
    SUB_VIDEO_POS.height = relativeHeight;

    let container = document.querySelector('.sub-video-container');
    placeSubVideoContainer(container);
    makeRatioSize(container.querySelectorAll('.video-16-9')[0], 0.5625, false);
}

function stopResize() {
    window.removeEventListener('mousemove', subContainerResize)
}

document.querySelector('#subResizeBtn').addEventListener('mousedown', function(e) {
    e.preventDefault()
    window.addEventListener('mousemove', subContainerResize)
    window.addEventListener('mouseup', stopResize)
})

/*
    END SUB RESIZE
*/

/*
    SUB MOVE
*/

const LAST_MOVEMENT = {
    top: SUB_VIDEO_POS.top,
    left: SUB_VIDEO_POS.left
};

function subContainerMove (e) {
    hadMovements = true;

    let container = document.querySelector('.sub-video-container');

    let targetX = e.clientX;
    if (targetX < 0) targetX = 2;
    if (targetX > MAIN_VIDEO_POS.width-2) targetX = MAIN_VIDEO_POS.width-2;
    
    let relativeLeft = (targetX-0.5*container.offsetWidth)/MAIN_VIDEO_POS.width;

    let targetY = e.clientY;
    if (targetY < 0) targetY = 2;
    if (targetY > MAIN_VIDEO_POS.height-2) targetY = MAIN_VIDEO_POS.height-2;

    let relativeTop = (targetY-0.5*container.offsetHeight)/MAIN_VIDEO_POS.height;

    console.log('t',targetX,targetY);
    console.log('r',relativeTop,relativeLeft);


    SUB_VIDEO_POS.top = relativeTop;
    SUB_VIDEO_POS.left = relativeLeft;

    placeSubVideoContainer(container);
    makeRatioSize(container.querySelectorAll('.video-16-9')[0], 0.5625, false);
}

function stopMove(e) {
    let container = document.querySelector('.sub-video-container');

    const MOVE_OFFSET = 0.001;
    
    let diffX = Math.abs(LAST_MOVEMENT.left - SUB_VIDEO_POS.left);
    let diffY = Math.abs(LAST_MOVEMENT.top - SUB_VIDEO_POS.top);
    console.log('st', SUB_VIDEO_POS.left, SUB_VIDEO_POS.top);
    console.log('sd', diffX, diffY)
    
    if (checkClass(container,'sub-minimized') && diffX < MOVE_OFFSET && diffY < MOVE_OFFSET) {
        removeMinimization();
    }

    window.removeEventListener('mousemove', subContainerMove)
}

document.querySelector('#subMoveBtn').addEventListener('mousedown', function(e) {
    e.preventDefault()
    window.addEventListener('mousemove', subContainerMove)
    window.addEventListener('mouseup', stopMove)
})

/*
    END SUB MOVE
*/

/*
    MINIMIZED
*/
    function removeMinimization() {
        let container = document.querySelector('.sub-video-container');
        container.removeEventListener('mousedown', startMinimizedMove);

        toggleClass(container, 'sub-minimized');

        makeRatioSize(container.querySelectorAll('.video-16-9')[0], 0.5625, false);
    }

    function startMinimizedMove(e) {
        e.preventDefault()

        LAST_MOVEMENT.top = SUB_VIDEO_POS.top;
        LAST_MOVEMENT.left = SUB_VIDEO_POS.left;

        window.addEventListener('mousemove', subContainerMove)
        window.addEventListener('mouseup', stopMove)
        
        let container = document.querySelector('.sub-video-container');
        makeRatioSize(container.querySelectorAll('.video-16-9')[0], 0.5625, false);
    }
    
    document.querySelector('#subMinimizeBtn').addEventListener('click', function(e) {
        e.preventDefault();

        let container = document.querySelector('.sub-video-container');

        toggleClass(container, 'sub-minimized')

        container.addEventListener('mousedown', startMinimizedMove);
        makeRatioSize(container.querySelectorAll('.video-16-9')[0], 0.5625, false);
    })

/*
    END MINIMIZED
*/