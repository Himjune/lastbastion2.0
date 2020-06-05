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