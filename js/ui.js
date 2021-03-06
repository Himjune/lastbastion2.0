const MAIN_VIDEO_POS = {
    width: 1280,
    height: 720,
    top: 0,
    left: 0,
    offset: 0
}

const SUB_VIDEO_POS = {
}
function resetPositionSettings() {
    SUB_VIDEO_POS.width = 0.4;
    SUB_VIDEO_POS.height = 0.3;
    SUB_VIDEO_POS.top = 0.05;
    SUB_VIDEO_POS.left = 0;
    SUB_VIDEO_POS.offset = 0;
    SUB_VIDEO_POS.isMinimized = false;
    SUB_VIDEO_POS.sub = TW_CODE;
}
resetPositionSettings();

const SUB_SYNC_VIDEO_POS = {
    width: 1,
    height: 1,
    top: 0,
    left: 0,
    offset: 0.25,
    isMinimized: false,
    sub: YT_CODE,
}

const uiState = {
    //isSyncing: false,
    curSubPosition: SUB_VIDEO_POS,
    prevSubPosition: SUB_VIDEO_POS,
}

function switchSubPlayer() {
    handleTwQuality();
}

function changeSubVideoPosition(position) {
    if (position.sub != uiState.curSubPosition.sub) {
        console.log(position.sub, uiState.curSubPosition.sub);
        switchPlayers();
    }

    uiState.prevSubPosition = uiState.curSubPosition;
    uiState.curSubPosition = position;

    handleRatioContainers();
}
function resetSubVideoPosition() {
    uiState.curSubPosition = uiState.prevSubPosition;
    handleRatioContainers();
}

function correctRelativeWidth(width) {
    SUB_VIDEO_POS.width = width / MAIN_VIDEO_POS.width;
}
function correctRelativeHeight(height) {
    SUB_VIDEO_POS.height = height / MAIN_VIDEO_POS.height;
}
function correctRelativeLeft(left) {
    SUB_VIDEO_POS.left = (left - MAIN_VIDEO_POS.left) / MAIN_VIDEO_POS.width;
}
function correctRelativeTop(top) {
    SUB_VIDEO_POS.top = (top - MAIN_VIDEO_POS.top) / MAIN_VIDEO_POS.height;
}

function placeMainVideoContainer(mainContainerElement) {
    mainContainerElement.style.left = "0px";
    mainContainerElement.style.top = "0px";
    mainContainerElement.style.width = "100%";
    mainContainerElement.style.height = "100%";

    mainContainerElement.querySelector('.offset-container').style.top = '0%';
}


function placeSubVideoContainer(subContainerElement, isResizing = false) {
    let curSubPosition = uiState.curSubPosition;

    let targetWidth = Math.floor(MAIN_VIDEO_POS.width * curSubPosition.width);
    let targetHeight = Math.floor(MAIN_VIDEO_POS.height * curSubPosition.height);

    let targetTop = Math.floor(MAIN_VIDEO_POS.top + MAIN_VIDEO_POS.height * curSubPosition.top);
    let targetLeft = Math.floor(MAIN_VIDEO_POS.left + MAIN_VIDEO_POS.width * curSubPosition.left);

    let parent = subContainerElement.parentElement;

    const MIN_WIDTH = 192;
    const MIN_HEIGHT = 108;
    const MINIMIZED = 40;

    handleTwQuality(curSubPosition.isMinimized);
    if (curSubPosition.isMinimized) {
        setClass(subContainerElement, 'sub-minimized');
        targetWidth = MINIMIZED;
        targetHeight = MINIMIZED;
    } else {
        removeClass(subContainerElement, 'sub-minimized');
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
            targetWidth = parent.offsetWidth - targetLeft;
            correctRelativeWidth(targetWidth);
        }

        if (targetTop + targetHeight > parent.offsetHeight) {
            targetHeight = parent.offsetHeight - targetTop;
            correctRelativeHeight(targetHeight);
        }

    } else {

        if (targetLeft + targetWidth > parent.offsetWidth) {
            targetLeft = parent.offsetWidth - targetWidth;
            correctRelativeLeft(targetLeft);
        }

        if (targetTop + targetHeight > parent.offsetHeight) {
            targetTop = parent.offsetHeight - targetHeight;
            correctRelativeTop(targetTop);
        }

    }

    subContainerElement.style.width = targetWidth + 'px';
    subContainerElement.style.height = targetHeight + 'px';

    const MOVE_BTN_MULT = 0.5;
    let moveBtnSide = Math.floor(targetWidth * MOVE_BTN_MULT);
    if (targetHeight * MOVE_BTN_MULT < moveBtnSide) moveBtnSide = Math.floor(targetHeight * MOVE_BTN_MULT);
    document.querySelector('#moveBtnContainer').style.width = moveBtnSide + 'px';

    subContainerElement.style.top = targetTop + 'px';
    subContainerElement.style.left = targetLeft + 'px';

    subContainerElement.querySelector('.offset-container').style.top = curSubPosition.offset * 100 + '%';
}

function makeRatioSize(element, ratio, isMain) {
    let parent = element.parentElement;

    let isFullWidth = true;
    let targetWidth = parent.offsetWidth;
    let targetHeight = Math.floor(targetWidth * ratio);
    let targetLeft = 0;
    let targetTop = Math.floor((parent.offsetHeight - targetHeight) / 2);

    if (parent.offsetHeight > 0 && targetHeight > parent.offsetHeight) {
        isFullWidth = false;
        targetHeight = parent.offsetHeight

        ratio = 1 / ratio;
        targetWidth = Math.floor(targetHeight * ratio);

        targetTop = 0;
        targetLeft = Math.floor((parent.offsetWidth - targetWidth) / 2);
    }

    if (isMain) {
        MAIN_VIDEO_POS.width = targetWidth;
        MAIN_VIDEO_POS.height = targetHeight;
        MAIN_VIDEO_POS.top = targetTop;
        MAIN_VIDEO_POS.left = targetLeft;

        let controlBottom = targetTop - 4;
        if (controlBottom < 0) controlBottom = 0;
        document.querySelector('#controlsContainer').style.bottom = controlBottom + 'px';
    }

    element.style.width = targetWidth + 'px';
    element.style.height = targetHeight + 'px';
    element.style.top = targetTop + 'px';
    element.style.left = targetLeft + 'px';

    return isFullWidth;
}

function handleRatioContainers() {

    // MAIN
    let container = document.querySelector('.main-video-container');
    placeMainVideoContainer(container);
    makeRatioSize(container.querySelector('.video-16-9'), 0.5625, true);

    // SUB
    container = document.querySelector('.sub-video-container');
    placeSubVideoContainer(container);
    makeRatioSize(container.querySelector('.video-16-9'), 0.5625, false);

    // CONTROLS

}

window.addEventListener("resize", handleRatioContainers);
handleRatioContainers();

/*
    SUB RESIZE
*/

function subContainerResize(e) {
    let targetX = e.clientX;
    let targetY = e.clientY;

    if (e.touches) {
        targetX = e.touches[0].clientX;
        targetY = e.touches[0].clientY;
    }

    let relativeWidth = (targetX - MAIN_VIDEO_POS.left - SUB_VIDEO_POS.left * MAIN_VIDEO_POS.width);
    relativeWidth = relativeWidth / MAIN_VIDEO_POS.width;

    let relativeHeight = (targetY - MAIN_VIDEO_POS.top - SUB_VIDEO_POS.top * MAIN_VIDEO_POS.height);
    relativeHeight = relativeHeight / MAIN_VIDEO_POS.height;

    SUB_VIDEO_POS.width = relativeWidth;
    SUB_VIDEO_POS.height = relativeHeight;

    let container = document.querySelector('.sub-video-container');
    placeSubVideoContainer(container, true);
    makeRatioSize(container.querySelectorAll('.video-16-9')[0], 0.5625, false);
}

function startResize(e) {
    e.preventDefault()

    let container = document.querySelector('#playerContainer');

    container.addEventListener('mousemove', subContainerResize);
    container.addEventListener('mouseup', stopResize);
    container.addEventListener('mouseleave', stopResize);

    container.addEventListener('touchmove', subContainerResize);
    container.addEventListener('touchend', stopResize);
}

function stopResize() {
    let container = document.querySelector('#playerContainer');

    container.removeEventListener('mousemove', subContainerResize)
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

function subContainerMove(e) {
    let container = document.querySelector('.sub-video-container');

    let targetX = e.clientX;
    let targetY = e.clientY;

    if (e.touches) {
        targetX = e.touches[0].clientX;
        targetY = e.touches[0].clientY;
    }

    let relativeLeft = (targetX - 0.5 * container.offsetWidth - MAIN_VIDEO_POS.left) / MAIN_VIDEO_POS.width;
    let relativeTop = (targetY - 0.5 * container.offsetHeight - MAIN_VIDEO_POS.top) / MAIN_VIDEO_POS.height;

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

    if (checkClass(container, 'sub-minimized') && diffX < MOVE_OFFSET && diffY < MOVE_OFFSET) {
        removeMinimization();
    }

    container = document.querySelector('#playerContainer');
    container.removeEventListener('mousemove', subContainerMove)
    container.removeEventListener('mouseup', stopMove);
    container.removeEventListener('mouseleave', stopMove);

    container.removeEventListener('touchmove', subContainerMove)
    container.removeEventListener('touchend', stopMove);
}

function startMove(e) {

    e.preventDefault()

    let container = document.querySelector('#playerContainer');

    LAST_MOVEMENT.top = SUB_VIDEO_POS.top;
    LAST_MOVEMENT.left = SUB_VIDEO_POS.left;

    container.addEventListener('mousemove', subContainerMove);
    container.addEventListener('mouseup', stopMove);
    container.addEventListener('mouseleave', stopMove);

    container.addEventListener('touchmove', subContainerMove);
    container.addEventListener('touchend', stopMove);

    makeRatioSize(container.querySelectorAll('.video-16-9')[0], 0.5625, false);
}

function registerMoveStartEvents() {
    document.querySelector('#subMoveBtn').addEventListener('mousedown', startMove);
    document.querySelector('#subMoveBtn').addEventListener('touchstart', startMove);
}
function removeMoveStartEvents() {
    document.querySelector('#subMoveBtn').removeEventListener('mousedown', startMove);
    document.querySelector('#subMoveBtn').removeEventListener('touchstart', startMove);
}
registerMoveStartEvents();

/*
    END SUB MOVE
*/

/*
    MINIMIZED
*/
function minTwOffline() {
    curPos = uiState.curSubPosition;
    if (curPos.sub == TW_CODE && !curPos.isMinimized)
        handleMinimization();
}
function maxTwOnline() {
    curPos = uiState.curSubPosition;
    if (curPos.sub == TW_CODE && curPos.isMinimized)
        handleMinimization();
}

function toggleMinimization() {
    let container = document.querySelector('.sub-video-container');
    SUB_VIDEO_POS.isMinimized = toggleClass(container, 'sub-minimized');
}

function removeMinimization() {
    let container = document.querySelector('.sub-video-container');
    container.removeEventListener('mousedown', startMove);
    container.removeEventListener('touchstart', startMove);

    toggleMinimization();

    placeSubVideoContainer(container);
    makeRatioSize(container.querySelectorAll('.video-16-9')[0], 0.5625, false);
}

function handleMinimization() {
    let container = document.querySelector('.sub-video-container');

    toggleMinimization();

    if (SUB_VIDEO_POS.left < 0.001) SUB_VIDEO_POS.left = 0.001;
    if (SUB_VIDEO_POS.top < 0.001) SUB_VIDEO_POS.top = 0.001;
    if (SUB_VIDEO_POS.left > 0.999) SUB_VIDEO_POS.left = 0.999;
    if (SUB_VIDEO_POS.top > 0.999) SUB_VIDEO_POS.top = 0.999;

    container.addEventListener('mousedown', startMove);
    container.addEventListener('touchstart', startMove);
    placeSubVideoContainer(container);
    makeRatioSize(container.querySelectorAll('.video-16-9')[0], 0.5625, false);
}

document.querySelector('#subMinimizeBtn').addEventListener('click', function (e) {
    e.preventDefault();
    handleMinimization();
});

/*
    END MINIMIZED
*/

/*
    SWITCH
*/

function switchPlayers() {
    removeMoveStartEvents();
    let subControlsContainer = document.querySelector('#subControlsContainer');
    subControlsContainer = subControlsContainer.parentNode.removeChild(subControlsContainer);

    let containers = document.querySelectorAll('.video-16-9-container');
    for (let index = 0; index < containers.length; index++) {
        const container = containers[index];

        toggleClass(container, 'main-video-container');
        toggleClass(container, 'sub-video-container');
    }
    handleTwQuality();

    document.querySelector('.sub-video-container').appendChild(subControlsContainer);
    registerMoveStartEvents();

    handleRatioContainers();
}

document.querySelector('#subSwitchBtn').addEventListener('click', function (e) {
    e.preventDefault();

    uiState.curSubPosition.sub = 1 - uiState.curSubPosition.sub;  

    switchPlayers();
})

/*
    END SWITCH
*/

/*
    CHAT
*/

document.querySelector('#chatBtn').addEventListener('click', function (e) {
    e.preventDefault();
    let playerContainer = document.querySelector('#playerContainer');

    let isOpening = toggleClass(playerContainer, 'chat-opened');
    toggleClass(document.querySelector('#chatContainer'), 'chat-opened');
    toggleClass(document.querySelector('#chatBtn'), 'chat-opened');

    const SCREEN_PART_MIN_FOR_PLAYER = 0.7;

    if (isOpening && playerContainer.clientWidth < document.documentElement.clientWidth * SCREEN_PART_MIN_FOR_PLAYER) {
        playerContainer.style.width = "100%";
    } else {
        playerContainer.removeAttribute('style');
    }

    handleRatioContainers();
})

/*
    END CHAT
*/

/*
    CONTROLS
*/
var players_ready = false;
function playersAreReadyNow() {
    let playerContainer = document.querySelector('#playerContainer')
    toggleClass(playerContainer, 'loading');
    toggleClass(playerContainer, 'loaded');

    players_ready = true;
}
function playPause() {

    if (players_ready) {
        toggleClass(document.querySelector('#playerContainer'), 'playing');
        toggleClass(document.querySelector('#playerContainer'), 'paused');
        startPlayers();
    }

}

document.querySelector('#playMainBtn').addEventListener('click', playPause);
document.querySelector('#playMidBtn').addEventListener('click', playPause);

document.querySelector('#fullMainBtn').addEventListener('click', function (e) {
    e.preventDefault();

    toggleFullScreen();

    handleRatioContainers();
})

/*
    END CONTROLS
*/

/*
    FULLSCREEN
*/

function toggleFullScreen() {

    let elem = document.getElementById("fullContainer");
    let is_fullscreen = checkFullscreen();

    if (!is_fullscreen) {
        is_fullscreen = true;

        if (elem.requestFullscreen) {

            elem.requestFullscreen();
        } else if (elem.mozRequestFullScreen) { /* Firefox */

            elem.mozRequestFullScreen();
        } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari and Opera */

            elem.webkitRequestFullscreen();
        } else if (elem.msRequestFullscreen) { /* IE/Edge */

            elem.msRequestFullscreen();
        }

    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.mozCancelFullScreen) { /* Firefox */
            document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) { /* Chrome, Safari and Opera */
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) { /* IE/Edge */
            document.msExitFullscreen();
        }
    }

    is_fullscreen = checkFullscreen();

    if (is_fullscreen && !checkClass(elem, 'fullscreen')) {
        toggleClass(elem, 'fullscreen');
    } else if (!is_fullscreen && checkClass(elem, 'fullscreen')) {
        toggleClass(elem, 'fullscreen');
    }

    return is_fullscreen;
}


/*
    END FULLSCREEN
*/

/*
    VOLUME
*/
let volHideTimers = [0,0];
const volBlockIds = ['#twVolInputBlock','#ytVolInputBlock'];
const HIDE_TIME = 3000;

function showVolumeBlock(id) {
    let inputBlock = document.querySelector(volBlockIds[id]);
    let playerId = id;
    if (checkClass(inputBlock, 'hidden')) {
        toggleClass(inputBlock, 'hidden');
        volHideTimers[playerId] = setTimeout(() => {
            toggleClass(inputBlock, 'hidden');
            volHideTimers[playerId] = 0;
        }, HIDE_TIME);
    }
}

function hideVolumeBlock(id) {
    volHideTimers[id] = setTimeout(() => {
        let inputBlock = document.querySelector(volBlockIds[id]);
        toggleClass(inputBlock, 'hidden');
    }, HIDE_TIME);
}

function updVolumeBlock(id) {
    clearTimeout(volHideTimers[id]);
    volHideTimers[id] = 0;
}

// yt-volume-controls
document.querySelector('#ytVolInputBlock').addEventListener('touchend', (e) => {
    e.stopPropagation();
});
document.querySelector('#ytVolMainBtn').addEventListener('touchend', (e) => {
    e.preventDefault();

    let inputBlock = document.querySelector(volBlockIds[YT_CODE]);
    if (checkClass(inputBlock, 'hidden')) {
        showVolumeBlock(YT_CODE);
    } else {
        ytMuteBtn(e);
    }
});
document.querySelector('#ytVolInputBlock').addEventListener('mouseenter', (e) => {
    updVolumeBlock(YT_CODE);
},);
document.querySelector('#ytVolInputBlock').addEventListener('mouseleave', (e) => {
    hideVolumeBlock(YT_CODE);
});
document.querySelector('#ytVolMainBtn').addEventListener('mouseenter', (e) => {
    showVolumeBlock(YT_CODE);
});

// tw-volume-controls
document.querySelector('#twVolInputBlock').addEventListener('touchend', (e) => {
    e.stopPropagation();
});
document.querySelector('#twVolMainBtn').addEventListener('touchend', (e) => {
    e.preventDefault();
    let inputBlock = document.querySelector(volBlockIds[TW_CODE]);
    if (checkClass(inputBlock, 'hidden')) {
        showVolumeBlock(TW_CODE);
    } else {
        twMuteBtn(e);
    }
});
document.querySelector('#twVolInputBlock').addEventListener('mouseenter', (e) => {
    updVolumeBlock(TW_CODE);
});
document.querySelector('#twVolInputBlock').addEventListener('mouseleave', (e) => {
    hideVolumeBlock(TW_CODE);
});
document.querySelector('#twVolMainBtn').addEventListener('mouseenter', (e) => {
    showVolumeBlock(TW_CODE);
});

// set-volumes-common
function setVolume(volume, is_yt) {
    if (is_yt) ytSetVolume(volume);
    else twSetVolume(volume);
}

function ytMuteBtn(e) {

    let volBtn = document.querySelector('#ytVolMainBtn');
    toggleClass(volBtn, 'muted');

    ytMute();

    return 0;
}
function twMuteBtn(e) {

    let volBtn = document.querySelector('#twVolMainBtn');
    toggleClass(volBtn, 'muted');

    twMute();

    return 0;
}

function handleVolPatch(e) {
    let is_yt = (e.currentTarget.id.slice(0, 2) === 'yt');

    let is_up = checkClass(e.currentTarget, 'volume-up-btn');


    let slider;
    if (is_yt) slider = document.querySelector('#ytVolInput');
    else slider = document.querySelector('#twVolInput');

    let curVol = parseInt(slider.value);

    if (is_up) curVol++;
    else curVol--;

    if (curVol < 1) curVol = 1;
    if (curVol > 100) curVol = 100;

    slider.value = curVol;
    setVolume(slider.value, is_yt)
}
document.querySelector('#ytVolUpBtn').addEventListener('click', handleVolPatch);
document.querySelector('#ytVolDnBtn').addEventListener('click', handleVolPatch);
document.querySelector('#twVolUpBtn').addEventListener('click', handleVolPatch);
document.querySelector('#twVolDnBtn').addEventListener('click', handleVolPatch);

function handleVolChange(e) {
    e.stopPropagation();
    let is_yt = (e.target.id.slice(0, 2) === 'yt');

    let volBtn;
    if (is_yt) volBtn = document.querySelector('#ytVolMainBtn');
    else volBtn = document.querySelector('#twVolMainBtn');

    removeClass(volBtn, 'vhig');
    removeClass(volBtn, 'vlow');

    let val = e.target.value;
    let slider = e.target;

    if (val <= 1) {
        val = 1;
        slider.value = 2;

        setClass(volBtn, 'vlow');
    } else
        setClass(volBtn, 'vhig');

    if (is_yt) ytSetVolume(val);
    else twSetVolume(val);
}

document.querySelector('#ytVolInput').addEventListener('change', handleVolChange);
document.querySelector('#ytVolBtnContainer').addEventListener('click', ytMuteBtn);

document.querySelector('#twVolInput').addEventListener('change', handleVolChange);
document.querySelector('#twVolBtnContainer').addEventListener('click', twMuteBtn);

/*
    END VOLUME
*/

/*
    CONTROLS HIDING
*/

const HIDE_CONTROLS_TIME = 5000;
let hideControlsTimer = 0;
const playerElement = document.querySelector('#playerContainer');

function hideControls() {
    let was_shown = setClass(playerElement, 'controls-hidden');

    if (was_shown) {
        clearTimeout(hideControlsTimer);
    }
}
playerElement.addEventListener('mouseleave', hideControls);

function showControls() {
    let was_hidden = removeClass(playerElement, 'controls-hidden');

    // reset timer if we had it set
    if (!was_hidden) {
        clearTimeout(hideControlsTimer);
    }

    let hideTime = HIDE_CONTROLS_TIME;
    if (checkClass(playerElement, 'syncing')) hideTime = 4*HIDE_CONTROLS_TIME;
    hideControlsTimer = setTimeout(() => {
        setClass(playerElement, 'controls-hidden');
    }, hideTime);
}
playerElement.addEventListener('mousemove', showControls);
playerElement.addEventListener('mouseenter', showControls);
playerElement.addEventListener('touchstart', showControls);

/*
    END CONTROLS HIDING
*/

/*
    SYNCING
*/

const syncBtnElement = document.querySelector('#syncStartMainBtn');
syncBtnElement.addEventListener('click', () => {
    let isSyncing = toggleClass(playerElement, 'syncing');

    if (isSyncing) {
        changeSubVideoPosition(SUB_SYNC_VIDEO_POS);
    } else {
        changeSubVideoPosition(SUB_VIDEO_POS);
    }
})

function updateSyncDisplay(newDelay) {
    let element = document.querySelector('#syncDelayDisplay');
    let inline = '';
    
    if (newDelay > 0.0) {
        inline += 'Ускорение: ';
    } else {
        inline += 'Задержака: ';
    }

    inline += Math.abs(newDelay).toFixed(1) + 'с';

    element.innerHTML = inline;
}
updateSyncDisplay(0);

document.querySelector('#syncDBackMainBtn').addEventListener('click', () => {
    let newDelay = updateYtDelay(-1.0);
    updateSyncDisplay(newDelay);
})
document.querySelector('#syncBackMainBtn').addEventListener('click', () => {
    let newDelay = updateYtDelay(-0.5);
    updateSyncDisplay(newDelay);
})
document.querySelector('#syncForwMainBtn').addEventListener('click', () => {
    let newDelay = updateYtDelay(0.5);
    updateSyncDisplay(newDelay);
})
document.querySelector('#syncDForwMainBtn').addEventListener('click', () => {
    let newDelay = updateYtDelay(1.0);
    updateSyncDisplay(newDelay);
})

/*
    END SYNCING
*/

document.querySelector('#stats').addEventListener('click', () => {
    toggleClass(document.querySelector('#stats'), 'stats-hidden');
})