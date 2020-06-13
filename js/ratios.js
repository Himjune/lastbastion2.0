const MAIN_VIDEO_POS = {
    width: 1280,
    height: 720,
    top: 0,
    left: 0
}

const SUB_VIDEO_POS = {
    width: 0.4,
    height: 0.3,
    top: 0.4,
    left: 0
}

const SUB_SYNC_VIDEO_POS = {
    width: 1,
    height: 1,
    top: 0.25,
    left: 0
}

function correctRelativeWidth(width) {
    SUB_VIDEO_POS.width = width/MAIN_VIDEO_POS.width;
}
function correctRelativeHeight(height) {
    SUB_VIDEO_POS.height = height/MAIN_VIDEO_POS.height;
}
function correctRelativeLeft(left) {
    SUB_VIDEO_POS.left = (left-MAIN_VIDEO_POS.left)/MAIN_VIDEO_POS.width;
}
function correctRelativeTop(top) {
    SUB_VIDEO_POS.top = (top-MAIN_VIDEO_POS.top)/MAIN_VIDEO_POS.height;
}

function placeMainVideoContainer(mainContainerElement) {
    mainContainerElement.style.left = "0px";
    mainContainerElement.style.top = "0px";
    mainContainerElement.style.width = "100%";
    mainContainerElement.style.height = "100%";
    
}

function placeSubVideoContainer(subContainerElement, isResizing=false) {
    let targetWidth = Math.floor(MAIN_VIDEO_POS.width*SUB_VIDEO_POS.width);
    let targetHeight = Math.floor(MAIN_VIDEO_POS.height*SUB_VIDEO_POS.height);

    let targetTop = Math.floor(MAIN_VIDEO_POS.top+MAIN_VIDEO_POS.height*SUB_VIDEO_POS.top);
    let targetLeft = Math.floor(MAIN_VIDEO_POS.left+MAIN_VIDEO_POS.width*SUB_VIDEO_POS.left);

    let parent = subContainerElement.parentElement;
    const MIN_WIDTH = 300;
    const MIN_HEIGHT = 168;
    const MINIMIZED = 50;
    const MOVE_BTN_MULT = 0.6;

    if (checkClass(subContainerElement,'sub-minimized')) {
        targetWidth = MINIMIZED;
        correctRelativeWidth(MINIMIZED);

        targetHeight = MINIMIZED;
        correctRelativeHeight(MINIMIZED);
    } else {
        if (targetWidth < MIN_WIDTH) {
            targetWidth = MIN_WIDTH;
            correctRelativeWidth(MIN_WIDTH);
        }

        if (targetHeight < MIN_HEIGHT) {
            targetHeight = MIN_HEIGHT;
            correctRelativeHeight(MIN_HEIGHT);
        }
    }

    if (targetLeft < 0) {
        targetLeft = 0;
        correctRelativeLeft(0);
    }
    if (targetTop < 0) {
        targetTop = 0;
        correctRelativeTop(0);
    }
    
    if (isResizing) {

        if (targetLeft + targetWidth > parent.offsetWidth) {
            targetWidth = parent.offsetWidth-targetLeft;
            correctRelativeWidth(targetWidth);
        }

        if (targetTop + targetHeight > parent.offsetHeight) {
            targetHeight = parent.offsetHeight-targetTop;
            correctRelativeHeight(targetHeight);
        }

    } else {

        if (targetLeft + targetWidth > parent.offsetWidth) {
            targetLeft = parent.offsetWidth-targetWidth;
            correctRelativeLeft(targetLeft);
        }

        if (targetTop + targetHeight > parent.offsetHeight) {
            targetTop = parent.offsetHeight-targetHeight;
            correctRelativeTop(targetTop);
        }

    }
    
    subContainerElement.style.width = targetWidth+'px';
    subContainerElement.style.height = targetHeight+'px';

    let moveBtnSide = Math.floor(targetWidth*MOVE_BTN_MULT);
    if (targetHeight*MOVE_BTN_MULT < moveBtnSide) moveBtnSide = Math.floor(targetHeight*MOVE_BTN_MULT);
    document.querySelector('#moveBtnContainer').style.width = moveBtnSide+'px';

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
    console.log('handleM');
    // MAIN
    let container = document.querySelector('.main-video-container');
    placeMainVideoContainer(container);
    makeRatioSize(container.querySelector('.video-16-9'), 0.5625, true);

    // SUB
    container = document.querySelector('.sub-video-container');
    placeSubVideoContainer(container);
    makeRatioSize(container.querySelector('.video-16-9'), 0.5625, false);
}

window.addEventListener("resize", handleRatioContainers);
handleRatioContainers();

/*
    SUB RESIZE
*/

function subContainerResize (e) {
    let targetX = e.clientX;
    let targetY = e.clientY;

    if (e.touches) {
        targetX = e.touches[0].clientX;
        targetY = e.touches[0].clientY;
    }
    
    let relativeWidth = (targetX-MAIN_VIDEO_POS.left-SUB_VIDEO_POS.left*MAIN_VIDEO_POS.width);
    relativeWidth = relativeWidth/MAIN_VIDEO_POS.width;

    let relativeHeight = (targetY-MAIN_VIDEO_POS.top-SUB_VIDEO_POS.top*MAIN_VIDEO_POS.height);
    relativeHeight = relativeHeight/MAIN_VIDEO_POS.height;

    SUB_VIDEO_POS.width = relativeWidth;
    SUB_VIDEO_POS.height = relativeHeight;

    let container = document.querySelector('.sub-video-container');
    placeSubVideoContainer(container, true);
    makeRatioSize(container.querySelectorAll('.video-16-9')[0], 0.5625, false);
}

function startResize(e) {
    e.preventDefault()
    
    let container = document.querySelector('.sub-video-container');

    window.addEventListener('mousemove', subContainerResize)
    window.addEventListener('mouseup', stopResize)
    
    container.addEventListener('touchmove', subContainerResize)
    container.addEventListener('touchend', stopResize)
}

function stopResize() {
    let container = document.querySelector('.sub-video-container');

    window.removeEventListener('mousemove', subContainerResize)
    container.removeEventListener('touchmove', subContainerResize)
}

document.querySelector('#subResizeBtn').addEventListener('mousedown', startResize)
document.querySelector('#subResizeBtn').addEventListener('touchstart', startResize)

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
    let container = document.querySelector('.sub-video-container');

    let targetX = e.clientX;
    let targetY = e.clientY;

    if (e.touches) {
        targetX = e.touches[0].clientX;
        targetY = e.touches[0].clientY;
    }
    
    let relativeLeft = (targetX-0.5*container.offsetWidth-MAIN_VIDEO_POS.left)/MAIN_VIDEO_POS.width;
    let relativeTop = (targetY-0.5*container.offsetHeight-MAIN_VIDEO_POS.top)/MAIN_VIDEO_POS.height;

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

    if (checkClass(container,'sub-minimized') && diffX < MOVE_OFFSET && diffY < MOVE_OFFSET) {
        removeMinimization();
    }

    window.removeEventListener('mousemove', subContainerMove)
    container.removeEventListener('touchmove', subContainerMove)
}

function startMove(e) {
    e.preventDefault()
    
    let container = document.querySelector('.sub-video-container');

    LAST_MOVEMENT.top = SUB_VIDEO_POS.top;
    LAST_MOVEMENT.left = SUB_VIDEO_POS.left;

    window.addEventListener('mousemove', subContainerMove)
    window.addEventListener('mouseup', stopMove)

    container.addEventListener('touchmove', subContainerMove)
    container.addEventListener('touchend', stopMove)

    makeRatioSize(container.querySelectorAll('.video-16-9')[0], 0.5625, false);
}

document.querySelector('#subMoveBtn').addEventListener('mousedown', startMove);
document.querySelector('#subMoveBtn').addEventListener('touchstart', startMove);

/*
    END SUB MOVE
*/

/*
    MINIMIZED
*/
    function removeMinimization() {
        let container = document.querySelector('.sub-video-container');
        container.removeEventListener('mousedown', startMove);
        container.removeEventListener('touchstart', startMove);

        toggleClass(container, 'sub-minimized');

        placeSubVideoContainer(container);
        makeRatioSize(container.querySelectorAll('.video-16-9')[0], 0.5625, false);
    }
    
    document.querySelector('#subMinimizeBtn').addEventListener('click', function(e) {
        e.preventDefault();

        let container = document.querySelector('.sub-video-container');

        toggleClass(container, 'sub-minimized')

        if (SUB_VIDEO_POS.left < 0.001) SUB_VIDEO_POS.left = 0.001;
        if (SUB_VIDEO_POS.top < 0.001) SUB_VIDEO_POS.top = 0.001;
        if (SUB_VIDEO_POS.left > 0.999) SUB_VIDEO_POS.left = 0.999;
        if (SUB_VIDEO_POS.top > 0.999) SUB_VIDEO_POS.top = 0.999;

        container.addEventListener('mousedown', startMove);
        container.addEventListener('touchstart', startMove);
        placeSubVideoContainer(container);
        makeRatioSize(container.querySelectorAll('.video-16-9')[0], 0.5625, false);
    })

/*
    END MINIMIZED
*/

/*
    SWITCH
*/

document.querySelector('#subSwitchBtn').addEventListener('click', function(e) {
    e.preventDefault();

    let subControlsContainer = document.querySelector('#subControlsContainer');
    subControlsContainer = subControlsContainer.parentNode.removeChild(subControlsContainer);

    let containers = document.querySelectorAll('.video-16-9-container');
    for (let index = 0; index < containers.length; index++) {
        const container = containers[index];

        toggleClass(container,'main-video-container');
        toggleClass(container,'sub-video-container');
    }

    document.querySelector('.sub-video-container').appendChild(subControlsContainer);
    handleRatioContainers();
})

/*
    END SWITCH
*/