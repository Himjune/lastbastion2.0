function makeRatioSize (element, ratio) {
    let parent = element.parentElement;

    console.log('p', parent, parent.offsetWidth, parent.offsetHeight);

    let isFullWidth = true;
    let targetWidth = parent.offsetWidth;
    let targetHeight = Math.floor(targetWidth*ratio);

    console.log('ft', targetWidth, targetHeight)

    if (parent.offsetHeight > 0 && targetHeight > parent.offsetHeight) {
        isFullWidth = false;
        targetHeight = parent.offsetHeight

        ratio = 1/ratio;
        targetWidth = Math.floor(targetHeight*ratio);
    }

    element.style.width = targetWidth+'px';
    element.style.height = targetHeight+'px';

    console.log(element, isFullWidth, targetWidth, targetHeight);

    return isFullWidth;
}  

function handleRatioContainers () {
    let ratioContainers = document.getElementsByClassName("video-16-9");
    for (let index = 0; index < ratioContainers.length; index++) {
        const element = ratioContainers[index];
        
        makeRatioSize(element, 0.5625);
    }

}

window.addEventListener("resize", handleRatioContainers);
handleRatioContainers();