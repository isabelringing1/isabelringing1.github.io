
var projectDict = {};
var pixelImages;
const pixelScalar = 0.3;
const animSpeed = 30;
var pixelActive = false;
var targetX;
var targetY;
var mobileCutoff = 768;
var lastMousePos = [0, 0];
var isSafari;

// On Page Load
$(function() {
    isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    setUpMenu();

    $("#exit").on("click", () => {toggleProjectMenu(false)});
    $("#hamburger").on("click", () => {toggleProjectMenu(true)});
    if (!isSafari){
        $(document).mousemove(function(e) {
            updatePixelImage(e.clientX, e.clientY);
        });
    }
    
    if (window.location.pathname.length > 1){
        $("#content")[0].style.display = "block";
        var id = window.location.pathname.substring(1) //gets rid of the leading /
        loadProject(id); 
        $("#" + id)[0].style.color = 'rgba(48, 28, 164, 0.8)';
    }
    else{
        if (!isSafari){
            setUpPixels();
        }

        $(".object").css({display: 'none'});
        loadProject("landing");
        if (isSafari){
            $("#pixels-fallback")[0].style.display = 'block'; 
            $("#pixels-fallback").click((e) => { window.location.href = '/about'; });
            $(".object").css({display: 'none'});
        }
    }
});

$(window).load(function() {
    if (window.innerWidth > mobileCutoff){
        $("img").click((e) => { if (e.target.id == "logo" || e.target.classList.contains('icon') || e.target.classList.contains('object')) return; toggleImgOverlay(e, true); });
        $("#overlay").click((e) => { toggleImgOverlay(e, false); });
    }
    else{
        $("#enter,.object").click((e) => { window.location.href = '/about'; });
    }
});

function setUpMenu(){
    for (var i = 0; i < content.projects.length; i++){
        var categoryDiv = document.getElementById(content.projects[i].category);
        if (categoryDiv){
            var subcategory = document.createElement("a");
            subcategory.classList = "subcategory";
            var num = categoryDiv.childElementCount;
            var title = content.projects[i].title;
            var url = title.replaceAll(" ", "-").replaceAll("'", "").replaceAll("(", "").replaceAll(")", "");
            subcategory.innerHTML = num + ". " + title + "<br>";
            subcategory.id = url;
            subcategory.href = "/" + url;
            subcategory.title =  content.projects[i].subtitle;
            projectDict[url] = content.projects[i];
            categoryDiv.appendChild(subcategory);
        }
    }
    projectDict["about"] = content.about;
    projectDict["landing"] = content.landing;
}

function loadProject(projectId){
    var project = projectDict[projectId];

    $(".title")[0].innerHTML = project.altTitle != undefined ? project.altTitle :  project.title;
    $(".subtitle")[0].style.display  = project.subtitle ? "block" : "none";
    $(".subtitle")[0].innerHTML = project.subtitle;
    $(".body")[0].innerHTML = project.body;

    if (projectId == "landing"){
        if (window.innerWidth > mobileCutoff){
            pixelActive = true;
        }
    }
    else{
        pixelActive = false;
    }
}

function toggleProjectMenu(show){
    if (window.location.pathname.substring(1) == "landing"){
        $(".object")[0].style.mixBlendMode = show ? "overlay" : "screen";
    }
    $("#projects")[0].style.opacity = show ? 1 : 0;
    $("#projects")[0].style.pointerEvents = show ? "auto" : "none";
    $("#content")[0].style.pointerEvents = show ? "none" : "auto";
    $("#logo-container")[0].style.pointerEvents = show ? "none" : "auto";
}

function toggleImgOverlay(e, show){
    $("#overlay")[0].style.display = show ? "flex" : "none";
    $('body')[0].style.overflow = show ? "hidden" : "visible";
    if (show){
        $("#overlay")[0].style.marginTop = window.scrollY + "px";
        $("#overlay-img")[0].src = e.target.src;
    }
}

function setUpPixels(){
    targetX = window.innerWidth / 2;
    targetY = window.innerHeight / 2;
    if (pixelImages == null){
        pixelImages = new Map();
        pixelImages.set("red", {
            xFollow: 1.8,
            yFollow: 0.5
        });
        pixelImages.set("green", {
            xFollow: -0.2,
            yFollow: -1
        });
        pixelImages.set("blue", {
            xFollow: -1.5,
            yFollow: 0.8
        }); 
    }

    pixelImages.get("red").currentPos = [(lastMousePos[0] - targetX) * pixelImages.get("red").xFollow + targetX, (lastMousePos[1] - targetY) * pixelImages.get("red").yFollow + targetY];

    pixelImages.get("green").currentPos = [(lastMousePos[0] - targetX) * pixelImages.get("green").xFollow + targetX, (lastMousePos[1] - targetY) * pixelImages.get("green").yFollow + targetY];

    pixelImages.get("blue").currentPos = [(lastMousePos[0] - targetX) * pixelImages.get("blue").xFollow + targetX, (lastMousePos[1] - targetY) * pixelImages.get("blue").yFollow + targetY]
    

    $("#red").css({
        left: pixelImages.get("red").currentPos[0], 
        top: pixelImages.get("red").currentPos[1], 
    });

    $("#green").css({
        left: pixelImages.get("green").currentPos[0], 
        top: pixelImages.get("green").currentPos[1], 
    });

    $("#blue").css({
        left: pixelImages.get("blue").currentPos[0], 
        top: pixelImages.get("blue").currentPos[1], 
    });
}

function updatePixelImage(x, y){
    if (!pixelActive){
        lastMousePos = [x, y];
        return;
    }
    $(".object").css({display: 'flex'});
    var xDelta = 0;
    var yDelta = 0;
    if (lastMousePos != null){
        xDelta = x - lastMousePos[0];
        yDelta = y - lastMousePos[1];
    }
    for (let [name, obj] of pixelImages) {
        var newLeft = obj.currentPos[0] + xDelta * obj.xFollow;
        var newTop = obj.currentPos[1] + yDelta * obj.yFollow;

        $("#" + name).css({
            left: newLeft,
            top: newTop,
        });
        obj.currentPos = [newLeft, newTop];

        if (closeEnough(newLeft, targetX, 1) && closeEnough(newTop, targetY, 1)){
            $('#red,#green').addClass("winState");
            setTimeout(() => {
                $('#red,#green').removeClass("winState");
            }, 1000);
            pixelActive = false;
            $("#red").css({left: targetX, top: targetY});
            $("#green").css({left: targetX, top: targetY});
            $("#blue").css({left: targetX, top: targetY});
            $(".object").click((e) => { window.location.href = '/about'; });
            return;
        }
    }
    lastMousePos = [x, y];
}

function closeEnough(a, b, diff){
    return Math.abs(a-b) < diff;
}