function toggleClass(element, className) {
    if (element.classList) {
        element.classList.toggle(className);
    } else {
        // For IE9
        var classes = element.className.split(" ");
        var i = classes.indexOf(className);

        if (i >= 0)
            classes.splice(i, 1);
        else
            classes.push(className);
        element.className = classes.join(" ");
    }
}

function checkClass(element, className) {
    let res = false;

    if (element.classList) {
        res = element.classList.contains(className);
    } else {
        // For IE9
        var classes = element.className.split(" ");
        var i = classes.indexOf(className);

        if (i >= 0)
            res = true;
        else
            res = false;
    }

    return res;
}

function checkFullscreen() {
    return !((document.fullScreenElement !== undefined && document.fullScreenElement === null) ||
        (document.msFullscreenElement !== undefined && document.msFullscreenElement === null) ||
        (document.mozFullScreen !== undefined && !document.mozFullScreen) ||
        (document.webkitIsFullScreen !== undefined && !document.webkitIsFullScreen));
}

function util_get_query_param(param_name) {
    let param_val = '' // '' will be returned if there is no such param

    const hash_string = decodeURIComponent(parent.location.hash)
    if (hash_string.length > 0) {
        // starting from char 1 to skip first '#'
        const param_strings = hash_string.substring(1).split('&')
        param_strings.forEach(function (str) {
            const cur_param_splited = str.split('=')
            if (cur_param_splited[0] === param_name) {
                param_val = cur_param_splited[1]
            }
        })
    }

    return param_val
}