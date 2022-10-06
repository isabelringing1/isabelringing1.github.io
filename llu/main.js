var startingY = -1;
var lastY = -1;
var startingX = -1;
var lastX = -1;
var percentToSwipeY = 15;
var percentToSwipeX = 15;
var scrolling = false;
var scrollTimeout;
var isMoving = false;
var map;

var currentPage = 0;
var currentImage = 0;
var totalImages = 0;
var pages =[];

// On Page Load
$(function() {
    $.getJSON('data.json', function(jsonData, status, xhr){
        data = jsonData;
        map = new Map();
        artCaptionMap = new Map();
        for (var i = 0; i < data.data.length; i++){
            var bg = data.data[i].background;
            var overlays = data.data[i].overlays;
            var text = data.data[i].text;
            map.set(i, [bg, overlays, text]);

            var component = $('<div class = "component" id="component' + i + '" draggable="true">');
            component.appendTo('#container');

            var img = $('<img class = "image" id="image' + i + '">');
            img.attr('src', "../llu/images/" + bg);
            img.appendTo('#component' + i);

            var overlayDiv = $('<div class = "overlayDiv" id="overlayDiv' + i + '" draggable="true">');
            overlayDiv.appendTo('#component' + i);
            for (var j = 0; j < overlays.length; j++){
                var overlay = $('<img class = "overlay" id="overlay' + i + "-" + j + '">');
                overlay.attr('src', "../llu/images/" + overlays[j]);
                overlay.appendTo('#overlayDiv' + i);
            }
            if (typeof text !== 'undefined'){
                var textOverlay = $('<img class = "text" id="text' + i + "." + j + '">');
                textOverlay.attr('src', "../llu/images/" + text);
                textOverlay.appendTo('#component' + i);
            }
            pages.push(img);
        }
        console.log(map);
        totalImages = map.get(currentPage)[1].length;
    });


    document.addEventListener("drag", drag);
    document.addEventListener("dragend", dragEnd);
    // magic function that makes dragend snappy
    document.addEventListener("dragover", function( event ) {
        event.preventDefault();
    }, false);

    document.addEventListener("touchmove", touchMove);
    document.addEventListener("touchend", touchEnd);

    document.addEventListener('contextmenu', event => event.preventDefault());
});

function goToCurrentPage(needUpdate){
    isMoving = true;
    if (needUpdate){
        currentImage = 0;
        totalImages = map.get(currentPage)[1].length;
        console.log("Total images updated to " + totalImages);
    }
    var marginTop = parseInt($('#container')[0].style.marginTop.slice(0, -2));
    var pageHeight =  pages[currentPage][0].height;
    var targetMarginTop = currentPage * pageHeight * -1;
    var diff = targetMarginTop - marginTop;
    $('#container').animate({
        marginTop: '+=' + diff + 'px'
    }, 400);
    setTimeout(() => {isMoving = false;}, 400);
}

function goToCurrentImage(){
    var w = $("#overlay" + currentPage + "-0")[0].width;
    console.log("image width: " + w);
    isMoving = true;
    var overlayDivLeft = parseInt($("#overlayDiv" + currentPage)[0].style.left.slice(0, -2));
    var targetOverlayDivLeft = currentImage * w * -1;
    var diff = targetOverlayDivLeft - overlayDivLeft;

    $("#overlayDiv" + currentPage).animate({
        left: '+=' + diff + 'px'
    }, 400);
    setTimeout(() => {isMoving = false;}, 400);
}

// Event handling
function drag(ev) {
    moveY(ev.pageY);
    moveX(ev.pageX);
}

function dragEnd(ev) {
    moveYEnd();
    moveXEnd();
}

function touchMove(ev){
    moveY(ev.touches[0].screenY);
    moveX(ev.touches[0].screenX);
}

function touchEnd(ev){
    moveYEnd();
    moveXEnd();
}

function moveY(currentY){
    if (isMoving) { return; }
    else if (lastY == -1){
        lastY = currentY;
        startingY = currentY;
        return;
    }
    else if (currentY == 0){ return; }

    var marginTop = parseInt($('#container')[0].style.marginTop.slice(0, -2));

    if (isNaN(marginTop)){
        marginTop = 0;
    }

    marginTop += currentY - lastY;

    $('#container')[0].style.marginTop = marginTop + "px";
    lastY = currentY;
}

function moveX(currentX){
    if (isMoving) { return; }
    else if (map.get(currentPage)[1].length == 1) { return; }
    else if (lastX == -1){
        lastX = currentX;
        startingX = currentX;
        return;
    }
    var overlayDivId = "#overlayDiv" + currentPage;
    var overlayDivLeft = parseInt($(overlayDivId)[0].style.left.slice(0, -2));

    if (isNaN(overlayDivLeft)){
        overlayDivLeft = 0;
    }

    overlayDivLeft += currentX - lastX;
    $(overlayDivId)[0].style.left = overlayDivLeft + "px";
    lastX = currentX;
}

function moveYEnd(){
    var difference = startingY - lastY;
    var percentDragged = 100 * (difference / screen.height);
    var changedPage = false;
    if (percentDragged > percentToSwipeY && currentPage + 1 < pages.length){
        currentPage++;
        changedPage = true;
    }
    else if (percentDragged < -percentToSwipeY && currentPage != 0){
        currentPage--;
        changedPage = true;

    }
    lastY = -1;
    startingY = -1;
    goToCurrentPage(changedPage);
}

function moveXEnd(){
    var ov = $("#overlay" + currentPage + "-0")[0];
    var difference = startingX - lastX;
    var percentDragged = 100 * (difference / ov.width);
    console.log(difference, ov.width, percentDragged);
    if (percentDragged > percentToSwipeX && currentImage + 1 < totalImages){
        currentImage++;
        console.log("current image + " + currentImage);
    }
    else if (percentDragged < -percentToSwipeX && currentImage != 0){
        currentImage--;
        console.log("current image - " + currentImage);
    }

    lastX = -1;
    startingX = -1;
    goToCurrentImage();
}

$(function() {
    $(window).bind('mousewheel', function(event, delta) {
        moveY(-event.originalEvent.deltaY);
        scrolling = true;
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {moveYEnd()}, 300);
    });
});
