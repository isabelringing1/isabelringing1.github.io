var images = ["bg.png", "bg.png", "bg.png"];

var startingY = -1;
var lastY = -1;
var percentToSwipe = 15;
var scrolling = false;
var scrollTimeout;
var isMoving = false;

var currentPage = 0;
var pages =[];

// On Page Load
$(function() {
    for (var i = 0; i < images.length; i++){
        var img = $('<img class = "image" id="image' + i + '" draggable="true">');
        img.attr('src', "../llu/images/" + images[i]);
        img.appendTo('#container');
        pages.push(img);
    }

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

function goToCurrentPage(){
    isMoving = true;
    var marginTop = parseInt($('#container')[0].style.marginTop.slice(0, -2));
    var pageHeight =  pages[currentPage][0].height;
    var targetMarginTop = currentPage * pageHeight * -1;
    var diff = targetMarginTop - marginTop;
    console.log(currentPage, targetMarginTop, marginTop, diff)
    $('#container').animate({
        marginTop: '+=' + diff + 'px'
    }, 400);
    setTimeout(() => {isMoving = false;}, 400);
}

// Event handling
function drag(ev) {
    move(ev.pageY);
}

function dragEnd(ev) {
    moveEnd();
}

function touchMove(ev){
    move(ev.touches[0].screenY);
}

function touchEnd(ev){
    moveEnd();
}

function move(currentY){
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

    $('#container')[0].style.marginTop =  marginTop + "px";
    lastY = currentY;
}

function moveEnd(){
    var difference = startingY - lastY;
    var percentDragged = 100 * (difference / screen.height);
    console.log("percent dragged: " + percentDragged);
    if (percentDragged > percentToSwipe && currentPage + 1 < images.length){
        currentPage++;
    }
    else if (percentDragged < -percentToSwipe && currentPage != 0){
        currentPage--;
    }

    lastY = -1;
    startingY = -1;

    goToCurrentPage();
}

$(function() {
    $(window).bind('mousewheel', function(event, delta) {
        move(-event.originalEvent.deltaY);
        scrolling = true;
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {moveEnd()}, 300);
    });
});
