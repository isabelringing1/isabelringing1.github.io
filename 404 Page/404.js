var leftEyeCoord;
var rightEyeCoord;
var tongueOrigin;
var flyMap;
var tongueAvailable = true;
var frogsfx; //credit: https://freesound.org/people/emlync/sounds/512691/
var isPortrait;

const frogEyeOffsetX = "7.22vh";
const frogEyeOffsetY = "2.37vh";
const frogEyeDimension = "11.56vh";
const tongueWidth = "3.095vh"
const mouthWidth = "61.30vh"

const flyCoords = [[1, 13], [2, 11], [3, 13], [3, 9], [4, 7], [5, 5], [5, 13], [7, 1], [6, 3], [7, 13], [9, 1], [9, 3], [9, 5], [9, 7], [9, 9], [9, 11], [9, 13], [9, 15], [9, 17],
                   [15, 4], [15, 6], [15, 8], [15, 10], [15, 12], [15, 14], [16, 2], [16, 16], [19, 1], [19, 17], [22, 2], [22, 16], [23, 4], [23, 6], [23, 8], [23, 10], [23, 12], [23, 14],
                   [28, 13], [29, 11], [30, 9], [30, 13], [31, 7], [32, 5], [32, 13], [33, 3], [34, 1], [34, 13], [36, 1], [36, 3], [36, 5], [36, 7], [36, 9], [36, 11], [36, 13], [36, 15], [36, 17]];

window.onload = (event) => {
    addEventListener('click', onClick);
    addEventListener('mousemove', onMouseMove);
    addEventListener('resize', setCoordinateValues);

    flyMap = new Map();
    frogsfx = new Audio('frog.wav');
    makeFlies();
    setInterval(vibrateFlies, 100);
    setCoordinateValues();
};

function getPixelValue(value){
    var percent = Number(value.slice(0, -2));
    if (isPortrait){
        return Math.floor(percent / 100 * window.innerWidth);
    }
    return Math.floor(percent / 100 * window.innerHeight);
}

function getViewHeightValue(pixel){
    if (isPortrait){
        return (pixel / window.innerWidth * 100) + "vw";
    }
    return (pixel / window.innerHeight * 100) + "vh";
}

function setCoordinateValues(){
    isPortrait = window.innerHeight > window.innerWidth;
    height = window.innerHeight - ($("#frog-img")[0].height - getPixelValue(frogEyeOffsetY)) + (getPixelValue(frogEyeDimension)/2);
    middle = window.innerWidth / 2;
    leftEyeCoord = [middle - ($("#frog-img")[0].width / 2 - getPixelValue(frogEyeOffsetX)) + (getPixelValue(frogEyeDimension)/2), height];
    rightEyeCoord = [middle + ($("#frog-img")[0].width / 2 - getPixelValue(frogEyeOffsetX)) - (getPixelValue(frogEyeDimension)/2), height];
    tongueOrigin = [middle, window.innerHeight];
    $('#tongue')[0].style.marginLeft = (middle - (getPixelValue(tongueWidth)/2)) + "px";
    $('#mouth')[0].style.marginLeft = (middle - (getPixelValue(mouthWidth)/2)) + "px";
}

function onClick(e){
    if (!tongueAvailable){
        return;
    }
    var coords = [e.clientX, e.clientY];
    var tongueDegree = getDegree(coords, tongueOrigin);
    if (Math.abs(tongueDegree) > 80){
        return;
    }

    tongueAvailable = false;
    frogsfx.play();
    var len = getDist(coords, tongueOrigin);
    $('#tongue')[0].style.rotate = tongueDegree + "deg";
    $('#tongue')[0].classList.add("animated");
    $(":root")[0].style.setProperty('--tongue-height', len + 'px');
    setTimeout(() => {
        $('#tongue')[0].classList.remove("animated");
        tongueAvailable = true;
    }, 300);
}

function onMouseMove(e){
    var coords = [e.clientX, e.clientY];
    var leftDegree = getDegree(coords, leftEyeCoord);
    var rightDegree = getDegree(coords, rightEyeCoord);
    setEyes(leftDegree, rightDegree);
}

function setEyes(leftEyeDegree, rightEyeDegree){
    $('#left-eye')[0].style.rotate = Math.floor(leftEyeDegree) + "deg";
    $('#right-eye')[0].style.rotate = Math.floor(rightEyeDegree) + "deg";
}

function makeFlies(){
    flyCoords.forEach((coord) => {
        var div = document.createElement("div");
        var img = document.createElement("img");
        img.src = "fly.png";
        img.classList.add("fly-img");
        div.appendChild(img);
        div.style.gridRow = coord[1];
        div.style.gridColumn = coord[0];
        div.classList.add("fly");
        div.id = coord[1] + "-" + coord[0];
        flyMap.set(div.id, div);
        div.addEventListener('click', onFlyClick);
        $("#fly-grid").append(div);
    });
}

function onFlyClick(event){
    if (!tongueAvailable){
        return;
    }
    var target = event.target.closest('.fly');
    setTimeout(() =>{
        flyMap.delete(target.id);
        target.remove();
        checkDone();
    }, 250);
    
}

function vibrateFlies(){
    flyMap.forEach((fly, id) => {
        fly.style.marginLeft = getViewHeightValue(getRandomNumber(5));
        fly.style.marginTop = getViewHeightValue(getRandomNumber(5));
    });
}

function getDegree(p1, p2){
    return Math.atan2(p2[1] - p1[1], p2[0] - p1[0]) * 180 / Math.PI - 90;
}

function getRandomNumber (max){
    return Math.floor(Math.random() * max);
}

function getDist(p1, p2){
    return Math.sqrt(Math.pow(p2[1] - p1[1], 2) + Math.pow(p2[0] - p1[0], 2));
}

function checkDone(){
    if(flyMap.size == 0){
        $("#frog-img").attr("src","frog_done.png");
        $("#left-eye")[0].style.display = "none";
        $("#right-eye")[0].style.display = "none";
        tongueAvailable = false;
    }
}